import { ProductImageDeleteControl } from "@/app/components/products/ProductImageDeleteControl";
import { AppIcon } from "@/app/components/ui/AppIcon";
import { Card } from "@/app/components/ui/Card";
import { EmptyState } from "@/app/components/ui/EmptyState";
import type { ProductImagePreview } from "@/lib/products/image-data";

type ProductImageGalleryProps = {
  images: ProductImagePreview[];
  productId: string;
  productTitle: string;
};

function formatUploadedAt(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ProductImageGallery({
  images,
  productId,
  productTitle,
}: ProductImageGalleryProps) {
  if (images.length === 0) {
    return (
      <Card>
        <EmptyState
          description="Upload a source product image to start this private gallery. No public URL or sample image is used."
          icon={<AppIcon className="size-5" name="image" />}
          title="No source images yet"
        />
      </Card>
    );
  }

  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {images.map((image, index) => (
        <Card className="min-w-0" key={image.id}>
          <div className="aspect-[4/3] overflow-hidden bg-app/80">
            {/* A native image is intentional for short-lived private signed URLs. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={`${productTitle} source image ${index + 1}`}
              className="h-full w-full object-cover"
              height="600"
              loading="lazy"
              src={image.signedUrl}
              width="800"
            />
          </div>
          <div className="border-t border-border-soft p-4">
            <p className="text-xs leading-5 text-text-muted">
              Uploaded {formatUploadedAt(image.createdAt)}
            </p>
            <div className="mt-3">
              <ProductImageDeleteControl
                imageId={image.id}
                productId={productId}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
