"use client";

import { useRef, useState } from "react";

import { PromptCopyButton } from "@/app/components/prompt-presets/PromptCopyButton";
import { Button } from "@/app/components/ui/Button";

type EnhancementState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; enhancedPrompt: string }
  | { status: "error" };

const SAFE_ERROR_MESSAGE =
  "Prompt enhancement is temporarily unavailable. Your original prompt is still available.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function PromptEnhancementPanel({ prompt }: { prompt: string }) {
  const [state, setState] = useState<EnhancementState>({ status: "idle" });
  const requestInFlight = useRef(false);

  async function enhancePrompt() {
    if (requestInFlight.current) return;

    requestInFlight.current = true;
    setState({ status: "loading" });

    try {
      const response = await fetch("/api/fashion-brain/enhance", {
        body: JSON.stringify({ prompt }),
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Prompt enhancement request failed.");
      }

      const body: unknown = await response.json();

      if (!isRecord(body) || typeof body.enhancedPrompt !== "string" || !body.enhancedPrompt.trim()) {
        throw new Error("Prompt enhancement response was invalid.");
      }

      setState({ enhancedPrompt: body.enhancedPrompt.trim(), status: "success" });
    } catch {
      setState({ status: "error" });
    } finally {
      requestInFlight.current = false;
    }
  }

  return (
    <section className="mt-6 border-t border-border-soft pt-6" aria-labelledby="prompt-enhancement-heading">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-violet">
            AI enhancement
          </p>
          <h3 className="mt-2 font-semibold tracking-tight text-text-primary" id="prompt-enhancement-heading">
            Refine this prompt with AI
          </h3>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Your deterministic final prompt remains unchanged and available.
          </p>
        </div>
        <Button disabled={state.status === "loading"} onClick={enhancePrompt} size="sm" type="button">
          {state.status === "loading" ? "Enhancing..." : "Enhance with AI"}
        </Button>
      </div>

      {state.status === "error" ? (
        <p aria-live="polite" className="mt-4 text-sm text-accent-danger" role="alert">
          {SAFE_ERROR_MESSAGE}
        </p>
      ) : null}

      {state.status === "success" ? (
        <div className="mt-6 rounded-control border border-accent-violet/30 bg-surface-soft p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-violet">
                AI enhanced
              </p>
              <h3 className="mt-2 font-semibold tracking-tight text-text-primary">Enhanced Prompt</h3>
            </div>
            <PromptCopyButton label="Copy Enhanced Prompt" prompt={state.enhancedPrompt} />
          </div>
          <pre className="mt-5 max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-control border border-border-soft bg-app/70 p-4 font-sans text-sm leading-6 text-text-primary">
            {state.enhancedPrompt}
          </pre>
        </div>
      ) : null}
    </section>
  );
}
