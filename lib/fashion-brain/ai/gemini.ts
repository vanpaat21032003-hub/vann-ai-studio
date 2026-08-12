import "server-only";

const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_REQUEST_TIMEOUT_MS = 20_000;
const GEMINI_GENERATE_CONTENT_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_INSTRUCTION = `You are the prompt enhancement engine for a fashion product image workflow.

The supplied prompt contains source-of-truth product, model, style, and creative instructions.

Your job is to improve the prompt for high-quality fashion image generation.

You may improve:
- instruction clarity
- visual coherence
- composition
- camera language
- lighting language
- realism
- presentation quality
- product-fidelity emphasis

You MUST preserve every supplied factual attribute and instruction.

Never invent, remove, contradict, or alter known facts, including:
- product title/category
- gender
- brand
- color
- material
- product notes
- model identity/attributes
- selected style facts
- selected preset intent

Do not invent logos, patterns, materials, colors, branding, garment details, or product features that were not supplied.

Generic photographic improvements are allowed only when they do not contradict supplied facts.

Return only the enhanced image-generation prompt.
Do not explain your changes.
Do not add commentary.
Do not wrap the result in markdown or code fences.

Keep the output's primary language aligned with the supplied prompt.`;

export class GeminiConfigurationError extends Error {
  constructor() {
    super("Gemini is not configured.");
    this.name = "GeminiConfigurationError";
  }
}

class GeminiProviderError extends Error {
  constructor() {
    super("Gemini prompt enhancement failed.");
    this.name = "GeminiProviderError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractText(payload: unknown) {
  if (!isRecord(payload) || !Array.isArray(payload.candidates)) {
    return null;
  }

  for (const candidate of payload.candidates) {
    if (!isRecord(candidate) || !isRecord(candidate.content) || !Array.isArray(candidate.content.parts)) {
      continue;
    }

    const textParts: string[] = [];

    for (const part of candidate.content.parts) {
      if (isRecord(part) && typeof part.text === "string" && part.text.trim()) {
        textParts.push(part.text);
      }
    }

    const text = textParts.join("\n").trim();

    if (text) {
      return text;
    }
  }

  return null;
}

export async function enhanceFashionPrompt(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new GeminiConfigurationError();
  }

  let response: Response;

  try {
    response = await fetch(GEMINI_GENERATE_CONTENT_URL, {
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
            role: "user",
          },
        ],
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
      }),
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      method: "POST",
      signal: AbortSignal.timeout(GEMINI_REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new GeminiProviderError();
  }

  if (!response.ok) {
    throw new GeminiProviderError();
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new GeminiProviderError();
  }

  const enhancedPrompt = extractText(payload);

  if (!enhancedPrompt) {
    throw new GeminiProviderError();
  }

  return enhancedPrompt;
}
