export const PRODUCT_IMAGE_BUCKET = "products";
export const PRODUCT_IMAGE_TYPE = "source";
export const PRODUCT_IMAGE_MAX_BYTES = 8 * 1024 * 1024;
export const PRODUCT_IMAGE_SIGNED_URL_TTL_SECONDS = 5 * 60;

export const PRODUCT_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const PRODUCT_IMAGE_ACCEPT = PRODUCT_IMAGE_MIME_TYPES.join(",");

export type ProductImageMimeType = (typeof PRODUCT_IMAGE_MIME_TYPES)[number];

export type ProductImageFileMetadata = {
  mimeType: string;
  size: number;
};

export type ProductImageDeleteState = {
  deleted: boolean;
  error: string | null;
};

const extensions: Record<ProductImageMimeType, "jpg" | "png" | "webp"> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const generatedFileNamePattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$/i;

export function isProductImageMimeType(
  value: string,
): value is ProductImageMimeType {
  return PRODUCT_IMAGE_MIME_TYPES.some((mimeType) => mimeType === value);
}

export function validateProductImageMetadata({
  mimeType,
  size,
}: ProductImageFileMetadata) {
  if (!Number.isSafeInteger(size) || size <= 0) {
    return "Choose an image that is not empty.";
  }

  if (size > PRODUCT_IMAGE_MAX_BYTES) {
    return "Choose an image no larger than 8 MB.";
  }

  if (!isProductImageMimeType(mimeType)) {
    return "Use a JPEG, PNG, or WebP image.";
  }

  return null;
}

export function getProductImageExtension(mimeType: ProductImageMimeType) {
  return extensions[mimeType];
}

export function productImageFileNameMatchesMimeType(
  fileName: string,
  mimeType: string,
) {
  return (
    isProductImageMimeType(mimeType) &&
    fileName.toLocaleLowerCase().endsWith(`.${getProductImageExtension(mimeType)}`)
  );
}

export function getOwnedProductImageFileName(
  path: string,
  ownerId: string,
  productId: string,
) {
  const prefix = `${ownerId}/${productId}/`;

  if (!path.startsWith(prefix)) {
    return null;
  }

  const fileName = path.slice(prefix.length);

  if (!generatedFileNamePattern.test(fileName)) {
    return null;
  }

  return fileName;
}
