import { AppIcon } from "@/app/components/ui/AppIcon";
import { Card } from "@/app/components/ui/Card";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { PageHeader } from "@/app/components/ui/PageHeader";

export default function MotionStudioPage() {
  return (
    <div>
      <PageHeader
        description="Turn fashion content into motion-ready creative assets."
        eyebrow="Motion workspace"
        title="Motion Studio"
      />
      <Card className="mt-[var(--space-section)]">
        <EmptyState
          description="Motion prompts, reference assets, and video preparation will arrive in a later approved sprint. No generation runs from this placeholder."
          icon={<AppIcon className="size-5" name="motion" />}
          title="Motion workflow not started"
        />
      </Card>
    </div>
  );
}
