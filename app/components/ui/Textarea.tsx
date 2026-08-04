import type { TextareaHTMLAttributes } from "react";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};

export function Textarea({
  className = "",
  error = false,
  ...props
}: TextareaProps) {
  return (
    <textarea
      aria-invalid={error || undefined}
      className={`min-h-32 w-full resize-y rounded-control border bg-app/70 px-4 py-3 text-sm leading-6 text-text-primary shadow-inner shadow-black/10 transition duration-[var(--transition-fast)] placeholder:text-text-muted hover:border-border-strong focus:border-accent-cyan/60 focus:ring-2 focus:ring-accent-cyan/15 disabled:cursor-not-allowed disabled:opacity-60 ${
        error ? "border-red-400/45" : "border-border-soft"
      } ${className}`}
      {...props}
    />
  );
}
