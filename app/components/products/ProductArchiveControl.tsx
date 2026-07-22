"use client";

import { useActionState } from "react";

import { Button } from "@/app/components/ui/Button";
import { archiveProduct } from "@/lib/products/actions";
import type { ArchiveProductState, ProductStatus } from "@/lib/products/schema";

type ProductArchiveControlProps = {
  productId: string;
  status: ProductStatus;
};

const initialState: ArchiveProductState = {
  archived: false,
  error: null,
};

export function ProductArchiveControl({
  productId,
  status,
}: ProductArchiveControlProps) {
  const action = archiveProduct.bind(null, productId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const isArchived = status === "archived" || state.archived;

  if (isArchived) {
    return (
      <p className="text-sm leading-6 text-text-secondary" role="status">
        This product is archived. Its metadata remains available for reference.
      </p>
    );
  }

  return (
    <form action={formAction}>
      <p className="text-sm leading-6 text-text-secondary">
        Archive this product to remove it from active work without deleting its
        metadata.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button disabled={pending} size="sm" type="submit" variant="secondary">
          {pending ? "Archiving…" : "Archive product"}
        </Button>
        <p
          aria-live="polite"
          className="text-sm text-accent-danger"
          role={state.error ? "alert" : undefined}
        >
          {state.error}
        </p>
      </div>
    </form>
  );
}
