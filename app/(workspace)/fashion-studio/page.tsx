import { AppIcon } from "@/app/components/ui/AppIcon";
import { Card } from "@/app/components/ui/Card";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { PageHeader } from "@/app/components/ui/PageHeader";

export default function FashionStudioPage() {
  return (
    <div>
      <PageHeader
        description="Create and organize fashion assets for affiliate content."
        eyebrow="Creative workspace"
        title="Fashion Studio"
      />
      <Card className="mt-[var(--space-section)]">
        <EmptyState
          description="The guided fashion workflow will be introduced in a later approved sprint. This workspace is ready for product, model, and style composition."
          icon={<AppIcon className="size-5" name="studio" />}
          title="Creative canvas coming next"
        />
      </Card>
    </div>
  );
}
