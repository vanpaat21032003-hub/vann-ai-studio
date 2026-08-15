import Image from "next/image";

import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

type PreviewAspectRatio = "9:16" | "1:1" | "4:5";

type ImagePreviewPanelProps = {
  aspectRatio: PreviewAspectRatio | null;
  isGenerating: boolean;
  mimeType: string | null;
  onGenerateAgain: () => void;
  previewUrl: string | null;
};

const aspectRatioClasses: Record<PreviewAspectRatio, string> = {
  "9:16": "aspect-[9/16]",
  "1:1": "aspect-square",
  "4:5": "aspect-[4/5]",
};

function getFormatLabel(mimeType: string | null) {
  if (!mimeType) return null;
  return mimeType.replace("image/", "").toUpperCase();
}

export function ImagePreviewPanel({
  aspectRatio,
  isGenerating,
  mimeType,
  onGenerateAgain,
  previewUrl,
}: ImagePreviewPanelProps) {
  const previewAspectClass = aspectRatio
    ? aspectRatioClasses[aspectRatio]
    : "aspect-square";
  const formatLabel = getFormatLabel(mimeType);

  return (
    <Card className="h-fit p-5 sm:p-6 2xl:sticky 2xl:top-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-violet">
            Direct API output
          </p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight text-text-primary">
            Direct API Preview
          </h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Optional preview only. The generated image is not saved to your
            library.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="violet">1 image</Badge>
          <Badge variant="cyan">1K</Badge>
          {aspectRatio ? <Badge>{aspectRatio}</Badge> : null}
          {formatLabel ? <Badge>{formatLabel}</Badge> : null}
        </div>
      </div>

      <div
        aria-live="polite"
        className={`relative mx-auto mt-6 w-full max-w-xl overflow-hidden rounded-card border border-border-soft bg-app/70 ${previewAspectClass}`}
      >
        {isGenerating ? (
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <div>
              <span
                aria-hidden="true"
                className="mx-auto block size-9 animate-spin rounded-full border-2 border-accent-cyan/25 border-t-accent-cyan motion-reduce:animate-none"
              />
              <p className="mt-4 font-semibold text-text-primary">
                Generating your image...
              </p>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                The Direct API is creating one temporary 1K preview.
              </p>
            </div>
          </div>
        ) : previewUrl ? (
          <Image
            alt="AI-generated fashion image preview"
            className="object-contain"
            fill
            sizes="(max-width: 1535px) 100vw, 40vw"
            src={previewUrl}
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <div>
              <p className="font-semibold text-text-primary">
                Your Direct API image preview will appear here.
              </p>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                External generation is available above. To use the optional
                Direct API preview, choose an aspect ratio and generate.
              </p>
            </div>
          </div>
        )}
      </div>

      {previewUrl && !isGenerating ? (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-text-secondary">
            Generate again to replace this temporary preview.
          </p>
          <Button onClick={onGenerateAgain} variant="secondary">
            Generate Again
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
