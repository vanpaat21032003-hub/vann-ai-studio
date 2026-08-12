import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

const getVerifiedAuthContext = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const ownerId = data?.claims?.sub;

  if (error || typeof ownerId !== "string" || !ownerId) {
    return null;
  }

  return { ownerId, supabase };
});

export async function getAuthenticatedContext() {
  const context = await getVerifiedAuthContext();

  if (!context) {
    redirect("/login");
  }

  return context;
}

export async function hasAuthenticatedSession() {
  try {
    return Boolean(await getVerifiedAuthContext());
  } catch {
    return false;
  }
}

export async function requireAuthenticatedSession() {
  if (!(await hasAuthenticatedSession())) {
    redirect("/login");
  }
}
