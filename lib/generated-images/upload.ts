import "server-only";

import { randomUUID } from "node:crypto";
import { GENERATED_IMAGE_BUCKET, GENERATED_IMAGE_EXTENSIONS } from "./constants";
import { ownsGeneratedImageProject, type GeneratedImageContext } from "./ownership";
import {
  fileMatchesMime, GENERATED_IMAGE_SELECT, isRecord, metadataMatches,
  ownedImageFileName, parseGeneratedImageMetadata, signatureMatches,
  validFileIntent, validFileMetadata,
  type GeneratedImageIntent, type GeneratedImageResult, type GeneratedImageRow,
} from "./schema";

const ERROR = "Unable to save this generated image. Check the details and try again.";
const CONFLICT = "This upload is already saved with different details. Open the project gallery to review it.";

export async function prepareGeneratedImage(
  context: GeneratedImageContext, input: unknown, file: unknown,
): Promise<GeneratedImageIntent> {
  try {
    const metadata = parseGeneratedImageMetadata(input);
    if (!metadata || !validFileIntent(file) || !(await ownsGeneratedImageProject(context, metadata.project_id))) {
      return { success: false, error: ERROR };
    }
    return {
      success: true,
      path: `${context.ownerId}/${metadata.project_id}/${randomUUID()}.${GENERATED_IMAGE_EXTENSIONS[file.mimeType]}`,
      metadata,
      mimeType: file.mimeType,
    };
  } catch {
    return { success: false, error: ERROR };
  }
}

export async function finalizeGeneratedImage(
  context: GeneratedImageContext, input: unknown, path: unknown,
): Promise<GeneratedImageResult> {
  try {
    const metadata = parseGeneratedImageMetadata(input);
    if (!metadata || !(await ownsGeneratedImageProject(context, metadata.project_id))) {
      return { success: false, error: ERROR };
    }
    const fileName = ownedImageFileName(path, context.ownerId, metadata.project_id);
    if (!fileName || typeof path !== "string") return { success: false, error: ERROR };

    const findExisting = () => context.supabase.from("generated_images")
      .select(GENERATED_IMAGE_SELECT).eq("storage_path", path).maybeSingle();
    const existing = await findExisting();
    if (existing.error) return { success: false, error: ERROR };
    if (existing.data) {
      const row = existing.data as GeneratedImageRow;
      return metadataMatches(row, metadata)
        ? { success: true, id: row.id }
        : { success: false, error: CONFLICT };
    }

    const storage = context.supabase.storage.from(GENERATED_IMAGE_BUCKET);
    const { data: objects, error: listError } = await storage.list(
      `${context.ownerId}/${metadata.project_id}`, { search: fileName, limit: 10 },
    );
    const object = objects?.find((item) => item.name === fileName);
    const stored = isRecord(object?.metadata)
      ? { size: object.metadata.size, mimeType: object.metadata.mimetype }
      : null;
    if (listError || !object || !validFileMetadata(stored) || !fileMatchesMime(fileName, stored.mimeType)) {
      return { success: false, error: ERROR };
    }

    // Read the private object with the user's session, never a client-supplied URL.
    const { data: blob, error: downloadError } = await storage.download(path);
    if (
      downloadError || !blob ||
      !validFileMetadata({ size: blob.size, mimeType: stored.mimeType }) ||
      blob.size !== stored.size ||
      (blob.type && blob.type !== stored.mimeType) ||
      !signatureMatches(new Uint8Array(await blob.slice(0, 12).arrayBuffer()), stored.mimeType)
    ) return { success: false, error: ERROR };

    const { data, error } = await context.supabase.from("generated_images")
      .insert({ ...metadata, storage_path: path }).select("id").single();
    if (!error && data?.id) return { success: true, id: data.id };

    // A duplicate race or lost response may mean the insert already committed.
    // Never remove an object here: Storage and Postgres are not one transaction.
    const retry = await findExisting();
    if (!retry.error && retry.data) {
      const row = retry.data as GeneratedImageRow;
      return metadataMatches(row, metadata)
        ? { success: true, id: row.id }
        : { success: false, error: CONFLICT };
    }
    return { success: false, error: ERROR };
  } catch {
    return { success: false, error: ERROR };
  }
}
