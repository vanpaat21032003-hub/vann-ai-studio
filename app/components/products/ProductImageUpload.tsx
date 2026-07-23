"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";

import { Button } from "@/app/components/ui/Button";
import {
  completeProductImageUpload,
  createProductImageUploadIntent,
  discardProductImageUpload,
} from "@/lib/products/image-actions";
import {
  PRODUCT_IMAGE_ACCEPT,
  PRODUCT_IMAGE_BUCKET,
  validateProductImageMetadata,
} from "@/lib/products/image-constants";
import { createClient } from "@/lib/supabase/client";

type ProductImageUploadProps = {
  productId: string;
};

const SAFE_UPLOAD_ERROR = "Unable to upload this image. Please try again.";

export function ProductImageUpload({ productId }: ProductImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const file = inputRef.current?.files?.[0];

    if (!file) {
      setError("Choose an image to upload.");
      setMessage(null);
      return;
    }

    const validationError = validateProductImageMetadata({
      mimeType: file.type,
      size: file.size,
    });

    if (validationError) {
      setError(validationError);
      setMessage(null);
      return;
    }

    setError(null);
    setMessage("Preparing secure upload…");

    startTransition(async () => {
      let uploadedPath: string | null = null;

      try {
        const intent = await createProductImageUploadIntent(productId, {
          mimeType: file.type,
          size: file.size,
        });

        if (!intent.success) {
          setError(intent.error);
          setMessage(null);
          return;
        }

        uploadedPath = intent.path;
        setMessage("Uploading private image…");

        const supabase = createClient();
        const { error: uploadError } = await supabase.storage
          .from(PRODUCT_IMAGE_BUCKET)
          .upload(intent.path, file, {
            cacheControl: "3600",
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) {
          await discardProductImageUpload(productId, intent.path);
          uploadedPath = null;
          setError(SAFE_UPLOAD_ERROR);
          setMessage(null);
          return;
        }

        setMessage("Saving private image metadata…");
        const result = await completeProductImageUpload(productId, intent.path);

        if (!result.success) {
          await discardProductImageUpload(productId, intent.path);
          setError(result.error);
          setMessage(null);
          return;
        }

        uploadedPath = null;
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        setError(null);
        setMessage("Image uploaded securely.");
      } catch {
        if (uploadedPath) {
          try {
            await discardProductImageUpload(productId, uploadedPath);
          } catch {
            // Cleanup is best effort; the UI never exposes internal failures.
          }
        }

        setError(SAFE_UPLOAD_ERROR);
        setMessage(null);
      }
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          className="mb-2 block text-sm font-medium text-text-primary"
          htmlFor={`product-image-${productId}`}
        >
          Add source image
        </label>
        <input
          accept={PRODUCT_IMAGE_ACCEPT}
          aria-describedby={`product-image-help-${productId} product-image-status-${productId}`}
          className="block min-h-12 w-full min-w-0 cursor-pointer rounded-control border border-border-soft bg-app/70 text-sm text-text-secondary file:mr-4 file:min-h-12 file:cursor-pointer file:border-0 file:border-r file:border-border-soft file:bg-surface-highlight file:px-4 file:font-semibold file:text-text-primary hover:border-border-strong focus:border-accent-cyan/60 focus:ring-2 focus:ring-accent-cyan/15 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          id={`product-image-${productId}`}
          onChange={() => {
            setError(null);
            setMessage(null);
          }}
          ref={inputRef}
          type="file"
        />
        <p
          className="mt-2 text-xs leading-5 text-text-muted"
          id={`product-image-help-${productId}`}
        >
          JPEG, PNG, or WebP. Maximum 8 MB. Images remain private.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button disabled={isPending} size="sm" type="submit">
          {isPending ? "Uploading…" : "Upload image"}
        </Button>
        <p
          aria-live="polite"
          className={`min-h-5 min-w-0 break-words text-sm ${
            error ? "text-accent-danger" : "text-text-secondary"
          }`}
          id={`product-image-status-${productId}`}
          role={error ? "alert" : "status"}
        >
          {error ?? message}
        </p>
      </div>
    </form>
  );
}
