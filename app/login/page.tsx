import { redirect } from "next/navigation";

import LoginForm from "./LoginForm";
import { AppIcon } from "@/app/components/ui/AppIcon";
import { Badge } from "@/app/components/ui/Badge";
import { Card } from "@/app/components/ui/Card";
import { hasAuthenticatedSession } from "@/lib/supabase/auth";

export default async function LoginPage() {
  if (await hasAuthenticatedSession()) {
    redirect("/dashboard");
  }

  return (
    <main className="relative isolate flex min-h-screen items-center overflow-hidden px-5 py-10 sm:px-8 lg:px-12">
      <div
        aria-hidden="true"
        className="absolute left-[12%] top-[15%] -z-10 size-72 rounded-full bg-accent-cyan/8 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[8%] right-[10%] -z-10 size-80 rounded-full bg-accent-violet/10 blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-20">
        <section className="hidden max-w-xl lg:block">
          <div className="mb-8 grid size-14 place-items-center rounded-panel border border-accent-cyan/20 bg-gradient-to-br from-accent-cyan/15 to-accent-violet/15 text-accent-cyan shadow-glow">
            <AppIcon className="size-7" name="sparkles" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-cyan">
            Vann AI Studio
          </p>
          <h2 className="mt-5 max-w-lg text-4xl font-semibold tracking-[-0.04em] text-text-primary xl:text-5xl">
            Your private creative intelligence workspace.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-text-secondary">
            Organize affiliate concepts, creative direction, motion, and publishing
            preparation in one calm, focused environment.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 text-sm text-text-secondary">
            <Badge variant="cyan">Focused workflows</Badge>
            <Badge variant="violet">Private access</Badge>
            <Badge>Creative operations</Badge>
          </div>
        </section>

        <Card className="w-full rounded-panel p-6 shadow-panel sm:p-8">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="grid size-10 place-items-center rounded-card border border-accent-cyan/20 bg-accent-cyan/10 text-accent-cyan">
              <AppIcon className="size-5" name="sparkles" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">
                Vann AI Studio
              </p>
              <p className="text-xs text-text-muted">Private AI workspace</p>
            </div>
          </div>

          <Badge className="mt-8 lg:mt-0" variant="cyan">
            <AppIcon className="size-3.5" name="lock" />
            Owner access
          </Badge>
          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-text-primary">
            Sign in to your workspace
          </h1>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Use the existing owner account to continue. Access remains private and
            protected.
          </p>

          <LoginForm />
        </Card>
      </div>
    </main>
  );
}
