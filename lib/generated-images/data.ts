import "server-only";

import { getProjectContext } from "@/lib/projects/data";
import { GENERATED_IMAGE_BUCKET, GENERATED_IMAGE_PAGE_SIZE, GENERATED_IMAGE_TTL_SECONDS } from "./constants";
import { ownsGeneratedImageProject } from "./ownership";
import { GENERATED_IMAGE_SELECT, normalizeProjectId, ownedImageFileName, type GeneratedImagePreview, type GeneratedImageRow } from "./schema";

export async function getOwnedGeneratedImages(projectId: string, page = 1): Promise<{
  images: GeneratedImagePreview[]; hasMore: boolean;
}> {
  const context = await getProjectContext();
  const id = normalizeProjectId(projectId);
  if (!id || !(await ownsGeneratedImageProject(context, id))) {
    throw new Error("Generated images are unavailable.");
  }
  const safePage = Number.isSafeInteger(page) && page >= 1 && page <= 999999 ? page : 1;
  const offset = (safePage - 1) * GENERATED_IMAGE_PAGE_SIZE;
  const { data, error } = await context.supabase.from("generated_images")
    .select(GENERATED_IMAGE_SELECT).eq("project_id", id)
    .order("created_at", { ascending: false }).order("id", { ascending: false })
    .range(offset, offset + GENERATED_IMAGE_PAGE_SIZE);
  if (error) throw new Error("Generated images are unavailable.");
  const rows = (data ?? []) as GeneratedImageRow[];
  const images = await Promise.all(rows.slice(0, GENERATED_IMAGE_PAGE_SIZE).map(async (row) => {
    const { storage_path: path, ...metadata } = row;
    let signedUrl: string | null = null;
    if (row.project_id === id && ownedImageFileName(path, context.ownerId, id)) {
      try {
        const signed = await context.supabase.storage.from(GENERATED_IMAGE_BUCKET)
          .createSignedUrl(path, GENERATED_IMAGE_TTL_SECONDS);
        if (!signed.error && signed.data?.signedUrl) signedUrl = signed.data.signedUrl;
      } catch {
        // A missing object must not prevent other assets from being displayed.
      }
    }
    return { ...metadata, signedUrl };
  }));
  return { images, hasMore: rows.length > GENERATED_IMAGE_PAGE_SIZE };
}
