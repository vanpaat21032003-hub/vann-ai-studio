"use client";

import Link from "next/link";
import { useActionState } from "react";

import { createProduct, updateProduct } from "@/lib/products/actions";
import type {
  ProductActionState,
  ProductFormValues,
  ProductRecord,
} from "@/lib/products/schema";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";

type ProductFormProps = {
  mode: "create" | "edit";
  product?: ProductRecord;
};

type ProductFormAction = (
  state: ProductActionState,
  formData: FormData,
) => Promise<ProductActionState>;

const initialState: ProductActionState = { error: null };

const optionalFields: Array<{
  key: Exclude<keyof ProductFormValues, "title" | "notes">;
  label: string;
  placeholder: string;
}> = [
  { key: "category", label: "Category", placeholder: "e.g. Outerwear" },
  { key: "gender", label: "Gender", placeholder: "e.g. Women" },
  { key: "brand", label: "Brand", placeholder: "e.g. Independent label" },
  { key: "color", label: "Color", placeholder: "e.g. Midnight navy" },
  { key: "material", label: "Material", placeholder: "e.g. Cotton blend" },
];

export function ProductForm({ mode, product }: ProductFormProps) {
  const boundUpdate = product
    ? updateProduct.bind(null, product.id)
    : undefined;
  const action: ProductFormAction =
    mode === "create" ? createProduct : boundUpdate!;
  const [state, formAction, pending] = useActionState(action, initialState);
  const titleError = state.fieldErrors?.title;
  const cancelHref = product
    ? `/fashion-studio/products/${product.id}`
    : "/fashion-studio/products";

  return (
    <Card className="mt-[var(--space-section)]">
      <form action={formAction} className="space-y-6 p-5 sm:p-7">
        <div>
          <label
            className="mb-2 block text-sm font-medium text-text-primary"
            htmlFor="title"
          >
            Product title
          </label>
          <Input
            aria-describedby={titleError ? "title-error" : undefined}
            autoFocus
            defaultValue={product?.title ?? ""}
            disabled={pending}
            error={Boolean(titleError)}
            id="title"
            name="title"
            placeholder="Name this product"
            required
          />
          {titleError ? (
            <p className="mt-2 text-sm text-accent-danger" id="title-error">
              {titleError}
            </p>
          ) : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {optionalFields.map((field) => (
            <div key={field.key}>
              <label
                className="mb-2 block text-sm font-medium text-text-primary"
                htmlFor={field.key}
              >
                {field.label}
              </label>
              <Input
                defaultValue={product?.[field.key] ?? ""}
                disabled={pending}
                id={field.key}
                name={field.key}
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-medium text-text-primary"
            htmlFor="notes"
          >
            Notes
          </label>
          <textarea
            className="min-h-36 w-full resize-y rounded-control border border-border-soft bg-app/70 px-4 py-3 text-sm leading-6 text-text-primary shadow-inner shadow-black/10 transition duration-[var(--transition-fast)] placeholder:text-text-muted hover:border-border-strong focus:border-accent-cyan/60 focus:ring-2 focus:ring-accent-cyan/15 disabled:cursor-not-allowed disabled:opacity-60"
            defaultValue={product?.notes ?? ""}
            disabled={pending}
            id="notes"
            name="notes"
            placeholder="Add product details that will help future creative work."
          />
        </div>

        <p
          aria-live="polite"
          className="min-h-5 text-sm text-accent-danger"
          role={state.error ? "alert" : undefined}
        >
          {state.error}
        </p>

        <div className="flex flex-col-reverse gap-3 border-t border-border-soft pt-5 sm:flex-row sm:justify-end">
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-control border border-border-strong bg-surface-highlight px-5 py-3 text-sm font-semibold text-text-primary transition duration-[var(--transition-fast)] hover:border-accent-cyan/40 hover:bg-surface-soft"
            href={cancelHref}
          >
            Cancel
          </Link>
          <Button disabled={pending} type="submit">
            {pending
              ? "Saving…"
              : mode === "create"
                ? "Create product"
                : "Save changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
