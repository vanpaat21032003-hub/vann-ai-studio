"use client";

import { useActionState } from "react";

import { Button } from "@/app/components/ui/Button";
import { deleteProductImage } from "@/lib/products/image-actions";
import type { ProductImageDeleteState } from "@/lib/products/image-constants";

type ProductImageDeleteControlProps = {
  imageId: string;
  productId: string;
};

const initialState: ProductImageDeleteState = {
  deleted: false,
  error: null,
};

export function ProductImageDeleteControl({
  imageId,
  productId,
}: ProductImageDeleteControlProps) {
  const action = deleteProductImage.bind(null, productId, imageId);
  const [state, formAction, pending] = useActionState(action, initialState);

  if (state.deleted) {
    return (
      <p className="text-sm text-text-secondary" role="status">
        Image deleted.
      </p>
    );
  }

  return (
    <details className="group">
      <summary className="cursor-pointer list-none text-sm font-semibold text-accent-danger marker:hidden">
        <span className="inline-flex items-center gap-2">
          Delete image
          <span
            aria-hidden="true"
            className="text-text-muted transition group-open:rotate-45"
          >
            +
          </span>
        </span>
      </summary>
      <form
        action={formAction}
        className="mt-3 border-t border-red-400/10 pt-3"
      >
        <p className="text-xs leading-5 text-text-secondary">
          Permanently remove this private image and its metadata? This cannot be
          undone.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            className="border border-red-300/20 bg-red-400/10 text-red-100 shadow-none hover:bg-red-400/15"
            disabled={pending}
            size="sm"
            type="submit"
            variant="secondary"
          >
            {pending ? "Deleting…" : "Confirm deletion"}
          </Button>
          <p
            aria-live="polite"
            className="min-h-5 text-xs text-accent-danger"
            role={state.error ? "alert" : undefined}
          >
            {state.error}
          </p>
        </div>
      </form>
    </details>
  );
}
