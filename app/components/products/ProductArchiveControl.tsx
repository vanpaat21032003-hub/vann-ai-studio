"use client";

import { useActionState } from "react";

import { Button } from "@/app/components/ui/Button";
import { archiveProduct, restoreProduct } from "@/lib/products/actions";
import type { ArchiveProductState, ProductStatus } from "@/lib/products/schema";

type ProductArchiveControlProps = {
  productId: string;
  status: ProductStatus;
};

const initialState: ArchiveProductState = {
  archived: false,
  restored: false,
  error: null,
};

export function ProductArchiveControl({
  productId,
  status,
}: ProductArchiveControlProps) {
  const archiveAction = archiveProduct.bind(null, productId);
  const restoreAction = restoreProduct.bind(null, productId);
  const [archiveState, formArchiveAction, archivePending] = useActionState(
    archiveAction,
    initialState,
  );
  const [restoreState, formRestoreAction, restorePending] = useActionState(
    restoreAction,
    initialState,
  );
  const isArchived = status === "archived" || archiveState.archived;
  const pending = archivePending || restorePending;
  const error = archiveState.error || restoreState.error;

  if (isArchived && !restoreState.restored) {
    return (
      <div>
        <p className="text-sm leading-6 text-text-secondary">
          This product is archived. Its metadata remains available for reference.
          You can restore it to draft when you are ready to work on it again.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <form action={formRestoreAction}>
            <Button
              disabled={pending}
              size="sm"
              type="submit"
              variant="secondary"
            >
              {restorePending ? "Restoring…" : "Restore product"}
            </Button>
          </form>
          {error ? (
            <p
              aria-live="polite"
              className="text-sm text-accent-danger"
              role="alert"
            >
              {error}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <form action={formArchiveAction}>
      {restoreState.restored ? (
        <p className="mb-3 text-sm leading-6 text-accent-success" role="status">
          Product restored to draft.
        </p>
      ) : null}
      <p className="text-sm leading-6 text-text-secondary">
        Archive this product to remove it from active work without deleting its
        metadata.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button disabled={pending} size="sm" type="submit" variant="secondary">
          {archivePending ? "Archiving…" : "Archive product"}
        </Button>
        {error ? (
          <p aria-live="polite" className="text-sm text-accent-danger" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
