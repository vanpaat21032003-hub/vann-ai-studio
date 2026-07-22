import "server-only";

import { getProductContext } from "@/lib/products/data";
import {
  getOwnedProductImageFileName,
  PRODUCT_IMAGE_BUCKET,
  PRODUCT_IMAGE_SIGNED_URL_TTL_SECONDS,
  PRODUCT_IMAGE_TYPE,
} from "@/lib/products/image-constants";
import { isProductId } from "@/lib/products/schema";

export type ProductImagePreview = {
  createdAt: string;
  id: string;
  signedUrl: string;
};

type ProductImageRow = {
  created_at: string;
  id: string;
  image_type: string;
  image_url: string;
  product_id: string;
};

const LOAD_ERROR = "Product images are temporarily unavailable.";

export async function getOwnedProductImages(
  productId: string,
): Promise<ProductImagePreview[]> {
  const { ownerId, supabase } = await getProductContext();

  if (!isProductId(productId)) {
    return [];
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (productError) {
    throw new Error(LOAD_ERROR);
  }

  if (!product) {
    return [];
  }

  const { data, error } = await supabase
    .from("product_images")
    .select("id,product_id,image_url,image_type,created_at")
    .eq("product_id", productId)
    .eq("image_type", PRODUCT_IMAGE_TYPE)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(LOAD_ERROR);
  }

  return Promise.all(
    ((data ?? []) as ProductImageRow[]).map(async (image) => {
      if (
        image.product_id !== productId ||
        image.image_type !== PRODUCT_IMAGE_TYPE ||
        !getOwnedProductImageFileName(image.image_url, ownerId, productId)
      ) {
        throw new Error(LOAD_ERROR);
      }

      const { data: signedImage, error: signedImageError } = await supabase.storage
        .from(PRODUCT_IMAGE_BUCKET)
        .createSignedUrl(
          image.image_url,
          PRODUCT_IMAGE_SIGNED_URL_TTL_SECONDS,
        );

      if (signedImageError || !signedImage?.signedUrl) {
        throw new Error(LOAD_ERROR);
      }

      return {
        createdAt: image.created_at,
        id: image.id,
        signedUrl: signedImage.signedUrl,
      };
    }),
  );
}
