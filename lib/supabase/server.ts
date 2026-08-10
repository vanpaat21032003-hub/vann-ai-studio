import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { cache } from "react";

const SUPABASE_HEALTH_TIMEOUT_MS = 5_000;

function getSupabaseEnvironment() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL. Add your Supabase project URL to .env.local.",
    );
  }

  if (!publishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Add your Supabase publishable key to .env.local.",
    );
  }

  return { publishableKey, url };
}

const createClientForRequest = cache(async () => {
  const { publishableKey, url } = getSupabaseEnvironment();
  const cookieStore = await cookies();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, options, value }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. The Proxy refreshes the
          // session before rendering authenticated routes.
        }
      },
    },
  });
});

export async function createClient() {
  return createClientForRequest();
}

export async function checkSupabaseConnection() {
  try {
    await connection();

    const { publishableKey, url } = getSupabaseEnvironment();
    const response = await fetch(new URL("/auth/v1/health", url), {
      cache: "no-store",
      headers: {
        apikey: publishableKey,
      },
      signal: AbortSignal.timeout(SUPABASE_HEALTH_TIMEOUT_MS),
    });

    return response.ok;
  } catch {
    return false;
  }
}
