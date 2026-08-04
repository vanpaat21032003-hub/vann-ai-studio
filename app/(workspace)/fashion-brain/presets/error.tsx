"use client";

import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { EmptyState } from "@/app/components/ui/EmptyState";

export default function PromptPresetsError({ unstable_retry }: { unstable_retry: () => void }) {
  return <Card><EmptyState action={<Button onClick={() => unstable_retry()}>Try again</Button>} description="Prompt preset data could not be loaded safely. Your workspace and credentials remain private." title="Prompt Presets Library unavailable" /></Card>;
}
