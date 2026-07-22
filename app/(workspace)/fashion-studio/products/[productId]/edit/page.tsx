import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductForm } from "@/app/components/products/ProductForm";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { getOwnedProduct } from "@/lib/products/data";

export default async function EditProductPage({
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
        href={`/fashion-studio/products/${product.id}`}
      >
        <span aria-hidden="true">←</span>
        Product detail
      </Link>
      <PageHeader
        description="Update product metadata without changing ownership or connected assets."
        eyebrow="Product Library"
        title="Edit product"
      />
      <ProductForm mode="edit" product={product} />
    </div>
  );
}
