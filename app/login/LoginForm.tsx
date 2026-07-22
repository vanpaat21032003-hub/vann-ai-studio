"use client";

import { useActionState } from "react";

import { signIn, type LoginState } from "@/app/actions/auth";
import { AppIcon } from "@/app/components/ui/AppIcon";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";

const initialState: LoginState = { error: null };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);
  const hasError = Boolean(state.error);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div>
        <label
          className="mb-2 block text-sm font-medium text-text-primary"
          htmlFor="email"
        >
          Email
        </label>
        <Input
          aria-describedby={hasError ? "login-error" : undefined}
          autoComplete="email"
          disabled={pending}
          error={hasError}
          id="email"
          name="email"
          placeholder="Enter your email"
          required
          type="email"
        />
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-medium text-text-primary"
          htmlFor="password"
        >
          Password
        </label>
        <Input
          aria-describedby={hasError ? "login-error" : undefined}
          autoComplete="current-password"
          disabled={pending}
          error={hasError}
          id="password"
          name="password"
          placeholder="Enter your password"
          required
          type="password"
        />
      </div>

      <p
        aria-live="polite"
        className="min-h-5 text-sm text-accent-danger"
        id="login-error"
        role={hasError ? "alert" : undefined}
      >
        {state.error}
      </p>

      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Signing in…" : "Sign in"}
        {!pending ? <AppIcon className="size-4" name="arrow" /> : null}
      </Button>

      <p className="text-center text-xs leading-5 text-text-muted">
        Private workspace. No public account registration.
      </p>
    </form>
  );
}
