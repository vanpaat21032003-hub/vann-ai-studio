import type { HTMLAttributes } from "react";

type BadgeVariant = "neutral" | "cyan" | "violet" | "success";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "border-border-soft bg-surface-highlight text-text-secondary",
  cyan: "border-accent-cyan/20 bg-accent-cyan/10 text-cyan-200",
  violet: "border-accent-violet/20 bg-accent-violet/10 text-violet-200",
  success: "border-accent-success/20 bg-accent-success/10 text-emerald-200",
};

export function Badge({
  className = "",
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex min-h-7 items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
