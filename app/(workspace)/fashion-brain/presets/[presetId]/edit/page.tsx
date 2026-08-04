import Link from "next/link";
import { notFound } from "next/navigation";

import { PromptPresetForm } from "@/app/components/prompt-presets/PromptPresetForm";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { getOwnedPromptPreset } from "@/lib/prompt-presets/data";

export default async function EditPromptPresetPage({ params }: { params: Promise<{ presetId: string }> }) {
  const { presetId } = await params;
  const preset = await getOwnedPromptPreset(presetId);
  if (!preset) notFound();

  return <div><Link className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-accent-cyan" href={`/fashion-brain/presets/${preset.id}`}><span aria-hidden="true">←</span>Prompt preset detail</Link><PageHeader description="Update the reusable title, category, and prompt template." eyebrow="Prompt Presets" title="Edit prompt preset" /><PromptPresetForm mode="edit" preset={{ id: preset.id, title: preset.title, category: preset.category, prompt: preset.prompt }} /></div>;
}
