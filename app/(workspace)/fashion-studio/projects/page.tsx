import Link from "next/link";

import { AppIcon } from "@/app/components/ui/AppIcon";
import { Badge } from "@/app/components/ui/Badge";
import { Card } from "@/app/components/ui/Card";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { getOwnedProjects } from "@/lib/projects/data";
import { getProjectStatusLabel } from "@/lib/projects/schema";

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export default async function ProjectsPage() {
  const projects = await getOwnedProjects();

  return (
    <div>
      <Link className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-accent-cyan" href="/fashion-studio">
        <span aria-hidden="true">←</span>Fashion Studio
      </Link>
      <PageHeader
        action={<Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-violet px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110" href="/fashion-studio/projects/new">New project <span aria-hidden="true" className="text-base leading-none">+</span></Link>}
        description="Keep product context and optional creative direction together for future image work."
        eyebrow="Fashion Studio"
        title="Projects"
      />
      <section aria-label="Projects" className="mt-[var(--space-section)]">
        {projects.length === 0 ? (
          <Card>
            <EmptyState
              action={<Link className="inline-flex min-h-10 items-center justify-center rounded-control border border-border-strong bg-surface-highlight px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-accent-cyan/40 hover:bg-surface-soft" href="/fashion-studio/projects/new">Create first project</Link>}
              description="Start a draft from an owned product, then optionally add a model and visual style."
              icon={<AppIcon className="size-5" name="folder" />}
              title="Your Projects are empty"
            />
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <Card interactive key={project.id}>
                <Link className="group flex min-h-64 flex-col p-5 sm:p-6" href={`/fashion-studio/projects/${project.id}`}>
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-card border border-accent-cyan/15 bg-gradient-to-br from-accent-cyan/10 to-accent-violet/10 text-accent-cyan"><AppIcon className="size-5" name="folder" /></span>
                    <Badge variant="cyan">{getProjectStatusLabel(project.status)}</Badge>
                  </div>
                  <div className="mt-6">
                    <h2 className="break-words text-lg font-semibold tracking-tight text-text-primary">{project.project_name}</h2>
                    <p className="mt-2 text-sm text-text-secondary">{project.product.name}</p>
                    <p className="mt-2 text-sm text-text-muted">{[project.model?.name, project.style?.name].filter(Boolean).join(" · ") || "Model and style not selected"}</p>
                  </div>
                  <div className="mt-auto flex items-end justify-between gap-4 border-t border-border-soft pt-5">
                    <div><p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-text-muted">Updated</p><p className="mt-1 text-sm text-text-secondary">{formatUpdatedAt(project.updated_at)}</p></div>
                    <AppIcon className="size-4 text-text-muted transition group-hover:translate-x-0.5 group-hover:text-accent-cyan" name="arrow" />
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
