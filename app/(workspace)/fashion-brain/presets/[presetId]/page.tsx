import Link from "next/link";
import { notFound } from "next/navigation";

import { PromptPresetArchiveControl } from "@/app/components/prompt-presets/PromptPresetArchiveControl";
import { PromptCopyButton } from "@/app/components/prompt-presets/PromptCopyButton";
import { Badge } from "@/app/components/ui/Badge";
import { Card } from "@/app/components/ui/Card";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { getOwnedPromptPreset } from "@/lib/prompt-presets/data";
import { getPromptPresetStatusLabel, type PromptPresetStatus } from "@/lib/prompt-presets/schema";

const statusVariants: Record<PromptPresetStatus, "success" | "neutral"> = { active: "success", archived: "neutral" };
function formatDate(value: string) { return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }

export default async function PromptPresetDetailPage({ params }: { params: Promise<{ presetId: string }> }) {
  const { presetId } = await params;
  const preset = await getOwnedPromptPreset(presetId);
  if (!preset) notFound();

  return <div><Link className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-accent-cyan" href="/fashion-brain/presets"><span aria-hidden="true">←</span>Prompt Presets</Link><PageHeader action={<Link className="inline-flex min-h-12 items-center justify-center rounded-control border border-border-strong bg-surface-highlight px-5 py-3 text-sm font-semibold text-text-primary transition hover:border-accent-cyan/40 hover:bg-surface-soft" href={`/fashion-brain/presets/${preset.id}/edit`}>Edit preset</Link>} description="Review and reuse this prompt template in your creative workflow." eyebrow="Prompt preset detail" title={preset.title} />
    <div className="mt-6"><Badge variant={statusVariants[preset.status]}>{getPromptPresetStatusLabel(preset.status)}</Badge></div>
    <Card className="mt-[var(--space-section)] p-5 sm:p-7"><dl className="grid gap-4 sm:grid-cols-2"><div className="min-w-0 rounded-control border border-border-soft bg-surface-soft p-4"><dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-text-muted">Category</dt><dd className="mt-2 break-words text-sm leading-6 text-text-primary">{preset.category}</dd></div><div className="min-w-0 rounded-control border border-border-soft bg-surface-soft p-4"><dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-text-muted">Created</dt><dd className="mt-2 text-sm leading-6 text-text-primary">{formatDate(preset.created_at)}</dd></div><div className="min-w-0 rounded-control border border-border-soft bg-surface-soft p-4 sm:col-span-2"><dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-text-muted">Updated</dt><dd className="mt-2 text-sm leading-6 text-text-primary">{formatDate(preset.updated_at)}</dd></div></dl><div className="mt-6"><div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-base font-semibold text-text-primary">Prompt</h2><PromptCopyButton prompt={preset.prompt} /></div><pre className="mt-4 max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-control border border-border-soft bg-app/70 p-4 font-sans text-sm leading-6 text-text-primary">{preset.prompt}</pre></div></Card>
    <section aria-label="Archive or restore prompt preset" className="mt-8 rounded-card border border-border-soft bg-surface-elevated p-5 shadow-card sm:p-6"><h2 className="text-base font-semibold text-text-primary">{preset.status === "archived" ? "Restore prompt preset" : "Archive prompt preset"}</h2><div className="mt-3"><PromptPresetArchiveControl presetId={preset.id} status={preset.status} /></div></section></div>;
}
