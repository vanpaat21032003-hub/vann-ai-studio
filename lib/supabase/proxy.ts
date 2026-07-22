import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SESSION_RESPONSE_HEADERS = ["cache-control", "expires", "pragma"];

function getSupabaseEnvironment() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    return null;
  }

  return { publishableKey, url };
}

function redirectWithSessionCookies(
  request: NextRequest,
  responseWithSession: NextResponse,
  pathname: string,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";

  const response = NextResponse.redirect(url);
  responseWithSession.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });

  SESSION_RESPONSE_HEADERS.forEach((headerName) => {
    const value = responseWithSession.headers.get(headerName);

    if (value) {
      response.headers.set(headerName, value);
    }
  });

  return response;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const environment = getSupabaseEnvironment();
  const isLoginPage = request.nextUrl.pathname === "/login";

  if (!environment) {
    return isLoginPage
      ? supabaseResponse
      : redirectWithSessionCookies(request, supabaseResponse, "/login");
  }

  const supabase = createServerClient(
    environment.url,
    environment.publishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, options, value }) => {
            supabaseResponse.cookies.set(name, value, options);
          });

          Object.entries(headers).forEach(([name, value]) => {
            supabaseResponse.headers.set(name, value);
          });
        },
      },
    },
  );

  let isAuthenticated = false;

  try {
    const { data, error } = await supabase.auth.getClaims();
    isAuthenticated = !error && Boolean(data?.claims?.sub);
  } catch {
    isAuthenticated = false;
  }

  if (!isAuthenticated && !isLoginPage) {
    return redirectWithSessionCookies(request, supabaseResponse, "/login");
  }

  if (isAuthenticated && isLoginPage) {
    return redirectWithSessionCookies(request, supabaseResponse, "/dashboard");
  }

  return supabaseResponse;
}
