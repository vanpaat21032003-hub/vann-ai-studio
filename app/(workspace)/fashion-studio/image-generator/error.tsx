"use client";

import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { EmptyState } from "@/app/components/ui/EmptyState";

export default function ImageGeneratorError({ unstable_retry }: { unstable_retry: () => void }) {
  return <Card><EmptyState title="Image generator unavailable" description="The project or creative context could not be loaded safely." action={<Button onClick={unstable_retry}>Try again</Button>} /></Card>;
}
