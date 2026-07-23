"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getModelContext } from "@/lib/models/data";
import {
  isModelId,
  parseModelForm,
  type ModelActionState,
  type ModelArchiveState,
} from "@/lib/models/schema";

const SAVE_ERROR = "Unable to save this model. Please try again.";
const ARCHIVE_ERROR = "Unable to archive this model. Please try again.";
const RESTORE_ERROR = "Unable to restore this model. Please try again.";
const MODEL_LIBRARY_PATH = "/fashion-studio/models";

function revalidateModelLibrary(modelId?: string) {
  revalidatePath(MODEL_LIBRARY_PATH);

  if (modelId) {
    revalidatePath(`${MODEL_LIBRARY_PATH}/${modelId}`);
  }
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export async function createModel(
  _previousState: ModelActionState,
  formData: FormData,
): Promise<ModelActionState> {
  const parsed = parseModelForm(formData);

  if (!parsed.success) {
    return parsed.state;
  }

  const { ownerId, supabase } = await getModelContext();
  const { data, error } = await supabase
    .from("models")
    .insert({
      ...parsed.values,
      owner_id: ownerId,
      status: "active",
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return { error: SAVE_ERROR };
  }

  revalidateModelLibrary(data.id);
  redirect(`${MODEL_LIBRARY_PATH}/${data.id}`);
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

export async function updateModel(
  modelId: string,
  _previousState: ModelActionState,
  formData: FormData,
): Promise<ModelActionState> {
  if (!isModelId(modelId)) {
    return { error: "This model is no longer available." };
  }

  const parsed = parseModelForm(formData);

  if (!parsed.success) {
    return parsed.state;
  }

  const { ownerId, supabase } = await getModelContext();
  const { data, error } = await supabase
    .from("models")
    .update(parsed.values)
    .eq("id", modelId)
    .eq("owner_id", ownerId)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: SAVE_ERROR };
  }

  if (!data) {
    return { error: "This model is no longer available." };
  }

  revalidateModelLibrary(modelId);
  redirect(`${MODEL_LIBRARY_PATH}/${modelId}`);
}

// ---------------------------------------------------------------------------
// Archive / restore
// ---------------------------------------------------------------------------

export async function archiveModel(
  modelId: string,
  _previousState: ModelArchiveState,
  _formData: FormData,
): Promise<ModelArchiveState> {
  void _previousState;
  void _formData;

  if (!isModelId(modelId)) {
    return { archived: false, restored: false, error: ARCHIVE_ERROR };
  }

  const { ownerId, supabase } = await getModelContext();
  const { data, error } = await supabase
    .from("models")
    .update({ status: "archived" })
    .eq("id", modelId)
    .eq("owner_id", ownerId)
    .eq("status", "active")
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return { archived: false, restored: false, error: ARCHIVE_ERROR };
  }

  revalidateModelLibrary(modelId);
  return { archived: true, restored: false, error: null };
}

export async function restoreModel(
  modelId: string,
  _previousState: ModelArchiveState,
  _formData: FormData,
): Promise<ModelArchiveState> {
  void _previousState;
  void _formData;

  if (!isModelId(modelId)) {
    return { archived: false, restored: false, error: RESTORE_ERROR };
  }

  const { ownerId, supabase } = await getModelContext();
  const { data, error } = await supabase
    .from("models")
    .update({ status: "active" })
    .eq("id", modelId)
    .eq("owner_id", ownerId)
    .eq("status", "archived")
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return { archived: false, restored: false, error: RESTORE_ERROR };
  }

  revalidateModelLibrary(modelId);
  return { archived: false, restored: true, error: null };
}
