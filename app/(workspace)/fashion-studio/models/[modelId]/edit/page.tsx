import Link from "next/link";
import { notFound } from "next/navigation";

import { ModelForm } from "@/app/components/models/ModelForm";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { getOwnedModel } from "@/lib/models/data";
import type { ModelEditableRecord } from "@/lib/models/schema";

export default async function EditModelPage({
  params,
}: {
  params: Promise<{ modelId: string }>;
}) {
  const { modelId } = await params;
  const model = await getOwnedModel(modelId);

  if (!model) {
    notFound();
  }

  const editableModel: ModelEditableRecord = {
    id: model.id,
    name: model.name,
    gender: model.gender,
    body_type: model.body_type,
    height: model.height,
    style: model.style,
    pose: model.pose,
    tags: model.tags,
  };

  return (
    <div>
      <Link
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-accent-cyan"
        href={`/fashion-studio/models/${model.id}`}
      >
        <span aria-hidden="true">←</span>
        Model detail
      </Link>
      <PageHeader
        description="Update model metadata. Height default updates with gender until you manually edit it."
        eyebrow="Model Library"
        title="Edit model"
      />
      <ModelForm mode="edit" model={editableModel} />
    </div>
  );
}
