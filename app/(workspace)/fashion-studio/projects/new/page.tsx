import Link from "next/link";

import { ProjectForm } from "@/app/components/projects/ProjectForm";
import { Card } from "@/app/components/ui/Card";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { getProjectFormOptions } from "@/lib/projects/data";

export default async function NewProjectPage() {
  const options = await getProjectFormOptions();

  return (
    <div>
      <Link className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-accent-cyan" href="/fashion-studio/projects">
        <span aria-hidden="true">←</span>Projects
      </Link>
      <PageHeader description="Start a durable draft around one product. Model and style can be added now or later." eyebrow="Projects" title="New project" />
      {options.products.length === 0 ? (
        <Card className="mt-[var(--space-section)]">
          <EmptyState
            action={<Link className="inline-flex min-h-10 items-center justify-center rounded-control border border-border-strong bg-surface-highlight px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-accent-cyan/40 hover:bg-surface-soft" href="/fashion-studio/products/new">Add a product</Link>}
            description="Projects need a product. Add one to the Product Library before creating a draft."
            title="No products available"
          />
        </Card>
      ) : <ProjectForm mode="create" options={options} />}
    </div>
  );
}
