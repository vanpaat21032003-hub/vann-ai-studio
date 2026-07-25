"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import {
  createPromptPreset,
  updatePromptPreset,
} from "@/lib/prompt-presets/actions";
import type {
  PromptPresetActionState,
  PromptPresetEditableRecord,
} from "@/lib/prompt-presets/schema";

type PromptPresetFormProps = {
  mode: "create" | "edit";
  preset?: PromptPresetEditableRecord;
};

const initialState: PromptPresetActionState = { error: null };

export function PromptPresetForm({ mode, preset }: PromptPresetFormProps) {
  const action =
    mode === "create"
      ? createPromptPreset
      : updatePromptPreset.bind(null, preset!.id!);
  const [state, formAction, pending] = useActionState(action, initialState);
  const cancelHref = preset
    ? `/fashion-brain/presets/${preset.id}`
    : "/fashion-brain/presets";

  return (
    <Card className="mt-[var(--space-section)]">
      <form action={formAction} className="space-y-6 p-5 sm:p-7">
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary" htmlFor="preset-title">
            Title <span aria-hidden="true" className="text-accent-cyan">*</span>
          </label>
          <Input
            aria-describedby={state.fieldErrors?.title ? "preset-title-error" : undefined}
            autoFocus
            defaultValue={preset?.title ?? ""}
            disabled={pending}
            error={Boolean(state.fieldErrors?.title)}
            id="preset-title"
            name="title"
            placeholder="e.g. Editorial product scene"
            required
          />
          {state.fieldErrors?.title ? <p className="mt-2 text-sm text-accent-danger" id="preset-title-error">{state.fieldErrors.title}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary" htmlFor="preset-category">
            Category <span aria-hidden="true" className="text-accent-cyan">*</span>
          </label>
          <Input
            aria-describedby={state.fieldErrors?.category ? "preset-category-error" : undefined}
            defaultValue={preset?.category ?? ""}
            disabled={pending}
            error={Boolean(state.fieldErrors?.category)}
            id="preset-category"
            name="category"
            placeholder="e.g. Product photography"
            required
          />
          {state.fieldErrors?.category ? <p className="mt-2 text-sm text-accent-danger" id="preset-category-error">{state.fieldErrors.category}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary" htmlFor="preset-prompt">
            Prompt <span aria-hidden="true" className="text-accent-cyan">*</span>
          </label>
          <Textarea
            aria-describedby={state.fieldErrors?.prompt ? "preset-prompt-error" : "preset-prompt-hint"}
            defaultValue={preset?.prompt ?? ""}
            disabled={pending}
            error={Boolean(state.fieldErrors?.prompt)}
            id="preset-prompt"
            name="prompt"
            placeholder="Write the reusable prompt template…"
            required
            rows={10}
          />
          {state.fieldErrors?.prompt ? <p className="mt-2 text-sm text-accent-danger" id="preset-prompt-error">{state.fieldErrors.prompt}</p> : <p className="mt-2 text-xs text-text-muted" id="preset-prompt-hint">Use a detailed reusable template for your creative workflow.</p>}
        </div>

        <p aria-live="polite" className="min-h-5 text-sm text-accent-danger" role={state.error ? "alert" : undefined}>{state.error}</p>
        <div className="flex flex-col-reverse gap-3 border-t border-border-soft pt-5 sm:flex-row sm:justify-end">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-control border border-border-strong bg-surface-highlight px-5 py-3 text-sm font-semibold text-text-primary transition hover:border-accent-cyan/40 hover:bg-surface-soft" href={cancelHref}>Cancel</Link>
          <Button disabled={pending} type="submit">{pending ? "Saving…" : mode === "create" ? "Create preset" : "Save changes"}</Button>
        </div>
      </form>
    </Card>
  );
}
