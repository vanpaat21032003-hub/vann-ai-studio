"use client";

import { useActionState, useState } from "react";
import { archiveStyle, restoreStyle } from "@/lib/styles/actions";
import type { StyleArchiveState, StyleStatus } from "@/lib/styles/schema";
import { Button } from "@/app/components/ui/Button";

const initialState: StyleArchiveState = { archived: false, restored: false, error: null };
export function StyleArchiveControl({ styleId, status }: { styleId: string; status: StyleStatus }) {
  const [confirming, setConfirming] = useState(false);
  const [archiveState, archiveAction, archivePending] = useActionState(archiveStyle.bind(null, styleId), initialState);
  const [restoreState, restoreAction, restorePending] = useActionState(restoreStyle.bind(null, styleId), initialState);
  const isArchived = status === "archived" || archiveState.archived;
  const pending = archivePending || restorePending;
  const error = archiveState.error || restoreState.error;
  if (isArchived && !restoreState.restored) return <div><p className="text-sm leading-6 text-text-secondary">This style is archived and will not appear in active selectors. You can restore it to make it available again.</p><div className="mt-4 flex gap-3"><form action={restoreAction}><Button disabled={pending} size="sm" type="submit" variant="secondary">{restorePending ? "Restoring…" : "Restore style"}</Button></form>{error ? <p aria-live="polite" className="text-sm text-accent-danger" role="alert">{error}</p> : null}</div></div>;
  if (!confirming) return <div>{restoreState.restored ? <p className="mb-3 text-sm text-accent-success" role="status">Style restored to active.</p> : null}<p className="text-sm leading-6 text-text-secondary">Archive this style to remove it from active selectors without deleting its metadata. You can restore it later.</p><Button className="mt-4" onClick={() => setConfirming(true)} size="sm" type="button" variant="secondary">Archive style</Button></div>;
  return <div><p className="text-sm font-medium leading-6 text-amber-400">Are you sure you want to archive this style? It will be hidden from active style selectors.</p><form action={archiveAction} className="mt-4 flex gap-3"><Button disabled={pending} size="sm" type="submit" variant="secondary">{archivePending ? "Archiving…" : "Confirm archive"}</Button><Button disabled={pending} onClick={() => setConfirming(false)} size="sm" type="button" variant="ghost">Cancel</Button>{error ? <p aria-live="polite" className="text-sm text-accent-danger" role="alert">{error}</p> : null}</form></div>;
}
