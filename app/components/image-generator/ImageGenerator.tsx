"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ImagePreviewPanel } from "@/app/components/image-generator/ImagePreviewPanel";
import { PromptCopyButton } from "@/app/components/prompt-presets/PromptCopyButton";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import type { ModelRecord } from "@/lib/models/schema";
import type { ProductRecord } from "@/lib/products/schema";
import { composePrompt } from "@/lib/prompt-composer/compose";
import type { PromptPresetRecord } from "@/lib/prompt-presets/schema";
import type { StyleRecord } from "@/lib/styles/schema";

type ImageGeneratorProps = {
  models: ModelRecord[];
  presets: PromptPresetRecord[];
  products: ProductRecord[];
  styles: StyleRecord[];
};

type AspectRatio = "9:16" | "1:1" | "4:5";
type PromptVariant = "final" | "enhanced";
type EnhancementState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; prompt: string }
  | { status: "error" };
type PreviewState = {
  mimeType: string;
  url: string;
};

const MAX_PROMPT_LENGTH = 20_000;
const ASPECT_RATIOS: Array<{
  description: string;
  label: string;
  value: AspectRatio;
}> = [
  { description: "Vertical story", label: "9:16", value: "9:16" },
  { description: "Square", label: "1:1", value: "1:1" },
  { description: "Portrait feed", label: "4:5", value: "4:5" },
];
const SAFE_ENHANCEMENT_ERROR =
  "Prompt enhancement is temporarily unavailable. Your final prompt is unchanged.";
const selectClassName =
  "min-h-12 w-full appearance-none rounded-control border border-border-soft bg-app/70 py-3 pr-14 pl-4 text-sm text-text-primary shadow-inner shadow-black/10 transition duration-[var(--transition-fast)] hover:border-border-strong focus:border-accent-cyan/60 focus:ring-2 focus:ring-accent-cyan/15 disabled:cursor-not-allowed disabled:opacity-60";
const SUPPORTED_PREVIEW_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getGenerationError(status: number) {
  if (status === 401) {
    return "Your session has expired. Sign in again before generating an image.";
  }

  if (status === 503) {
    return "Gemini image generation is not configured.";
  }

  if (status === 400) {
    return "The selected prompt or aspect ratio is invalid. Review the settings and try again.";
  }

  return "Image generation is temporarily unavailable. Try again in a moment.";
}

function imageDataToBlob(imageData: string, mimeType: string) {
  const binary = window.atob(imageData.replace(/\s/g, ""));
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mimeType });
}

