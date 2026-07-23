"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";

import { getProductContext } from "@/lib/products/data";
import {
  getOwnedProductImageFileName,
  getProductImageExtension,
  isProductImageMimeType,
  PRODUCT_IMAGE_BUCKET,
  PRODUCT_IMAGE_TYPE,
  productImageFileNameMatchesMimeType,
  type ProductImageDeleteState,
  type ProductImageFileMetadata,
  validateProductImageMetadata,
} from "@/lib/products/image-constants";
import { isProductId } from "@/lib/products/schema";

const IMAGE_ERROR = "Unable to update this product image. Please try again.";
const UPLOAD_ERROR = "Unable to finish this image upload. Please try again.";
const PRODUCT_LIBRARY_PATH = "/fashion-studio/products";

type ProductContext = Awaited<ReturnType<typeof getProductContext>>;

type UploadIntentResult =
  | { error: null; path: string; success: true }
  | { error: string; success: false };

type CompleteUploadResult =
  | { error: null; success: true }
  | { error: string; success: false };

async function verifyOwnedProduct(
  { ownerId, supabase }: ProductContext,
  productId: string,
) {
  const { data, error } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) {
    return "error" as const;
  }

  return data ? ("owned" as const) : ("missing" as const);
}

async function removeOwnedObject(
  { supabase }: ProductContext,
  path: string,
) {
  const { error } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .remove([path]);

  return !error;
}

function revalidateProductImages(productId: string) {
  revalidatePath(`${PRODUCT_LIBRARY_PATH}/${productId}`);
}

function readStoredMetadata(metadata: unknown): ProductImageFileMetadata | null {
  if (!metadata || typeof metadata !== "object") {
    return null;
  }

  const value = metadata as Record<string, unknown>;

  if (typeof value.size !== "number" || typeof value.mimetype !== "string") {
    return null;
  }

  return { mimeType: value.mimetype, size: value.size };
}

export async function createProductImageUploadIntent(
  productId: string,
  file: ProductImageFileMetadata,
): Promise<UploadIntentResult> {
  const context = await getProductContext();

  if (
    typeof productId !== "string" ||
    !isProductId(productId) ||
    !file ||
    typeof file.mimeType !== "string" ||
    typeof file.size !== "number"
  ) {
    return { error: UPLOAD_ERROR, success: false };
  }

  const validationError = validateProductImageMetadata(file);

  if (validationError) {
    return { error: validationError, success: false };
  }

  const ownership = await verifyOwnedProduct(context, productId);

  if (ownership !== "owned") {
    return { error: UPLOAD_ERROR, success: false };
  }

  if (!isProductImageMimeType(file.mimeType)) {
    return { error: UPLOAD_ERROR, success: false };
  }

  const fileName = `${randomUUID()}.${getProductImageExtension(file.mimeType)}`;

  return {
    error: null,
    path: `${context.ownerId}/${productId}/${fileName}`,
    success: true,
  };
}

export async function completeProductImageUpload(
  productId: string,
  path: string,
): Promise<CompleteUploadResult> {
  const context = await getProductContext();

  if (
    typeof productId !== "string" ||
    !isProductId(productId) ||
    typeof path !== "string"
  ) {
    return { error: UPLOAD_ERROR, success: false };
  }

  const ownership = await verifyOwnedProduct(context, productId);

  if (ownership !== "owned") {
    return { error: UPLOAD_ERROR, success: false };
  }

  const fileName = getOwnedProductImageFileName(
    path,
    context.ownerId,
    productId,
  );

  if (!fileName) {
    return { error: UPLOAD_ERROR, success: false };
  }

  const folder = `${context.ownerId}/${productId}`;
  const { data: objects, error: listError } = await context.supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .list(folder, { limit: 10, search: fileName });
  const uploadedObject = objects?.find((object) => object.name === fileName);

  if (listError || !uploadedObject) {
    return { error: UPLOAD_ERROR, success: false };
  }

  const storedMetadata = readStoredMetadata(uploadedObject.metadata);
  const validationError = storedMetadata
    ? validateProductImageMetadata(storedMetadata)
    : UPLOAD_ERROR;

  if (
    validationError ||
    !storedMetadata ||
    !productImageFileNameMatchesMimeType(fileName, storedMetadata.mimeType)
  ) {
    await removeOwnedObject(context, path);
    return { error: validationError ?? UPLOAD_ERROR, success: false };
  }

  const { data: existingImage, error: existingImageError } =
    await context.supabase
      .from("product_images")
      .select("id")
      .eq("product_id", productId)
      .eq("image_url", path)
      .maybeSingle();

  if (existingImageError) {
    return { error: UPLOAD_ERROR, success: false };
  }

  if (existingImage) {
    revalidateProductImages(productId);
    return { error: null, success: true };
  }

  const { error: insertError } = await context.supabase
    .from("product_images")
    .insert({
      image_type: PRODUCT_IMAGE_TYPE,
      image_url: path,
      product_id: productId,
    });

  if (insertError) {
    await removeOwnedObject(context, path);
    return { error: UPLOAD_ERROR, success: false };
  }

  revalidateProductImages(productId);
  return { error: null, success: true };
}

export async function discardProductImageUpload(
  productId: string,
  path: string,
) {
  const context = await getProductContext();

  if (
    typeof productId !== "string" ||
    !isProductId(productId) ||
    typeof path !== "string"
  ) {
    return;
  }

  const ownership = await verifyOwnedProduct(context, productId);
  const fileName = getOwnedProductImageFileName(
    path,
    context.ownerId,
    productId,
  );

  if (ownership !== "owned" || !fileName) {
    return;
  }

  const { data: image, error } = await context.supabase
    .from("product_images")
    .select("id")
    .eq("product_id", productId)
    .eq("image_url", path)
    .maybeSingle();

  if (error || image) {
    return;
  }

  await removeOwnedObject(context, path);
}

export async function deleteProductImage(
  productId: string,
  imageId: string,
  _previousState: ProductImageDeleteState,
  _formData: FormData,
): Promise<ProductImageDeleteState> {
  void _previousState;
  void _formData;

  const context = await getProductContext();

  if (
    typeof productId !== "string" ||
    !isProductId(productId) ||
    typeof imageId !== "string" ||
    !isProductId(imageId)
  ) {
    return { deleted: false, error: IMAGE_ERROR };
  }

  const ownership = await verifyOwnedProduct(context, productId);

  if (ownership !== "owned") {
    return { deleted: false, error: IMAGE_ERROR };
  }

  const { data: image, error: imageError } = await context.supabase
    .from("product_images")
    .select("id,product_id,image_url")
    .eq("id", imageId)
    .eq("product_id", productId)
    .maybeSingle();

  if (imageError || !image) {
    return { deleted: false, error: IMAGE_ERROR };
  }

  if (
    image.product_id !== productId ||
    !getOwnedProductImageFileName(
      image.image_url,
      context.ownerId,
      productId,
    )
  ) {
    return { deleted: false, error: IMAGE_ERROR };
  }

  if (!(await removeOwnedObject(context, image.image_url))) {
    return { deleted: false, error: IMAGE_ERROR };
  }

  const { data: deletedImage, error: deleteError } = await context.supabase
    .from("product_images")
    .delete()
    .eq("id", imageId)
    .eq("product_id", productId)
    .select("id")
    .maybeSingle();

  if (deleteError || !deletedImage) {
    return { deleted: false, error: IMAGE_ERROR };
  }

  revalidateProductImages(productId);
  return { deleted: true, error: null };
}
