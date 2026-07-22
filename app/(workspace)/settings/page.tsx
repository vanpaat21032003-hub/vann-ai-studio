import { AppIcon } from "@/app/components/ui/AppIcon";
import { Card } from "@/app/components/ui/Card";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { PageHeader } from "@/app/components/ui/PageHeader";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        description="Manage future workspace preferences and integrations."
        eyebrow="Workspace controls"
        title="Settings"
      />
      <Card className="mt-[var(--space-section)]">
        <EmptyState
          description="Preference and integration controls will be added only when their behavior and security boundaries are approved."
          icon={<AppIcon className="size-5" name="settings" />}
          title="No settings to configure yet"
        />
      </Card>
    </div>
  );
}