function SelectField({
  disabled,
  emptyHref,
  emptyLabel,
  id,
  label,
  onChange,
  options,
  placeholder,
  value,
}: {
  disabled: boolean;
  emptyHref: string;
  emptyLabel: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  options: Array<{ id: string; name: string }>;
  placeholder: string;
  value: string;
}) {
  const isEmpty = options.length === 0;

  return (
    <div>
      <label
        className="mb-2 block text-sm font-semibold text-text-primary"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">
        <select
          className={selectClassName}
          disabled={disabled || isEmpty}
          id={id}
          onChange={(event) => onChange(event.target.value)}
          value={value}
        >
          <option value="">
            {isEmpty ? `No ${label.toLowerCase()} available` : placeholder}
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-5 size-4 -translate-y-1/2 text-text-muted"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="m8 10 4 4 4-4"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      </div>
      {isEmpty ? (
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Add one in the{" "}
          <Link
            className="font-medium text-accent-cyan hover:underline"
            href={emptyHref}
          >
            {emptyLabel}
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}

export function ImageGenerator({
  models,
  presets,
  products,
  styles,
}: ImageGeneratorProps) {
  const [productId, setProductId] = useState("");
  const [modelId, setModelId] = useState("");
  const [styleId, setStyleId] = useState("");
  const [presetId, setPresetId] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio | "">("");
  const [promptVariant, setPromptVariant] =
    useState<PromptVariant>("final");
  const [enhancement, setEnhancement] = useState<EnhancementState>({
    status: "idle",
  });
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const enhancementAbortRef = useRef<AbortController | null>(null);
  const generationAbortRef = useRef<AbortController | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const product = products.find((record) => record.id === productId);
  const model = models.find((record) => record.id === modelId);
  const style = styles.find((record) => record.id === styleId);
  const preset = presets.find((record) => record.id === presetId);
  const finalPrompt = useMemo(
    () =>
      product && model && style && preset
        ? composePrompt({ product, model, style, preset })
        : null,
    [model, preset, product, style],
  );
  const enhancedPrompt =
    enhancement.status === "success" ? enhancement.prompt : null;
  const selectedPrompt =
    promptVariant === "enhanced" ? enhancedPrompt : finalPrompt;
  const isEnhancing = enhancement.status === "loading";
  const hasRequiredSelections = Boolean(
    product && model && style && preset && aspectRatio,
  );
  const canGenerate = Boolean(
    hasRequiredSelections &&
      selectedPrompt &&
      selectedPrompt.length <= MAX_PROMPT_LENGTH &&
      !isGenerating,
  );

  const revokePreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setPreview(null);
  }, []);

  useEffect(() => {
    return () => {
      enhancementAbortRef.current?.abort();
      generationAbortRef.current?.abort();

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  function resetCompositionOutput() {
    enhancementAbortRef.current?.abort();
    enhancementAbortRef.current = null;
    setEnhancement({ status: "idle" });
    setPromptVariant("final");
    setGenerationError(null);
    setCopyMessage(null);
    revokePreview();
  }

  function changeCompositionSelection(
    setter: (value: string) => void,
    value: string,
  ) {
    resetCompositionOutput();
    setter(value);
  }

  function changeAspectRatio(value: AspectRatio) {
    setAspectRatio(value);
    setGenerationError(null);
    revokePreview();
  }

  function changePromptVariant(value: PromptVariant) {
    if (value === "enhanced" && !enhancedPrompt) return;
    setPromptVariant(value);
    setCopyMessage(null);
    setGenerationError(null);
    revokePreview();
  }

  async function copySelectedPrompt() {
    if (!selectedPrompt) return;

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }

      await navigator.clipboard.writeText(selectedPrompt);
      setCopyMessage("Prompt copied.");
    } catch {
      setCopyMessage("Unable to copy the prompt. Please copy it manually.");
    }
  }

  async function enhancePrompt() {
    if (!finalPrompt || enhancementAbortRef.current || isGenerating) return;

    if (promptVariant === "enhanced") {
      setPromptVariant("final");
      revokePreview();
    }

    const controller = new AbortController();
    enhancementAbortRef.current = controller;
    setGenerationError(null);
    setEnhancement({ status: "loading" });

    try {
      const response = await fetch("/api/fashion-brain/enhance", {
        body: JSON.stringify({ prompt: finalPrompt }),
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Prompt enhancement request failed.");
      }

      const body: unknown = await response.json();
      const prompt =
        isRecord(body) && typeof body.enhancedPrompt === "string"
          ? body.enhancedPrompt.trim()
          : "";

      if (!prompt || prompt.length > MAX_PROMPT_LENGTH) {
        throw new Error("Prompt enhancement response was invalid.");
      }

      if (enhancementAbortRef.current === controller) {
        setEnhancement({ prompt, status: "success" });
      }
    } catch {
      if (enhancementAbortRef.current === controller) {
        setEnhancement({ status: "error" });
      }
    } finally {
      if (enhancementAbortRef.current === controller) {
        enhancementAbortRef.current = null;
      }
    }
  }

  async function generateImage() {
    if (
      !canGenerate ||
      !selectedPrompt ||
      !aspectRatio ||
      generationAbortRef.current
    ) {
      return;
    }

    const controller = new AbortController();
    generationAbortRef.current = controller;
    revokePreview();
    setGenerationError(null);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/fashion-studio/generate-image", {
        body: JSON.stringify({
          aspectRatio,
          prompt: selectedPrompt,
        }),
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        signal: controller.signal,
      });

      if (!response.ok) {
        if (generationAbortRef.current === controller) {
          setGenerationError(getGenerationError(response.status));
        }
        return;
      }

      const body: unknown = await response.json();
      const imageData =
        isRecord(body) && typeof body.imageData === "string"
          ? body.imageData.trim()
          : "";
      const mimeType =
        isRecord(body) && typeof body.mimeType === "string"
          ? body.mimeType.trim().toLowerCase()
          : "";

      if (!imageData || !SUPPORTED_PREVIEW_MIME_TYPES.has(mimeType)) {
        throw new Error("Image generation response was invalid.");
      }

      const blob = imageDataToBlob(imageData, mimeType);
      const url = URL.createObjectURL(blob);

      if (generationAbortRef.current !== controller) {
        URL.revokeObjectURL(url);
        return;
      }

      previewUrlRef.current = url;
      setPreview({ mimeType, url });
    } catch {
      if (generationAbortRef.current === controller) {
        setGenerationError(
          "Image generation is temporarily unavailable. Try again in a moment.",
        );
      }
    } finally {
      if (generationAbortRef.current === controller) {
        generationAbortRef.current = null;
        setIsGenerating(false);
      }
    }
  }

  const missingSelections = [
    !product && "product",
    !model && "model",
    !style && "style",
    !preset && "prompt preset",
    !aspectRatio && "aspect ratio",
  ].filter((value): value is string => Boolean(value));

  return (
    <div className="mt-[var(--space-section)] grid gap-6 2xl:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
      <div className="grid gap-6">
        <Card className="p-5 sm:p-6">
          <SectionHeading
            description="Only owned, available library records are shown. Archived products and inactive catalog records are excluded."
            title="1. Select creative direction"
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <SelectField
              disabled={isGenerating}
              emptyHref="/fashion-studio/products"
              emptyLabel="Product Library"
              id="generator-product"
              label="Product"
              onChange={(value) =>
                changeCompositionSelection(setProductId, value)
              }
              options={products.map((record) => ({
                id: record.id,
                name: record.title,
              }))}
              placeholder="Select a product"
              value={productId}
            />
            <SelectField
              disabled={isGenerating}
              emptyHref="/fashion-studio/models"
              emptyLabel="Model Library"
              id="generator-model"
              label="Model"
              onChange={(value) =>
                changeCompositionSelection(setModelId, value)
              }
              options={models.map((record) => ({
                id: record.id,
                name: record.name,
              }))}
              placeholder="Select a model"
              value={modelId}
            />
            <SelectField
              disabled={isGenerating}
              emptyHref="/fashion-studio/styles"
              emptyLabel="Style Library"
              id="generator-style"
              label="Style"
              onChange={(value) =>
                changeCompositionSelection(setStyleId, value)
              }
              options={styles.map((record) => ({
                id: record.id,
                name: record.name,
              }))}
              placeholder="Select a style"
              value={styleId}
            />
            <SelectField
              disabled={isGenerating}
              emptyHref="/fashion-brain/presets"
              emptyLabel="Prompt Presets Library"
              id="generator-preset"
              label="Prompt preset"
              onChange={(value) =>
                changeCompositionSelection(setPresetId, value)
              }
              options={presets.map((record) => ({
                id: record.id,
                name: record.title,
              }))}
              placeholder="Select a prompt preset"
              value={presetId}
            />
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <SectionHeading
            action={
              finalPrompt ? (
                <PromptCopyButton key={finalPrompt} prompt={finalPrompt} />
              ) : undefined
            }
            description="This source-of-truth output is composed deterministically and never changes when AI enhancement runs."
            title="2. Review Final Prompt"
          />
          {finalPrompt ? (
            <pre className="mt-6 max-h-[28rem] max-w-full overflow-auto whitespace-pre-wrap break-words rounded-control border border-border-soft bg-app/70 p-4 font-sans text-sm leading-6 text-text-primary">
              {finalPrompt}
            </pre>
          ) : (
            <div className="mt-6 rounded-control border border-dashed border-border-strong bg-surface-soft p-5">
              <p className="font-semibold text-text-primary">
                Your deterministic prompt will appear here.
              </p>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Select a product, model, style, and prompt preset to compose it.
              </p>
            </div>
          )}

          <div className="mt-6 border-t border-border-soft pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-violet">
                  Optional
                </p>
                <h3 className="mt-2 font-semibold tracking-tight text-text-primary">
                  AI Enhanced Prompt
                </h3>
                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  Refine the wording while preserving the Final Prompt above.
                </p>
              </div>
              <Button
                disabled={!finalPrompt || isEnhancing || isGenerating}
                onClick={enhancePrompt}
                size="sm"
                type="button"
                variant="secondary"
              >
                {isEnhancing
                  ? "Enhancing..."
                  : enhancedPrompt
                    ? "Enhance Again"
                    : "Enhance with AI"}
              </Button>
            </div>

            {enhancement.status === "error" ? (
              <p
                aria-live="polite"
                className="mt-4 text-sm text-accent-danger"
                role="alert"
              >
                {SAFE_ENHANCEMENT_ERROR}
              </p>
            ) : null}

            {enhancedPrompt ? (
              <div className="mt-5 rounded-control border border-accent-violet/25 bg-surface-soft p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <Badge variant="violet">AI enhanced</Badge>
                  <PromptCopyButton
                    key={enhancedPrompt}
                    label="Copy Enhanced Prompt"
                    prompt={enhancedPrompt}
                  />
                </div>
                <pre className="mt-4 max-h-[28rem] max-w-full overflow-auto whitespace-pre-wrap break-words font-sans text-sm leading-6 text-text-primary">
                  {enhancedPrompt}
                </pre>
              </div>
            ) : null}
          </div>
        </Card>

        <Card className="border-accent-cyan/30 p-5 sm:p-6">
          <SectionHeading
            description="Copy your selected prompt and generate in the image tool you prefer. This is the recommended V1 workflow."
            title="3. External Generation"
          />

          <fieldset className="mt-6" disabled={!finalPrompt || isGenerating}>
            <legend className="text-sm font-semibold text-text-primary">
              Prompt version
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="cursor-pointer">
                <input
                  checked={promptVariant === "final"}
                  className="peer sr-only"
                  name="prompt-variant"
                  onChange={() => changePromptVariant("final")}
                  type="radio"
                  value="final"
                />
                <span className="block rounded-control border border-border-soft bg-app/70 p-4 transition peer-checked:border-accent-cyan/60 peer-checked:bg-accent-cyan/10 peer-focus-visible:ring-2 peer-focus-visible:ring-accent-cyan/40">
                  <span className="font-semibold text-text-primary">
                    Final Prompt
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-text-secondary">
                    Deterministic source-of-truth version.
                  </span>
                </span>
              </label>
              <label
                className={
                  enhancedPrompt
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-55"
                }
              >
                <input
                  checked={promptVariant === "enhanced"}
                  className="peer sr-only"
                  disabled={!enhancedPrompt}
                  name="prompt-variant"
                  onChange={() => changePromptVariant("enhanced")}
                  type="radio"
                  value="enhanced"
                />
                <span className="block rounded-control border border-border-soft bg-app/70 p-4 transition peer-checked:border-accent-violet/60 peer-checked:bg-accent-violet/10 peer-focus-visible:ring-2 peer-focus-visible:ring-accent-violet/40">
                  <span className="font-semibold text-text-primary">
                    Enhanced Prompt
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-text-secondary">
                    {enhancedPrompt
                      ? "AI-refined version available for selection."
                      : "Run AI enhancement to unlock this version."}
                  </span>
                </span>
              </label>
            </div>
          </fieldset>

          <div className="mt-6 rounded-control border border-accent-cyan/25 bg-accent-cyan/5 p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-cyan">
              Primary / Recommended for V1
            </p>
            <h3 className="mt-2 font-semibold tracking-tight text-text-primary">
              Copy the selected prompt
            </h3>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-6 text-text-secondary">
              <li>Copy the selected prompt.</li>
              <li>Open your preferred external image-generation tool.</li>
              <li>Generate the image externally.</li>
              <li>
                Return to Vann AI Studio when generated-asset upload is
                available.
              </li>
            </ol>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {selectedPrompt
                    ? `${promptVariant === "enhanced" ? "Enhanced" : "Final"} Prompt selected.`
                    : "Choose a prompt version to copy."}
                </p>
                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  Generated asset upload will be connected through the
                  generated-image workflow.
                </p>
              </div>
              <Button
                disabled={!selectedPrompt}
                onClick={copySelectedPrompt}
                type="button"
              >
                Copy Prompt
              </Button>
            </div>
            {copyMessage ? (
              <p
                aria-live="polite"
                className={
                  copyMessage === "Prompt copied."
                    ? "mt-3 text-sm text-accent-success"
                    : "mt-3 text-sm text-accent-danger"
                }
                role="status"
              >
                {copyMessage}
              </p>
            ) : null}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <SectionHeading
            description="Optional. Provider API access and quota or billing may be required. If it is unavailable, external generation remains available."
            title="4. Direct API Generation"
          />

          <fieldset className="mt-6" disabled={isGenerating}>
            <legend className="text-sm font-semibold text-text-primary">
              Aspect ratio
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {ASPECT_RATIOS.map((option) => (
                <label className="cursor-pointer" key={option.value}>
                  <input
                    checked={aspectRatio === option.value}
                    className="peer sr-only"
                    name="aspect-ratio"
                    onChange={() => changeAspectRatio(option.value)}
                    type="radio"
                    value={option.value}
                  />
                  <span className="block rounded-control border border-border-soft bg-app/70 p-4 text-center transition peer-checked:border-accent-cyan/60 peer-checked:bg-accent-cyan/10 peer-focus-visible:ring-2 peer-focus-visible:ring-accent-cyan/40">
                    <span className="font-semibold text-text-primary">
                      {option.label}
                    </span>
                    <span className="mt-1 block text-xs text-text-secondary">
                      {option.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {generationError ? (
            <p
              aria-live="polite"
              className="mt-5 rounded-control border border-red-400/25 bg-red-400/10 p-4 text-sm leading-6 text-accent-danger"
              role="alert"
            >
              {generationError}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-text-secondary">
              {missingSelections.length > 0
                ? `Still required: ${missingSelections.join(", ")}.`
                : `${promptVariant === "enhanced" ? "Enhanced" : "Final"} Prompt selected at ${aspectRatio}.`}
            </p>
            <Button
              disabled={!canGenerate}
              onClick={generateImage}
              type="button"
            >
              {isGenerating ? "Generating Image..." : "Generate Image"}
            </Button>
          </div>
        </Card>
      </div>

      <ImagePreviewPanel
        aspectRatio={aspectRatio || null}
        isGenerating={isGenerating}
        mimeType={preview?.mimeType ?? null}
        onGenerateAgain={generateImage}
        previewUrl={preview?.url ?? null}
      />
    </div>
  );
}
