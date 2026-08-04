"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getPromptPresetContext } from "@/lib/prompt-presets/data";
import {
  isPromptPresetId,
  parsePromptPresetForm,
  type PromptPresetActionState,
  type PromptPresetArchiveState,
} from "@/lib/prompt-presets/schema";

const PRESET_LIBRARY_PATH = "/fashion-brain/presets";
const SAVE_ERROR = "Unable to save this prompt preset. Please try again.";

function revalidatePromptPresetLibrary(presetId?: string) {
  revalidatePath(PRESET_LIBRARY_PATH);
  if (presetId) revalidatePath(`${PRESET_LIBRARY_PATH}/${presetId}`);
}

export async function createPromptPreset(
  _previousState: PromptPresetActionState,
  formData: FormData,
): Promise<PromptPresetActionState> {
  const parsed = parsePromptPresetForm(formData);
  if (!parsed.success) return parsed.state;

  const { ownerId, supabase } = await getPromptPresetContext();
  const { data, error } = await supabase
    .from("prompt_presets")
    .insert({ ...parsed.values, owner_id: ownerId, status: "active" })
    .select("id")
    .single();

  if (error || !data?.id) return { error: SAVE_ERROR };

  revalidatePromptPresetLibrary(data.id);
  redirect(`${PRESET_LIBRARY_PATH}/${data.id}`);
}

export async function updatePromptPreset(
  presetId: string,
  _previousState: PromptPresetActionState,
  formData: FormData,
): Promise<PromptPresetActionState> {
  if (!isPromptPresetId(presetId)) {
    return { error: "This prompt preset is no longer available." };
  }

  const parsed = parsePromptPresetForm(formData);
  if (!parsed.success) return parsed.state;

  const { ownerId, supabase } = await getPromptPresetContext();
  const { data, error } = await supabase
    .from("prompt_presets")
    .update(parsed.values)
    .eq("id", presetId)
    .eq("owner_id", ownerId)
    .select("id")
    .maybeSingle();

  if (error) return { error: SAVE_ERROR };
  if (!data) return { error: "This prompt preset is no longer available." };

  revalidatePromptPresetLibrary(presetId);
  redirect(`${PRESET_LIBRARY_PATH}/${presetId}`);
}

async function changePromptPresetStatus(
  presetId: string,
  from: "active" | "archived",
  to: "active" | "archived",
  errorMessage: string,
): Promise<PromptPresetArchiveState> {
  if (!isPromptPresetId(presetId)) return { error: errorMessage };

  const { ownerId, supabase } = await getPromptPresetContext();
  const { data, error } = await supabase
    .from("prompt_presets")
    .update({ status: to })
    .eq("id", presetId)
    .eq("owner_id", ownerId)
    .eq("status", from)
    .select("id")
    .maybeSingle();

  if (error || !data) return { error: errorMessage };

  revalidatePromptPresetLibrary(presetId);
  redirect(`${PRESET_LIBRARY_PATH}/${presetId}`);
}

export async function archivePromptPreset(
  presetId: string,
  _previousState: PromptPresetArchiveState,
  _formData: FormData,
) {
  void _previousState;
  void _formData;
  return changePromptPresetStatus(
    presetId,
    "active",
    "archived",
    "Unable to archive this prompt preset. Please try again.",
  );
}

export async function restorePromptPreset(
  presetId: string,
  _previousState: PromptPresetArchiveState,
  _formData: FormData,
) {
  void _previousState;
  void _formData;
  return changePromptPresetStatus(
    presetId,
    "archived",
    "active",
    "Unable to restore this prompt preset. Please try again.",
  );
}
