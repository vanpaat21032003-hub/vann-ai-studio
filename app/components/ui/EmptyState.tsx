import type { ReactNode } from "react";

export type EmptyStateProps = {
  action?: ReactNode;
  description: string;
  icon?: ReactNode;
  title: string;
};

export function EmptyState({
  action,
  description,
  icon,
  title,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center px-6 py-10 text-center">
      {icon ? (
        <div className="mb-5 grid size-12 place-items-center rounded-card border border-border-soft bg-surface-highlight text-accent-cyan shadow-glow">
          {icon}
        </div>
      ) : null}
      <h3 className="text-base font-semibold tracking-tight text-text-primary">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
