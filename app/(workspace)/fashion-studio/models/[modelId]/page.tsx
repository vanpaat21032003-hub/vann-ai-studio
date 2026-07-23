import Link from "next/link";
import { notFound } from "next/navigation";

import { ModelArchiveControl } from "@/app/components/models/ModelArchiveControl";
import { Badge } from "@/app/components/ui/Badge";
import { Card } from "@/app/components/ui/Card";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { getOwnedModel } from "@/lib/models/data";
import {
  getModelStatusLabel,
  type ModelStatus,
} from "@/lib/models/schema";

const statusVariants: Record<ModelStatus, "neutral" | "success" | "violet"> = {
  active: "success",
  archived: "neutral",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function MetadataItem({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="min-w-0 rounded-control border border-border-soft bg-surface-soft p-4">
      <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-text-muted">
        {label}
      </dt>
      <dd className="mt-2 break-words text-sm leading-6 text-text-primary">
        {value || "Not added"}
      </dd>
    </div>
  );
}

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ modelId: string }>;
}) {
  const { modelId } = await params;
  const model = await getOwnedModel(modelId);

  if (!model) {
    notFound();
  }

  const heightDisplay =
    model.height != null
      ? `${Math.round(model.height)} cm`
      : null;

  return (
    <div>
      <Link
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-accent-cyan"
        href="/fashion-studio/models"
      >
        <span aria-hidden="true">←</span>
        Model Library
      </Link>

      <PageHeader
        action={
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-control border border-border-strong bg-surface-highlight px-5 py-3 text-sm font-semibold text-text-primary transition hover:border-accent-cyan/40 hover:bg-surface-soft"
            href={`/fashion-studio/models/${model.id}/edit`}
          >
            Edit model
          </Link>
        }
        description="Review the metadata for this reusable AI-character model profile."
        eyebrow="Model detail"
        title={model.name}
      />

      <div className="mt-6">
        <Badge variant={statusVariants[model.status]}>
          {getModelStatusLabel(model.status)}
        </Badge>
      </div>

      <Card className="mt-[var(--space-section)] p-5 sm:p-7">
        <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetadataItem
            label="Gender"
            value={
              model.gender
                ? model.gender.charAt(0).toUpperCase() + model.gender.slice(1)
                : null
            }
          />
          <MetadataItem label="Body type" value={model.body_type} />
          <MetadataItem
            label="Target height"
            value={heightDisplay}
          />
          <MetadataItem label="Style" value={model.style} />
          <MetadataItem label="Pose" value={model.pose} />
          <MetadataItem label="Created" value={formatDate(model.created_at)} />
        </dl>

        {model.tags.length > 0 ? (
          <div className="mt-4 rounded-control border border-border-soft bg-surface-soft p-4">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-text-muted">
              Tags
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {model.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-accent-cyan/20 bg-accent-cyan/10 px-3 py-1 text-xs font-medium text-cyan-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-control border border-border-soft bg-surface-soft p-4">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-text-muted">
              Tags
            </p>
            <p className="mt-2 text-sm text-text-primary">Not added</p>
          </div>
        )}

        <p className="mt-5 text-xs text-text-muted">
          Last updated {formatDate(model.updated_at)}
        </p>
      </Card>

      {/* Archive / restore */}
      <section
        aria-label="Archive or restore model"
        className="mt-8 rounded-card border border-border-soft bg-surface-elevated p-5 shadow-card sm:p-6"
      >
        <h2 className="text-base font-semibold text-text-primary">
          {model.status === "archived" ? "Restore model" : "Archive model"}
        </h2>
        <div className="mt-3">
          <ModelArchiveControl modelId={model.id} status={model.status} />
        </div>
      </section>
    </div>
  );
}
