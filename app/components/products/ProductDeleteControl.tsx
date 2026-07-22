"use client";

import { useActionState } from "react";

import { deleteProduct } from "@/lib/products/actions";
import type { DeleteProductState } from "@/lib/products/schema";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";

type ProductDeleteControlProps = {
  productId: string;
  productTitle: string;
};

const initialState: DeleteProductState = { error: null };

export function ProductDeleteControl({
  productId,
  productTitle,
}: ProductDeleteControlProps) {
  const action = deleteProduct.bind(null, productId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <details className="group rounded-card border border-red-400/15 bg-red-400/[0.035] p-5 sm:p-6">
      <summary className="cursor-pointer list-none text-sm font-semibold text-accent-danger marker:hidden">
        <span className="inline-flex items-center gap-2">
          Permanently delete product
          <span
            aria-hidden="true"
            className="text-text-muted transition group-open:rotate-45"
          >
            +
          </span>
        </span>
      </summary>
      <div className="mt-4 border-t border-red-400/10 pt-4">
        <p className="text-sm leading-6 text-text-secondary">
          This cannot be undone. Type <strong className="text-text-primary">{productTitle}</strong>{" "}
          exactly to confirm.
        </p>
        <form action={formAction} className="mt-4 space-y-4">
          <div>
            <label
              className="sr-only"
              htmlFor={`confirmation-${productId}`}
            >
              Product title confirmation
            </label>
            <Input
              autoComplete="off"
              disabled={pending}
              error={Boolean(state.error)}
              id={`confirmation-${productId}`}
              name="confirmation"
              placeholder="Type the product title"
            />
          </div>
          <p
            aria-live="polite"
            className="min-h-5 text-sm text-accent-danger"
            role={state.error ? "alert" : undefined}
          >
            {state.error}
          </p>
          <Button
            className="border border-red-300/20 bg-red-400/10 text-red-100 shadow-none hover:bg-red-400/15"
            disabled={pending}
            size="sm"
            type="submit"
            variant="secondary"
          >
            {pending ? "Deleting…" : "Delete permanently"}
          </Button>
        </form>
      </div>
    </details>
  );
}
