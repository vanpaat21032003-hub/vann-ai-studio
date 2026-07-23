"use client";

import { useActionState, useState } from "react";

import { archiveModel, restoreModel } from "@/lib/models/actions";
import type { ModelArchiveState, ModelStatus } from "@/lib/models/schema";
import { Button } from "@/app/components/ui/Button";

type ModelArchiveControlProps = {
  modelId: string;
  status: ModelStatus;
};

const initialState: ModelArchiveState = {
  archived: false,
  restored: false,
  error: null,
};

export function ModelArchiveControl({
  modelId,
  status,
}: ModelArchiveControlProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const archiveAction = archiveModel.bind(null, modelId);
  const restoreAction = restoreModel.bind(null, modelId);

  const [archiveState, formArchiveAction, archivePending] = useActionState(
    archiveAction,
    initialState,
  );
  const [restoreState, formRestoreAction, restorePending] = useActionState(
    restoreAction,
    initialState,
  );

  const isArchived =
    status === "archived" || archiveState.archived;

  const pending = archivePending || restorePending;
  const error = archiveState.error || restoreState.error;

  if (isArchived && !restoreState.restored) {
    // Archived — show one-step restore option
    return (
      <div>
        <p className="text-sm leading-6 text-text-secondary">
          This model is archived and will not appear in active selectors. You
          can restore it to make it available again.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <form action={formRestoreAction}>
            <Button
              disabled={pending}
              size="sm"
              type="submit"
              variant="secondary"
            >
              {restorePending ? "Restoring…" : "Restore model"}
            </Button>
          </form>
          {error ? (
            <p aria-live="polite" className="text-sm text-accent-danger" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  // Active — show archive option with confirmation step
  if (!isConfirming) {
    return (
      <div>
        {restoreState.restored ? (
          <p
            className="mb-3 text-sm leading-6 text-accent-success"
            role="status"
          >
            Model restored to active.
          </p>
        ) : null}
        <p className="text-sm leading-6 text-text-secondary">
          Archive this model to remove it from active selectors without deleting
          its metadata. You can restore it later.
        </p>
        <div className="mt-4">
          <Button
            size="sm"
            type="button"
            variant="secondary"
            onClick={() => setIsConfirming(true)}
          >
            Archive model
          </Button>
        </div>
      </div>
    );
  }

  // Confirmation state
  return (
    <div>
      <p className="text-sm font-medium leading-6 text-amber-400">
        Are you sure you want to archive this model? It will be hidden from active model selectors.
      </p>
      <form action={formArchiveAction} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          disabled={pending}
          size="sm"
          type="submit"
          variant="secondary"
        >
          {archivePending ? "Archiving…" : "Confirm archive"}
        </Button>
        <Button
          disabled={pending}
          size="sm"
          type="button"
          variant="ghost"
          onClick={() => setIsConfirming(false)}
        >
          Cancel
        </Button>
        {error ? (
          <p aria-live="polite" className="text-sm text-accent-danger" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  );
}
