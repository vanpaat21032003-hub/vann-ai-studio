import { createBrowserClient } from "@supabase/ssr";

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

export function createClient() {
  const { publishableKey, url } = getSupabaseEnvironment();

  return createBrowserClient(url, publishableKey);
}
