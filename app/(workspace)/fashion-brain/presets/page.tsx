import Link from "next/link";

import { AppIcon } from "@/app/components/ui/AppIcon";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { Input } from "@/app/components/ui/Input";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { getOwnedPromptPresets } from "@/lib/prompt-presets/data";
import {
  getPromptPresetStatusLabel,
  type PromptPresetStatus,
} from "@/lib/prompt-presets/schema";

type StatusFilter = "all" | "active" | "archived";
const statusVariants: Record<PromptPresetStatus, "success" | "neutral"> = { active: "success", archived: "neutral" };

function readValue(value: string | string[] | undefined) { return typeof value === "string" ? value : ""; }
function readStatus(value: string | string[] | undefined): StatusFilter { return value === "all" || value === "active" || value === "archived" ? value : "all"; }
function formatUpdatedAt(value: string) { return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value)); }
function excerpt(prompt: string) { return prompt.replace(/\s+/g, " ").trim().slice(0, 180); }

export default async function PromptPresetsPage({ searchParams }: { searchParams: Promise<{ q?: string | string[]; status?: string | string[] }> }) {
  const params = await searchParams;
  const search = readValue(params.q).trim().slice(0, 100);
  const status = readStatus(params.status);
  const presets = await getOwnedPromptPresets({ search, status });
  const hasFilters = Boolean(search) || status !== "all";

  return <div><Link className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-accent-cyan" href="/fashion-brain"><span aria-hidden="true">←</span>Fashion Brain</Link><PageHeader action={<Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-violet px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110" href="/fashion-brain/presets/new">Add preset <span aria-hidden="true">+</span></Link>} description="Store reusable prompt templates for consistent creative workflows." eyebrow="Fashion Brain" title="Prompt Presets" />
    <Card className="mt-[var(--space-section)] p-4 sm:p-5"><form action="/fashion-brain/presets" className="grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_auto]" method="get"><div><label className="sr-only" htmlFor="preset-search">Search prompt presets</label><Input defaultValue={search} id="preset-search" name="q" placeholder="Search title, category, or prompt" type="search" /></div><div><label className="sr-only" htmlFor="preset-status">Filter by status</label><select className="min-h-12 w-full appearance-none rounded-control border border-border-soft bg-app/70 py-3 pr-12 pl-4 text-sm text-text-primary shadow-inner shadow-black/10 transition hover:border-border-strong focus:border-accent-cyan/60 focus:ring-2 focus:ring-accent-cyan/15" defaultValue={status} id="preset-status" name="status"><option value="all">All statuses</option><option value="active">Active</option><option value="archived">Archived</option></select></div><Button type="submit">Apply filters</Button></form>{hasFilters ? <div className="mt-3 flex justify-end"><Link className="text-sm font-medium text-text-secondary transition hover:text-accent-cyan" href="/fashion-brain/presets">Clear filters</Link></div> : null}</Card>
    <section aria-label="Prompt presets" className="mt-6">{presets.length === 0 ? <Card><EmptyState action={<Link className="inline-flex min-h-10 items-center justify-center rounded-control border border-border-strong bg-surface-highlight px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-accent-cyan/40 hover:bg-surface-soft" href={hasFilters ? "/fashion-brain/presets" : "/fashion-brain/presets/new"}>{hasFilters ? "Clear filters" : "Create first preset"}</Link>} description={hasFilters ? "No owned prompt presets match the current search and status filter." : "Save reusable prompt templates to make your creative workflow more consistent."} icon={<AppIcon className="size-5" name="brain" />} title={hasFilters ? "No matching prompt presets" : "Your Prompt Presets Library is empty"} /></Card> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{presets.map((preset) => <Card interactive key={preset.id}><Link className="group flex min-h-56 flex-col p-5 sm:p-6" href={`/fashion-brain/presets/${preset.id}`}><div className="flex items-start justify-between gap-4"><span className="grid size-11 place-items-center rounded-card border border-accent-violet/15 bg-gradient-to-br from-accent-violet/10 to-accent-cyan/10 text-accent-violet"><AppIcon className="size-5" name="brain" /></span><Badge variant={statusVariants[preset.status]}>{getPromptPresetStatusLabel(preset.status)}</Badge></div><div className="mt-5"><h2 className="break-words text-lg font-semibold tracking-tight text-text-primary">{preset.title}</h2><p className="mt-1.5 text-sm text-text-secondary">{preset.category}</p><p className="mt-2 line-clamp-3 text-sm leading-6 text-text-muted">{excerpt(preset.prompt)}</p></div><div className="mt-auto flex items-end justify-between gap-4 border-t border-border-soft pt-4"><div><p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-text-muted">Updated</p><p className="mt-1 text-sm text-text-secondary">{formatUpdatedAt(preset.updated_at)}</p></div><AppIcon className="size-4 text-text-muted transition group-hover:translate-x-0.5 group-hover:text-accent-cyan" name="arrow" /></div></Link></Card>)}</div>}</section></div>;
}
