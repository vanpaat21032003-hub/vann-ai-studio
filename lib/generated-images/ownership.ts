import "server-only";

import { getProjectContext } from "@/lib/projects/data";
import { normalizeProjectId } from "./schema";

export type GeneratedImageContext = Awaited<ReturnType<typeof getProjectContext>>;

export async function ownsGeneratedImageProject(context: GeneratedImageContext, projectId: unknown) {
  const id = normalizeProjectId(projectId);
  if (!id) return false;
  const { data, error } = await context.supabase.from("projects").select("id")
    .eq("id", id).eq("owner_id", context.ownerId).maybeSingle();
  return !error && Boolean(data);
}
