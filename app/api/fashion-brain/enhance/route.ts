import { enhanceFashionPrompt, GeminiConfigurationError } from "@/lib/fashion-brain/ai/gemini";
import { createClient } from "@/lib/supabase/server";

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

async function isAuthenticated() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    const subject = data?.claims?.sub;

    return !error && typeof subject === "string" && subject.trim().length > 0;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid prompt." }, 400);
  }

  if (!isRecord(body) || typeof body.prompt !== "string") {
    return jsonResponse({ error: "Invalid prompt." }, 400);
  }

  const prompt = body.prompt.trim();

  if (!prompt || prompt.length > MAX_PROMPT_LENGTH) {
    return jsonResponse({ error: "Invalid prompt." }, 400);
  }

  try {
    const enhancedPrompt = await enhanceFashionPrompt(prompt);
    return jsonResponse({ enhancedPrompt }, 200);
  } catch (error) {
    if (error instanceof GeminiConfigurationError) {
      return jsonResponse({ error: "AI enhancement is not configured." }, 503);
    }

    return jsonResponse({ error: "Prompt enhancement is temporarily unavailable." }, 502);
  }
}
