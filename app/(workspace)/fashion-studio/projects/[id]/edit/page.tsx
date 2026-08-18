import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectForm } from "@/app/components/projects/ProjectForm";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { getOwnedProject, getProjectFormOptions } from "@/lib/projects/data";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getOwnedProject(id);

  if (!project) notFound();

  const options = await getProjectFormOptions();

  return (
    <div>
      <Link className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-accent-cyan" href={`/fashion-studio/projects/${project.id}`}><span aria-hidden="true">←</span>Project detail</Link>
      <PageHeader description="Update project context without changing its ownership or draft status." eyebrow="Projects" title="Edit project" />
      <ProjectForm mode="edit" options={options} project={project} />
    </div>
  );
}
