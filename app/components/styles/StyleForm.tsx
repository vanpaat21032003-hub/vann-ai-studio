"use client";

import { useActionState } from "react";
import { createStyle, updateStyle } from "@/lib/styles/actions";
import type { StyleActionState, StyleEditableRecord } from "@/lib/styles/schema";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";

type Props = { mode: "create" | "edit"; style?: StyleEditableRecord };
const initialState: StyleActionState = { error: null };

export function StyleForm({ mode, style }: Props) {
  const action = mode === "create" ? createStyle : updateStyle.bind(null, style!.id!);
  const [state, formAction, pending] = useActionState(action, initialState);
  const fields = [
    ["lighting", "Lighting", "e.g. Soft natural window light"],
    ["camera", "Camera", "e.g. Editorial full-length framing"],
    ["background", "Background", "e.g. Warm neutral studio backdrop"],
    ["mood", "Mood", "e.g. Refined and modern"],
  ] as const;
  return <Card className="mt-[var(--space-section)]"><form action={formAction} className="space-y-6 p-5 sm:p-7">
    {state.error ? <p aria-live="polite" className="rounded-control border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200" role="alert">{state.error}</p> : null}
    <div><label className="mb-2 block text-sm font-medium text-text-primary" htmlFor="style-name">Style name <span aria-hidden="true" className="text-accent-cyan">*</span></label><Input defaultValue={style?.name ?? ""} error={Boolean(state.fieldErrors?.name)} id="style-name" maxLength={500} name="name" required /><p className="mt-2 text-xs text-text-muted">Give this reusable visual direction a clear name.</p>{state.fieldErrors?.name ? <p className="mt-2 text-sm text-red-200">{state.fieldErrors.name}</p> : null}</div>
    <div className="grid gap-5 sm:grid-cols-2">{fields.map(([name, label, placeholder]) => <div key={name}><label className="mb-2 block text-sm font-medium text-text-primary" htmlFor={`style-${name}`}>{label}</label><Input defaultValue={style?.[name] ?? ""} id={`style-${name}`} maxLength={500} name={name} placeholder={placeholder} /></div>)}</div>
    <div className="flex flex-col gap-3 border-t border-border-soft pt-6 sm:flex-row"><Button disabled={pending} type="submit">{pending ? "Saving…" : mode === "create" ? "Create style" : "Save changes"}</Button></div>
  </form></Card>;
}
