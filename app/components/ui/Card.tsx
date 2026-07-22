import type { HTMLAttributes } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export function Card({
  className = "",
  interactive = false,
  ...props
}: CardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-card border border-border-soft bg-surface-elevated shadow-card backdrop-blur-xl before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent ${
        interactive
          ? "transition duration-[var(--transition-standard)] ease-[var(--ease-ui)] hover:-translate-y-0.5 hover:border-border-strong hover:shadow-glow"
          : ""
      } ${className}`}
      {...props}
    />
  );
}
