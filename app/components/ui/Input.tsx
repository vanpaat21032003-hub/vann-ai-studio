import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export function Input({ className = "", error = false, ...props }: InputProps) {
  return (
    <input
      aria-invalid={error || undefined}
      className={`min-h-12 w-full rounded-control border bg-app/70 px-4 py-3 text-sm text-text-primary shadow-inner shadow-black/10 transition duration-[var(--transition-fast)] placeholder:text-text-muted hover:border-border-strong focus:border-accent-cyan/60 focus:ring-2 focus:ring-accent-cyan/15 disabled:cursor-not-allowed disabled:opacity-60 ${
        error ? "border-red-400/45" : "border-border-soft"
      } ${className}`}
      {...props}
    />
  );
}
