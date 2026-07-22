import { redirect } from "next/navigation";

import LoginForm from "./LoginForm";
import { hasAuthenticatedSession } from "@/lib/supabase/auth";

export default async function LoginPage() {
  if (await hasAuthenticatedSession()) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-12 text-white">
      <section className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl shadow-black/20">
        <p className="text-sm font-medium tracking-wide text-zinc-400">
          Vann AI Studio
        </p>
        <h1 className="mt-3 text-3xl font-bold">Private workspace sign in</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Sign in with the existing owner account to continue to the workspace.
        </p>

        <LoginForm />
      </section>
    </main>
  );
}
