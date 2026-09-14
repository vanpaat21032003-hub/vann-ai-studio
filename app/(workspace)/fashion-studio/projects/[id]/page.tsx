import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GeneratedImageUpload } from "@/app/components/generated-images/GeneratedImageUpload";
import { GeneratedImageSection, GeneratedImageLoading } from "@/app/components/generated-images/GeneratedImageSection";
import { galleryPage } from "@/lib/generated-images/schema";

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

export default async function ProjectDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ assetPage?: string | string[] }> }) {
  const { id } = await params;
  const page = galleryPage((await searchParams).assetPage);
  const project = await getOwnedProject(id);

  if (!project) notFound();

  return (
    <div>
      <Link className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-accent-cyan" href="/fashion-studio/projects"><span aria-hidden="true">←</span>Projects</Link>
      <PageHeader
        action={<Link className="inline-flex min-h-12 items-center justify-center rounded-control border border-border-strong bg-surface-highlight px-5 py-3 text-sm font-semibold text-text-primary transition hover:border-accent-cyan/40 hover:bg-surface-soft" href={`/fashion-studio/projects/${project.id}/edit`}>Edit project</Link>}
        description="Creative context and private generated images for this project."
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
      <section id="generated-images" className="mt-[var(--space-section)] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Generated images</h2>
          <Link className="inline-flex min-h-11 items-center rounded-control px-3 py-2 text-base font-semibold text-accent-cyan transition hover:bg-surface-highlight hover:underline hover:underline-offset-4" href={`/fashion-studio/image-generator?projectId=${project.id}`}>Open Image Generator for this project</Link>
        </div>
        <Card className="p-5 sm:p-7">
          <GeneratedImageUpload projectId={project.id} projectName={project.project_name} />
        </Card>
        <Suspense key={page} fallback={<GeneratedImageLoading />}>
          <GeneratedImageSection projectId={project.id} page={page} />
        </Suspense>
      </section>
    </div>
  );
}
