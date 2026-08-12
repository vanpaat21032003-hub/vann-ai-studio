"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const INVALID_LOGIN_MESSAGE =
  "Unable to sign in. Check your email and password and try again.";

export type LoginState = {
  error: string | null;
  success: boolean;
};

export async function signIn(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return { error: INVALID_LOGIN_MESSAGE, success: false };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { error: INVALID_LOGIN_MESSAGE, success: false };
    }
  } catch {
    return { error: INVALID_LOGIN_MESSAGE, success: false };
  }

  return { error: null, success: true };
}

export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Keep authentication failures private and return to the public login page.
  }

  redirect("/login");
}
