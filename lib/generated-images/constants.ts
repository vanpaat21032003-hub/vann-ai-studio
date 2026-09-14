export const GENERATED_IMAGE_BUCKET = "generated-images";
export const GENERATED_IMAGE_MAX_BYTES = 8 * 1024 * 1024;
export const GENERATED_IMAGE_TTL_SECONDS = 300;
export const GENERATED_IMAGE_PAGE_SIZE = 12;
export const GENERATED_IMAGE_PROMPT_LIMIT = 20_000;
export const GENERATED_IMAGE_PROVIDER_LIMIT = 120;
export const GENERATED_IMAGE_SOURCE = "external_upload";
export const GENERATED_IMAGE_RATIOS = ["9:16", "1:1", "4:5"] as const;
export const GENERATED_IMAGE_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;
export const GENERATED_IMAGE_ACCEPT = Object.keys(GENERATED_IMAGE_EXTENSIONS).join(",");
