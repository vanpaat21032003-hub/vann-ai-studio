import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductArchiveControl } from "@/app/components/products/ProductArchiveControl";
import { ProductDeleteControl } from "@/app/components/products/ProductDeleteControl";
import { Badge } from "@/app/components/ui/Badge";
import { Card } from "@/app/components/ui/Card";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { getOwnedProduct } from "@/lib/products/data";
import { getProductStatusLabel, type ProductStatus } from "@/lib/products/schema";

const statusVariants: Record<
  ProductStatus,
  "neutral" | "cyan" | "violet"
> = {
  draft: "cyan",
  analyzed: "violet",
  archived: "neutral",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function MetadataItem({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="min-w-0 rounded-control border border-border-soft bg-surface-soft p-4">
      <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-text-muted">
        {label}
      </dt>
      <dd className="mt-2 break-words text-sm leading-6 text-text-primary">
        {value || "Not added"}
      </dd>
    </div>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await getOwnedProduct(productId);

  if (!product) {
    notFound();
  }

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
        action={
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-control border border-border-strong bg-surface-highlight px-5 py-3 text-sm font-semibold text-text-primary transition hover:border-accent-cyan/40 hover:bg-surface-soft"
            href={`/fashion-studio/products/${product.id}/edit`}
          >
            Edit product
          </Link>
        }
        description="Review the canonical metadata for this product."
        eyebrow="Product detail"
        title={product.title}
      />

      <div className="mt-6">
        <Badge variant={statusVariants[product.status]}>
          {getProductStatusLabel(product.status)}
        </Badge>
      </div>

      <Card className="mt-[var(--space-section)] p-5 sm:p-7">
        <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetadataItem label="Category" value={product.category} />
          <MetadataItem label="Gender" value={product.gender} />
          <MetadataItem label="Brand" value={product.brand} />
          <MetadataItem label="Color" value={product.color} />
          <MetadataItem label="Material" value={product.material} />
          <MetadataItem label="Created" value={formatDate(product.created_at)} />
        </dl>

        <div className="mt-4 rounded-control border border-border-soft bg-surface-soft p-4">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-text-muted">
            Notes
          </p>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-text-primary">
            {product.notes || "No notes added."}
          </p>
        </div>

        <p className="mt-5 text-xs text-text-muted">
          Last updated {formatDate(product.updated_at)}
        </p>
      </Card>

      <section
        className="mt-8 rounded-card border border-border-soft bg-surface-elevated p-5 shadow-card sm:p-6"
        aria-label="Archive product"
      >
        <h2 className="text-base font-semibold text-text-primary">
          Archive product
        </h2>
        <div className="mt-3">
          <ProductArchiveControl
            productId={product.id}
            status={product.status}
          />
        </div>
      </section>

      <section className="mt-8" aria-label="Delete product">
        <ProductDeleteControl
          productId={product.id}
          productTitle={product.title}
        />
      </section>
    </div>
  );
}
