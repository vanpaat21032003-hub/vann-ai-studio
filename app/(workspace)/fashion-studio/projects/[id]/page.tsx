import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/app/components/ui/Badge";
import { Card } from "@/app/components/ui/Card";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { getOwnedProject } from "@/lib/projects/data";
import { getProjectStatusLabel } from "@/lib/projects/schema";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function MetadataItem({ label, value }: { label: string; value: string | null }) {
  return <div className="min-w-0 rounded-control border border-border-soft bg-surface-soft p-4"><dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-text-muted">{label}</dt><dd className="mt-2 break-words text-sm leading-6 text-text-primary">{value || "Not selected"}</dd></div>;
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getOwnedProject(id);

  if (!project) notFound();

  return (
    <div>
      <Link className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-accent-cyan" href="/fashion-studio/projects"><span aria-hidden="true">←</span>Projects</Link>
      <PageHeader
        action={<Link className="inline-flex min-h-12 items-center justify-center rounded-control border border-border-strong bg-surface-highlight px-5 py-3 text-sm font-semibold text-text-primary transition hover:border-accent-cyan/40 hover:bg-surface-soft" href={`/fashion-studio/projects/${project.id}/edit`}>Edit project</Link>}
        description="This draft holds the creative context for future prompts and generated assets."
        eyebrow="Project detail"
        title={project.project_name}
      />
      <div className="mt-6"><Badge variant="cyan">{getProjectStatusLabel(project.status)}</Badge></div>
      <Card className="mt-[var(--space-section)] p-5 sm:p-7">
        <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetadataItem label="Product" value={project.product.name} />
          <MetadataItem label="Model" value={project.model?.name ?? null} />
          <MetadataItem label="Style" value={project.style?.name ?? null} />
          <MetadataItem label="Status" value={getProjectStatusLabel(project.status)} />
          <MetadataItem label="Created" value={formatDate(project.created_at)} />
          <MetadataItem label="Updated" value={formatDate(project.updated_at)} />
        </dl>
      </Card>
    </div>
  );
}
