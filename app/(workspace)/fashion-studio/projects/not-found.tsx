import Link from "next/link";

import { Card } from "@/app/components/ui/Card";
import { EmptyState } from "@/app/components/ui/EmptyState";

export default function ProjectNotFound() {
  return <Card><EmptyState action={<Link className="inline-flex min-h-10 items-center justify-center rounded-control border border-border-strong bg-surface-highlight px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-accent-cyan/40 hover:bg-surface-soft" href="/fashion-studio/projects">Return to Projects</Link>} description="This project does not exist or is not available to the current owner session." title="Project not found" /></Card>;
}
