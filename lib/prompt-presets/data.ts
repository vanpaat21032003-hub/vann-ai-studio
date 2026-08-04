import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  isPromptPresetId,
  PROMPT_PRESET_SELECT,
  type PromptPresetRecord,
} from "@/lib/prompt-presets/schema";

export async function getPromptPresetContext() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const ownerId = data?.claims?.sub;

  if (error || typeof ownerId !== "string" || !ownerId) {
    redirect("/login");
  }

  return { ownerId, supabase };
}

export type PromptPresetListFilters = {
  search: string;
  status: "all" | "active" | "archived";
};

export async function getOwnedPromptPresets({
  search,
  status,
}: PromptPresetListFilters) {
  const { ownerId, supabase } = await getPromptPresetContext();
  let query = supabase
    .from("prompt_presets")
    .select(PROMPT_PRESET_SELECT)
    .eq("owner_id", ownerId)
    .order("updated_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error("Prompt preset data is temporarily unavailable.");
  }

  const presets = (data ?? []) as PromptPresetRecord[];
  const normalizedSearch = search.trim().toLocaleLowerCase();
  if (!normalizedSearch) return presets;

  return presets.filter((preset) =>
    [preset.title, preset.category, preset.prompt].some((value) =>
      value.toLocaleLowerCase().includes(normalizedSearch),
    ),
  );
}

export async function getOwnedPromptPreset(presetId: string) {
  if (!isPromptPresetId(presetId)) return null;

  const { ownerId, supabase } = await getPromptPresetContext();
  const { data, error } = await supabase
    .from("prompt_presets")
    .select(PROMPT_PRESET_SELECT)
    .eq("id", presetId)
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) {
    throw new Error("Prompt preset data is temporarily unavailable.");
  }

  return data as PromptPresetRecord | null;
}
