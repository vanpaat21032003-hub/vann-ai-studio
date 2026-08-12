import "server-only";

import {
  isModelId,
  MODEL_SELECT,
  type ModelRecord,
} from "@/lib/models/schema";
import { getAuthenticatedContext } from "@/lib/supabase/auth";

// ---------------------------------------------------------------------------
// Auth context (mirrors lib/products/data.ts pattern)
// ---------------------------------------------------------------------------

export async function getModelContext() {
  return getAuthenticatedContext();
}

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

export type ModelListFilters = {
  search: string;
  status: "all" | "active" | "archived";
};

export async function getOwnedModels({ search, status }: ModelListFilters) {
  const { ownerId, supabase } = await getModelContext();

  let query = supabase
    .from("models")
    .select(MODEL_SELECT)
    .eq("owner_id", ownerId)
    .order("updated_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Model data is temporarily unavailable.");
  }

  const models = (data ?? []) as ModelRecord[];
  const normalizedSearch = search.trim().toLocaleLowerCase();

  if (!normalizedSearch) {
    return models;
  }

  return models.filter((model) => {
    const tagMatch = model.tags.some((tag) =>
      tag.toLocaleLowerCase().includes(normalizedSearch),
    );
    return (
      [model.name, model.body_type, model.style, model.pose].some((value) =>
        value?.toLocaleLowerCase().includes(normalizedSearch),
      ) || tagMatch
    );
  });
}

// ---------------------------------------------------------------------------
// Single record
// ---------------------------------------------------------------------------

export async function getOwnedModel(modelId: string) {
  if (!isModelId(modelId)) {
    return null;
  }

  const { ownerId, supabase } = await getModelContext();
  const { data, error } = await supabase
    .from("models")
    .select(MODEL_SELECT)
    .eq("id", modelId)
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) {
    throw new Error("Model data is temporarily unavailable.");
  }

  return data as ModelRecord | null;
}
