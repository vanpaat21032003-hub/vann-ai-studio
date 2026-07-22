import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-violet text-white shadow-glow hover:brightness-110 disabled:hover:brightness-100",
  secondary:
    "border border-border-strong bg-surface-highlight text-text-primary hover:border-accent-cyan/40 hover:bg-surface-soft",
  ghost:
    "text-text-secondary hover:bg-surface-highlight hover:text-text-primary",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-10 px-3.5 py-2 text-sm",
  md: "min-h-12 px-5 py-3 text-sm",
};

export function Button({
  className = "",
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-control font-semibold transition duration-[var(--transition-fast)] ease-[var(--ease-ui)] disabled:cursor-not-allowed disabled:opacity-55 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      type={type}
      {...props}
    />
  );
}
