import Link from "next/link";

import { PromptPresetForm } from "@/app/components/prompt-presets/PromptPresetForm";
import { PageHeader } from "@/app/components/ui/PageHeader";

export default function NewPromptPresetPage() {
  return <div><Link className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-accent-cyan" href="/fashion-brain/presets"><span aria-hidden="true">←</span>Prompt Presets</Link><PageHeader description="Define a reusable prompt template for your creative workflow." eyebrow="Prompt Presets" title="Add prompt preset" /><PromptPresetForm mode="create" /></div>;
}
