import Link from "next/link";

import { ProductForm } from "@/app/components/products/ProductForm";
import { PageHeader } from "@/app/components/ui/PageHeader";

export default function NewProductPage() {
  return (
    <div>
      <Link
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-accent-cyan"
        href="/fashion-studio/products"
      >
        <span aria-hidden="true">←</span>
        Product Library
      </Link>
      <PageHeader
        description="Capture the essential metadata for a private product record."
        eyebrow="Product Library"
        title="Add product"
      />
      <ProductForm mode="create" />
    </div>
  );
}
