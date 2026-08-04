import Link from "next/link";

import { AppIcon } from "@/app/components/ui/AppIcon";
import { Card } from "@/app/components/ui/Card";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { PageHeader } from "@/app/components/ui/PageHeader";

export default function FashionBrainPage() {
  return (
    <div>
      <PageHeader
        description="Develop creative direction and product insights."
        eyebrow="Creative intelligence"
        title="Fashion Brain"
      />
      <Card className="mt-[var(--space-section)]">
        <EmptyState
          description="Product analysis and structured creative direction are planned for a later approved sprint. No provider or database activity runs on this page."
          icon={<AppIcon className="size-5" name="brain" />}
          title="Intelligence workspace prepared"
        />
      </Card>
      <Card interactive className="mt-4">
        <Link
          className="group flex items-center justify-between gap-5 p-5 sm:p-6"
          href="/fashion-brain/presets"
        >
          <div className="flex min-w-0 items-center gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-card border border-accent-violet/15 bg-gradient-to-br from-accent-violet/10 to-accent-cyan/10 text-accent-violet">
              <AppIcon className="size-5" name="brain" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-text-primary">
                Prompt Presets Library
              </h2>
              <p className="mt-1 text-sm leading-6 text-text-secondary">
                Save and reuse prompt templates for consistent creative work.
              </p>
            </div>
          </div>
          <AppIcon
            className="size-4 shrink-0 text-text-muted transition group-hover:translate-x-0.5 group-hover:text-accent-cyan"
            name="arrow"
          />
        </Link>
      </Card>
    </div>
  );
}
