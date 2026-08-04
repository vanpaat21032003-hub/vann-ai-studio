"use client";

import { useState } from "react";

import { Button } from "@/app/components/ui/Button";

export function PromptCopyButton({ prompt }: { prompt: string }) {
  const [message, setMessage] = useState<string | null>(null);

  async function copyPrompt() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(prompt);
      setMessage("Prompt copied.");
    } catch {
      setMessage("Unable to copy the prompt. Please copy it manually.");
    }
  }

  return <div className="flex flex-wrap items-center gap-3"><Button onClick={copyPrompt} size="sm" type="button" variant="secondary">Copy prompt</Button><p aria-live="polite" className={message === "Prompt copied." ? "text-sm text-accent-success" : "text-sm text-accent-danger"} role={message ? "status" : undefined}>{message}</p></div>;
}
