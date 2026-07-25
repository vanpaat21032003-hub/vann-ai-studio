"use client";

import { useActionState, useState } from "react";

import { Button } from "@/app/components/ui/Button";
import {
  archivePromptPreset,
  restorePromptPreset,
} from "@/lib/prompt-presets/actions";
import type {
  PromptPresetArchiveState,
  PromptPresetStatus,
} from "@/lib/prompt-presets/schema";

type Props = { presetId: string; status: PromptPresetStatus };
const initialState: PromptPresetArchiveState = { error: null };

export function PromptPresetArchiveControl({ presetId, status }: Props) {
  const [isConfirming, setIsConfirming] = useState(false);
  const action = (status === "active" ? archivePromptPreset : restorePromptPreset).bind(null, presetId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const isArchived = status === "archived";

  if (isArchived) {
    return <div><p className="text-sm leading-6 text-text-secondary">This preset is archived and remains available to review or edit. Restore it to return it to active use.</p><form action={formAction} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"><Button disabled={pending} size="sm" type="submit" variant="secondary">{pending ? "Restoring…" : "Restore preset"}</Button>{state.error ? <p aria-live="polite" className="text-sm text-accent-danger" role="alert">{state.error}</p> : null}</form></div>;
  }

  if (!isConfirming) {
    return <div><p className="text-sm leading-6 text-text-secondary">Archive this preset to remove it from active use without deleting it. You can restore it later.</p><div className="mt-4"><Button onClick={() => setIsConfirming(true)} size="sm" type="button" variant="secondary">Archive preset</Button></div></div>;
  }

  return <div><p className="text-sm font-medium leading-6 text-amber-400">Are you sure you want to archive this preset?</p><form action={formAction} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"><Button disabled={pending} size="sm" type="submit" variant="secondary">{pending ? "Archiving…" : "Confirm archive"}</Button><Button disabled={pending} onClick={() => setIsConfirming(false)} size="sm" type="button" variant="ghost">Cancel</Button>{state.error ? <p aria-live="polite" className="text-sm text-accent-danger" role="alert">{state.error}</p> : null}</form></div>;
}
