import "server-only";

const GEMINI_IMAGE_MODEL = "gemini-3.1-flash-image";
const GEMINI_INTERACTIONS_URL =
  "https://generativelanguage.googleapis.com/v1beta/interactions";
const GEMINI_IMAGE_TIMEOUT_MS = 90_000;

export const IMAGE_ASPECT_RATIOS = ["9:16", "1:1", "4:5"] as const;

export type ImageAspectRatio = (typeof IMAGE_ASPECT_RATIOS)[number];

type GeneratedImage = {
  imageData: string;
  mimeType: string;
};

const SUPPORTED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export class ImageProviderConfigurationError extends Error {
  constructor() {
    super("Gemini image generation is not configured.");
    this.name = "ImageProviderConfigurationError";
  }
}

export class ImageProviderRequestError extends Error {
  constructor() {
    super("The image generation request is invalid.");
    this.name = "ImageProviderRequestError";
  }
}

export class ImageProviderFailureError extends Error {
  constructor() {
    super("Gemini image generation failed.");
    this.name = "ImageProviderFailureError";
  }
}

export class ImageProviderTimeoutError extends Error {
  constructor() {
    super("Gemini image generation timed out.");
    this.name = "ImageProviderTimeoutError";
  }
}

export class ImageProviderMalformedResponseError extends Error {
  constructor() {
    super("Gemini returned an invalid image response.");
    this.name = "ImageProviderMalformedResponseError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTimeoutError(error: unknown) {
  return (
    isRecord(error) &&
    (error.name === "TimeoutError" || error.name === "AbortError")
  );
}

function normalizeBase64(value: string) {
  const compactValue = value.replace(/\s/g, "");

  if (
    !compactValue ||
    compactValue.length % 4 === 1 ||
    !/^[A-Za-z0-9+/]*={0,2}$/.test(compactValue)
  ) {
    return null;
  }

  const paddingLength = (4 - (compactValue.length % 4)) % 4;
  return compactValue.padEnd(compactValue.length + paddingLength, "=");
}

function extractInlineImage(payload: unknown): GeneratedImage {
  if (!isRecord(payload) || !Array.isArray(payload.steps)) {
    throw new ImageProviderMalformedResponseError();
  }

  if (typeof payload.status === "string" && payload.status !== "completed") {
    throw new ImageProviderFailureError();
  }

  for (const step of payload.steps) {
    if (
      !isRecord(step) ||
      step.type !== "model_output" ||
      !Array.isArray(step.content)
    ) {
      continue;
    }

    for (const content of step.content) {
      if (!isRecord(content) || content.type !== "image") {
        continue;
      }

      const mimeType =
        typeof content.mime_type === "string"
          ? content.mime_type.trim().toLowerCase()
          : "";
      const imageData =
        typeof content.data === "string"
          ? normalizeBase64(content.data)
          : null;

      if (!SUPPORTED_IMAGE_MIME_TYPES.has(mimeType) || !imageData) {
        throw new ImageProviderMalformedResponseError();
      }

      return { imageData, mimeType };
    }
  }

  throw new ImageProviderMalformedResponseError();
}

export function isImageAspectRatio(value: unknown): value is ImageAspectRatio {
  return (
    typeof value === "string" &&
    IMAGE_ASPECT_RATIOS.some((aspectRatio) => aspectRatio === value)
  );
}

export async function generateFashionImage({
  aspectRatio,
  prompt,
}: {
  aspectRatio: ImageAspectRatio;
  prompt: string;
}): Promise<GeneratedImage> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new ImageProviderConfigurationError();
  }

  if (!prompt.trim() || !isImageAspectRatio(aspectRatio)) {
    throw new ImageProviderRequestError();
  }

  let response: Response;

  try {
    response = await fetch(GEMINI_INTERACTIONS_URL, {
      body: JSON.stringify({
        input: prompt,
        model: GEMINI_IMAGE_MODEL,
        response_format: {
          aspect_ratio: aspectRatio,
          image_size: "1K",
          mime_type: "image/jpeg",
          type: "image",
        },
        store: false,
      }),
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      method: "POST",
      signal: AbortSignal.timeout(GEMINI_IMAGE_TIMEOUT_MS),
    });
  } catch (error) {
    if (isTimeoutError(error)) {
      throw new ImageProviderTimeoutError();
    }

    throw new ImageProviderFailureError();
  }

  if (!response.ok) {
    throw new ImageProviderFailureError();
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new ImageProviderMalformedResponseError();
  }

  return extractInlineImage(payload);
}
