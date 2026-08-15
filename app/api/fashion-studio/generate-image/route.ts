import {
  generateFashionImage,
  ImageProviderConfigurationError,
  isImageAspectRatio,
} from "@/lib/fashion-studio/ai/image-provider";
import { hasAuthenticatedSession } from "@/lib/supabase/auth";

const MAX_PROMPT_LENGTH = 20_000;
const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
};

function jsonResponse(body: Record<string, string>, status: number) {
  return Response.json(body, {
    headers: NO_STORE_HEADERS,
    status,
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function POST(request: Request) {
  if (!(await hasAuthenticatedSession())) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid image generation request." }, 400);
  }

  if (
    !isRecord(body) ||
    typeof body.prompt !== "string" ||
    !isImageAspectRatio(body.aspectRatio)
  ) {
    return jsonResponse({ error: "Invalid image generation request." }, 400);
  }

  const prompt = body.prompt.trim();

  if (!prompt || prompt.length > MAX_PROMPT_LENGTH) {
    return jsonResponse({ error: "Invalid image generation request." }, 400);
  }

  try {
    const image = await generateFashionImage({
      aspectRatio: body.aspectRatio,
      prompt,
    });

    return jsonResponse(image, 200);
  } catch (error) {
    if (error instanceof ImageProviderConfigurationError) {
      return jsonResponse(
        { error: "Gemini image generation is not configured." },
        503,
      );
    }

    return jsonResponse(
      { error: "Image generation is temporarily unavailable." },
      502,
    );
  }
}
