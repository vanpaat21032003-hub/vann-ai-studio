import {
  GENERATED_IMAGE_EXTENSIONS,
  GENERATED_IMAGE_MAX_BYTES,
  GENERATED_IMAGE_PROMPT_LIMIT,
  GENERATED_IMAGE_PROVIDER_LIMIT,
  GENERATED_IMAGE_RATIOS,
  GENERATED_IMAGE_SOURCE,
} from "./constants";

export type GeneratedImageRatio = (typeof GENERATED_IMAGE_RATIOS)[number];
export type GeneratedImageMime = keyof typeof GENERATED_IMAGE_EXTENSIONS;
export type GeneratedImageMetadata = {
  project_id: string;
  prompt_snapshot: string;
  aspect_ratio: GeneratedImageRatio;
  source_type: typeof GENERATED_IMAGE_SOURCE;
  provider: string | null;
};
export type GeneratedImageRow = GeneratedImageMetadata & {
  id: string;
  storage_path: string;
  created_at: string;
};
export type GeneratedImagePreview = Omit<GeneratedImageRow, "storage_path"> & {
  signedUrl: string | null;
};
export type GeneratedImageResult =
  | { success: true; id: string }
  | { success: false; error: string };
export type GeneratedImageIntent =
  | { success: true; path: string; metadata: GeneratedImageMetadata; mimeType: GeneratedImageMime }
  | { success: false; error: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const FILE_NAME = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$/;
export const GENERATED_IMAGE_SELECT =
  "id,project_id,storage_path,prompt_snapshot,aspect_ratio,source_type,provider,created_at";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizeProjectId(value: unknown): string | null {
  return typeof value === "string" && UUID.test(value) ? value.toLowerCase() : null;
}

export function parseGeneratedImageMetadata(value: unknown): GeneratedImageMetadata | null {
  if (!isRecord(value)) return null;
  const projectId = normalizeProjectId(value.project_id);
  if (
    !projectId ||
    typeof value.prompt_snapshot !== "string" ||
    !value.prompt_snapshot.trim() ||
    value.prompt_snapshot.includes("\0") ||
    Array.from(value.prompt_snapshot).length > GENERATED_IMAGE_PROMPT_LIMIT ||
    !GENERATED_IMAGE_RATIOS.some((ratio) => ratio === value.aspect_ratio) ||
    value.source_type !== GENERATED_IMAGE_SOURCE ||
    !(value.provider === null || typeof value.provider === "string")
  ) return null;
  const provider = typeof value.provider === "string" ? value.provider.trim() : null;
  if (provider && (provider.includes("\0") || Array.from(provider).length > GENERATED_IMAGE_PROVIDER_LIMIT)) return null;
  return {
    project_id: projectId,
    prompt_snapshot: value.prompt_snapshot,
    aspect_ratio: value.aspect_ratio as GeneratedImageRatio,
    source_type: GENERATED_IMAGE_SOURCE,
    provider: provider || null,
  };
}

export function isGeneratedImageMime(value: unknown): value is GeneratedImageMime {
  return typeof value === "string" && Object.hasOwn(GENERATED_IMAGE_EXTENSIONS, value);
}

export function validFileMetadata(value: unknown): value is { size: number; mimeType: GeneratedImageMime } {
  return isRecord(value) && isGeneratedImageMime(value.mimeType) &&
    typeof value.size === "number" && Number.isSafeInteger(value.size) &&
    value.size > 0 && value.size <= GENERATED_IMAGE_MAX_BYTES;
}

export function validFileIntent(value: unknown): value is { name: string; size: number; mimeType: GeneratedImageMime } {
  if (!isRecord(value) || typeof value.name !== "string") return false;
  const name = value.name;
  if (!validFileMetadata(value)) return false;
  if (!name || name.length > 255 || /[\x00-\x1f/\\]/.test(name)) return false;
  const extension = name.split(".").pop()?.toLowerCase();
  return value.mimeType === "image/jpeg"
    ? extension === "jpg" || extension === "jpeg"
    : extension === GENERATED_IMAGE_EXTENSIONS[value.mimeType];
}

export function ownedImageFileName(path: unknown, ownerId: string, projectId: string): string | null {
  if (typeof path !== "string") return null;
  const prefix = `${ownerId}/${projectId}/`;
  if (!path.startsWith(prefix)) return null;
  const fileName = path.slice(prefix.length);
  return FILE_NAME.test(fileName) ? fileName : null;
}

export function fileMatchesMime(fileName: string, mimeType: GeneratedImageMime) {
  return fileName.endsWith(`.${GENERATED_IMAGE_EXTENSIONS[mimeType]}`);
}

export function signatureMatches(bytes: Uint8Array, mimeType: GeneratedImageMime) {
  if (mimeType === "image/jpeg") return bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (mimeType === "image/png") return [137, 80, 78, 71, 13, 10, 26, 10].every((byte, i) => bytes[i] === byte);
  return bytes.length >= 12 &&
    [82, 73, 70, 70].every((byte, i) => bytes[i] === byte) &&
    [87, 69, 66, 80].every((byte, i) => bytes[i + 8] === byte);
}

export function metadataMatches(row: GeneratedImageRow, metadata: GeneratedImageMetadata) {
  return row.project_id === metadata.project_id &&
    row.prompt_snapshot === metadata.prompt_snapshot &&
    row.aspect_ratio === metadata.aspect_ratio &&
    row.source_type === metadata.source_type &&
    row.provider === metadata.provider;
}

export function galleryPage(value: unknown): number {
  if (typeof value !== "string" || !/^[1-9]\d{0,5}$/.test(value)) return 1;
  return Number(value);
}
