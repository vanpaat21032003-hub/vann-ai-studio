import type { ReactNode } from "react";

export type SectionHeadingProps = {
  action?: ReactNode;
  description?: string;
  title: string;
};

export function SectionHeading({
  action,
  description,
  title,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-text-primary">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
