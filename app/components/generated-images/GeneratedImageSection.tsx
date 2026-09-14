import { unstable_rethrow } from "next/navigation";
import { GeneratedImageGallery } from "./GeneratedImageGallery";
import { getOwnedGeneratedImages } from "@/lib/generated-images/data";

export function GeneratedImageLoading() {
  return <p role="status" className="rounded-control border border-border-soft p-5 text-sm text-text-secondary">Loading private generated images…</p>;
}

export async function GeneratedImageSection({ projectId, page }: { projectId: string; page: number }) {
  let gallery;
  try {
    gallery = await getOwnedGeneratedImages(projectId, page);
  } catch (error) {
    unstable_rethrow(error);
    return <GeneratedImageGallery images={[]} page={page} hasMore={false} projectId={projectId} unavailable />;
  }
  return <GeneratedImageGallery {...gallery} page={page} projectId={projectId} />;
}
