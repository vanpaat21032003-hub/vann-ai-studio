import { AppIcon } from "@/app/components/ui/AppIcon";
import { Card } from "@/app/components/ui/Card";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { PageHeader } from "@/app/components/ui/PageHeader";

export default function FashionBrainPage() {
  return (
    <div>
      <PageHeader
        description="Develop creative direction and product insights."
        eyebrow="Creative intelligence"
        title="Fashion Brain"
      />
      <Card className="mt-[var(--space-section)]">
        <EmptyState
          description="Product analysis and structured creative direction are planned for a later approved sprint. No provider or database activity runs on this page."
          icon={<AppIcon className="size-5" name="brain" />}
          title="Intelligence workspace prepared"
        />
      </Card>
    </div>
  );
}
