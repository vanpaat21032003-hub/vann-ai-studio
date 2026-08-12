import "server-only";

import { isStyleId, STYLE_SELECT, type StyleRecord } from "@/lib/styles/schema";
import { getAuthenticatedContext } from "@/lib/supabase/auth";

export async function getStyleContext() {
  return getAuthenticatedContext();
}

export type StyleListFilters = { search: string; status: "all" | "active" | "archived" };

export async function getOwnedStyles({ search, status }: StyleListFilters) {
  const { ownerId, supabase } = await getStyleContext();
  let query = supabase.from("styles").select(STYLE_SELECT).eq("owner_id", ownerId).order("updated_at", { ascending: false });
  if (status !== "all") query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw new Error("Style data is temporarily unavailable.");
  const styles = (data ?? []) as StyleRecord[];
  const normalizedSearch = search.trim().toLocaleLowerCase();
  if (!normalizedSearch) return styles;
  return styles.filter((style) =>
    [style.name, style.lighting, style.camera, style.background, style.mood].some((value) => value?.toLocaleLowerCase().includes(normalizedSearch)),
  );
}

export async function getOwnedStyle(styleId: string) {
  if (!isStyleId(styleId)) return null;
  const { ownerId, supabase } = await getStyleContext();
  const { data, error } = await supabase.from("styles").select(STYLE_SELECT).eq("id", styleId).eq("owner_id", ownerId).maybeSingle();
  if (error) throw new Error("Style data is temporarily unavailable.");
  return data as StyleRecord | null;
}
