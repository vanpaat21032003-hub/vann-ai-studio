import { AppIcon } from "@/app/components/ui/AppIcon";
import { Card } from "@/app/components/ui/Card";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { PageHeader } from "@/app/components/ui/PageHeader";

export default function ResearchPage() {
  return (
    <div>
      <PageHeader
        description="Explore a focused research workspace for Indonesian stocks."
        eyebrow="Market research"
        title="Research"
      />
      <Card className="mt-[var(--space-section)]">
        <EmptyState
          description="The first research domain is reserved for Indonesian stocks and remains deferred. No external source or market data is queried here."
          icon={<AppIcon className="size-5" name="research" />}
          title="Research tools are deferred"
        />
      </Card>
    </div>
  );
}
