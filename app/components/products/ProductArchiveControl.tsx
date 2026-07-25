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
  const pending = archivePending || restorePending;

  if (status === "archived") {
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
          {restoreState.error ? (
            <p
              aria-live="polite"
              className="text-sm text-accent-danger"
              role="alert"
            >
              {restoreState.error}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <form action={formArchiveAction}>
      <p className="text-sm leading-6 text-text-secondary">
        Archive this product to remove it from active work without deleting its
        metadata.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button disabled={pending} size="sm" type="submit" variant="secondary">
          {archivePending ? "Archiving…" : "Archive product"}
        </Button>
        {archiveState.error ? (
          <p aria-live="polite" className="text-sm text-accent-danger" role="alert">
            {archiveState.error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
