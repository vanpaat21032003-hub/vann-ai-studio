"use server";

import { revalidatePath } from "next/cache";
import { getProjectContext } from "@/lib/projects/data";
import { finalizeGeneratedImage, prepareGeneratedImage } from "./upload";
import { parseGeneratedImageMetadata } from "./schema";

export async function createGeneratedImageUploadIntent(input: unknown, file: unknown) {
  const context = await getProjectContext();
  return prepareGeneratedImage(context, input, file);
}

export async function completeGeneratedImageUpload(input: unknown, path: unknown) {
  const context = await getProjectContext();
  const result = await finalizeGeneratedImage(context, input, path);
  const metadata = parseGeneratedImageMetadata(input);
  if (result.success && metadata) {
    revalidatePath(`/fashion-studio/projects/${metadata.project_id}`);
    revalidatePath("/fashion-studio/image-generator");
  }
  return result;
}
