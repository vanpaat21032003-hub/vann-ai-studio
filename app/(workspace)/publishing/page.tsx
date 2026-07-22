import { AppIcon } from "@/app/components/ui/AppIcon";
import { Card } from "@/app/components/ui/Card";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { PageHeader } from "@/app/components/ui/PageHeader";

export default function PublishingPage() {
  return (
    <div>
      <PageHeader
        description="Prepare affiliate content for publishing channels."
        eyebrow="Publishing workspace"
        title="Publishing"
      />
      <Card className="mt-[var(--space-section)]">
        <EmptyState
          description="Caption, CTA, hashtag, and channel checklists will be added in a later approved sprint. Nothing is published automatically."
          icon={<AppIcon className="size-5" name="publishing" />}
          title="Publishing preparation is ready to grow"
        />
      </Card>
    </div>
  );
}
