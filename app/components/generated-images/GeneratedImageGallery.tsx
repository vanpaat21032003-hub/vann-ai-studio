"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { EmptyState } from "@/app/components/ui/EmptyState";
import type { GeneratedImagePreview } from "@/lib/generated-images/schema";

function Preview({ image }: { image: GeneratedImagePreview }) {
  const [failed, setFailed] = useState(false);
  return (
    <Card className="min-w-0">
      <div className="flex aspect-square items-center justify-center overflow-hidden bg-app/70">
        {!image.signedUrl || failed ? (
          <p className="p-4 text-center text-sm text-text-secondary">Preview unavailable or expired. Refresh previews to retry.</p>
        ) : (
          // Native images preserve the existing private-preview pattern without an image proxy or shared optimization cache.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.signedUrl} alt="Project generated image" width={600} height={600} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} className="h-full w-full object-contain" />
        )}
      </div>
      <div className="space-y-2 p-4 text-sm">
        <p>{image.aspect_ratio} · External upload</p>
        {image.provider ? <p className="break-words text-text-secondary">{image.provider}</p> : null}
        <p className="text-xs text-text-muted">{new Date(image.created_at).toISOString().slice(0, 10)}</p>
        <details>
          <summary className="cursor-pointer text-accent-cyan">Prompt snapshot</summary>
          <p className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words text-text-secondary">{image.prompt_snapshot}</p>
        </details>
      </div>
    </Card>
  );
}

export function GeneratedImageGallery({ images, page, hasMore, projectId, unavailable = false }: {
  images: GeneratedImagePreview[]; page: number; hasMore: boolean; projectId: string; unavailable?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const href = (nextPage: number) => `/fashion-studio/projects/${projectId}?assetPage=${nextPage}#generated-images`;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-text-muted">Private previews expire after about 5 minutes.</p>
        <Button disabled={pending} size="sm" variant="secondary" onClick={() => startTransition(() => router.refresh())}>{pending ? "Refreshing…" : "Refresh previews"}</Button>
      </div>
      {unavailable ? (
        <Card><EmptyState title="Generated images unavailable" description="The gallery could not be loaded. Your saved assets have not been changed. Refresh to retry." /></Card>
      ) : images.length === 0 ? (
        <Card><EmptyState title={page === 1 ? "No generated images yet" : "No images on this page"} description="Upload an external result to keep its file and prompt together in this project." /></Card>
      ) : (
        <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image) => <Preview key={`${image.id}:${image.signedUrl ?? "unavailable"}`} image={image} />)}
        </div>
      )}
      <nav aria-label="Generated image pages" className="flex items-center gap-5 text-sm text-accent-cyan">
        {page > 1 ? <Link href={href(page - 1)}>Previous page</Link> : null}
        <span className="text-text-muted">Page {page}</span>
        {hasMore ? <Link href={href(page + 1)}>Next page</Link> : null}
      </nav>
    </div>
  );
}
