"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getProductContext } from "@/lib/products/data";
import {
  isProductId,
  parseProductForm,
  type ArchiveProductState,
  type DeleteProductState,
  type ProductActionState,
} from "@/lib/products/schema";

const SAVE_ERROR = "Unable to save this product. Please try again.";
const ARCHIVE_ERROR = "Unable to archive this product. Please try again.";
const DELETE_ERROR = "Unable to delete this product. Please try again.";
const PRODUCT_LIBRARY_PATH = "/fashion-studio/products";

function revalidateProductLibrary(productId?: string) {
  revalidatePath(PRODUCT_LIBRARY_PATH);

  if (productId) {
    revalidatePath(`${PRODUCT_LIBRARY_PATH}/${productId}`);
  }
}

export async function createProduct(
  _previousState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const parsed = parseProductForm(formData);

  if (!parsed.success) {
    return parsed.state;
  }

  const { ownerId, supabase } = await getProductContext();
  const { data, error } = await supabase
    .from("products")
    .insert({
      ...parsed.values,
      owner_id: ownerId,
      status: "draft",
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return { error: SAVE_ERROR };
  }

  revalidateProductLibrary(data.id);
  redirect(`${PRODUCT_LIBRARY_PATH}/${data.id}`);
}

export async function updateProduct(
  productId: string,
  _previousState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  if (!isProductId(productId)) {
    return { error: "This product is no longer available." };
  }

  const parsed = parseProductForm(formData);

  if (!parsed.success) {
    return parsed.state;
  }

  const { ownerId, supabase } = await getProductContext();
  const { data, error } = await supabase
    .from("products")
    .update(parsed.values)
    .eq("id", productId)
    .eq("owner_id", ownerId)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: SAVE_ERROR };
  }

  if (!data) {
    return { error: "This product is no longer available." };
  }

  revalidateProductLibrary(productId);
  redirect(`${PRODUCT_LIBRARY_PATH}/${productId}`);
}

export async function archiveProduct(
  productId: string,
  _previousState: ArchiveProductState,
  _formData: FormData,
): Promise<ArchiveProductState> {
  void _previousState;
  void _formData;

  if (!isProductId(productId)) {
    return { archived: false, error: ARCHIVE_ERROR };
  }

  const { ownerId, supabase } = await getProductContext();
  const { data, error } = await supabase
    .from("products")
    .update({ status: "archived" })
    .eq("id", productId)
    .eq("owner_id", ownerId)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return { archived: false, error: ARCHIVE_ERROR };
  }

  revalidateProductLibrary(productId);
  return { archived: true, error: null };
}

export async function deleteProduct(
  productId: string,
  _previousState: DeleteProductState,
  formData: FormData,
): Promise<DeleteProductState> {
  if (!isProductId(productId)) {
    return { error: "This product is no longer available." };
  }

  const confirmation = formData.get("confirmation");
  const { ownerId, supabase } = await getProductContext();
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id,title")
    .eq("id", productId)
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (productError) {
    return { error: DELETE_ERROR };
  }

  if (!product) {
    return { error: "This product is no longer available." };
  }

  if (typeof confirmation !== "string" || confirmation.trim() !== product.title) {
    return { error: "Enter the product title exactly to confirm deletion." };
  }

  const { count, error: imageError } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  if (imageError) {
    return { error: DELETE_ERROR };
  }

  if (count && count > 0) {
    return {
      error:
        "This product has image records and cannot be deleted until its assets are handled safely.",
    };
  }

  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("owner_id", ownerId)
    .select("id")
    .maybeSingle();

  if (error?.code === "23503") {
    return {
      error: "This product is connected to other work and cannot be deleted.",
    };
  }

  if (error) {
    return { error: DELETE_ERROR };
  }

  if (!data) {
    return { error: "This product is no longer available." };
  }

  revalidateProductLibrary(productId);
  redirect(PRODUCT_LIBRARY_PATH);
}
