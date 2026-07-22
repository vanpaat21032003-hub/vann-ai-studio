import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function hasAuthenticatedSession() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();

    return !error && Boolean(data?.claims?.sub);
  } catch {
    return false;
  }
}

export async function requireAuthenticatedSession() {
  if (!(await hasAuthenticatedSession())) {
    redirect("/login");
  }
}
