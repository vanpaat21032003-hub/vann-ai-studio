"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStyleContext } from "@/lib/styles/data";
import { isStyleId, parseStyleForm, type StyleActionState, type StyleArchiveState } from "@/lib/styles/schema";

const PATH = "/fashion-studio/styles";
function revalidateStyles(styleId?: string) { revalidatePath(PATH); if (styleId) revalidatePath(`${PATH}/${styleId}`); }

export async function createStyle(_: StyleActionState, formData: FormData): Promise<StyleActionState> {
  const parsed = parseStyleForm(formData); if (!parsed.success) return parsed.state;
  const { ownerId, supabase } = await getStyleContext();
  const { data, error } = await supabase.from("styles").insert({ ...parsed.values, owner_id: ownerId, status: "active" }).select("id").single();
  if (error || !data?.id) return { error: "Unable to save this style. Please try again." };
  revalidateStyles(data.id); redirect(`${PATH}/${data.id}`);
}

export async function updateStyle(styleId: string, _: StyleActionState, formData: FormData): Promise<StyleActionState> {
  if (!isStyleId(styleId)) return { error: "This style is no longer available." };
  const parsed = parseStyleForm(formData); if (!parsed.success) return parsed.state;
  const { ownerId, supabase } = await getStyleContext();
  const { data, error } = await supabase.from("styles").update(parsed.values).eq("id", styleId).eq("owner_id", ownerId).select("id").maybeSingle();
  if (error) return { error: "Unable to save this style. Please try again." };
  if (!data) return { error: "This style is no longer available." };
  revalidateStyles(styleId); redirect(`${PATH}/${styleId}`);
}

async function changeStyleStatus(styleId: string, from: "active" | "archived", to: "active" | "archived", message: string): Promise<StyleArchiveState> {
  if (!isStyleId(styleId)) return { archived: false, restored: false, error: message };
  const { ownerId, supabase } = await getStyleContext();
  const { data, error } = await supabase.from("styles").update({ status: to }).eq("id", styleId).eq("owner_id", ownerId).eq("status", from).select("id").maybeSingle();
  if (error || !data) return { archived: false, restored: false, error: message };
  revalidateStyles(styleId);
  redirect(`${PATH}/${styleId}`);
}
export async function archiveStyle(styleId: string, previousState: StyleArchiveState, formData: FormData) {
  void previousState;
  void formData;
  return changeStyleStatus(styleId, "active", "archived", "Unable to archive this style. Please try again.");
}
export async function restoreStyle(styleId: string, previousState: StyleArchiveState, formData: FormData) {
  void previousState;
  void formData;
  return changeStyleStatus(styleId, "archived", "active", "Unable to restore this style. Please try again.");
}
