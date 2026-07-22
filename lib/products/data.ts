import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  isProductId,
  PRODUCT_SELECT,
  type ProductRecord,
} from "@/lib/products/schema";

export async function getProductContext() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const ownerId = data?.claims?.sub;

  if (error || typeof ownerId !== "string" || !ownerId) {
    redirect("/login");
  }

  return { ownerId, supabase };
}

export type ProductListFilters = {
  search: string;
  status: "all" | "draft" | "archived";
};

export async function getOwnedProducts({ search, status }: ProductListFilters) {
  const { ownerId, supabase } = await getProductContext();
  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("owner_id", ownerId)
    .order("updated_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Product data is temporarily unavailable.");
  }

  const products = (data ?? []) as ProductRecord[];
  const normalizedSearch = search.trim().toLocaleLowerCase();

  if (!normalizedSearch) {
    return products;
  }

  return products.filter((product) =>
    [product.title, product.brand, product.category, product.color].some(
      (value) => value?.toLocaleLowerCase().includes(normalizedSearch),
    ),
  );
}

export async function getOwnedProduct(productId: string) {
  if (!isProductId(productId)) {
    return null;
  }

  const { ownerId, supabase } = await getProductContext();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", productId)
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) {
    throw new Error("Product data is temporarily unavailable.");
  }

  return data as ProductRecord | null;
}
