import Link from "next/link";

import { AppIcon, type AppIconName } from "@/app/components/ui/AppIcon";
import { Badge } from "@/app/components/ui/Badge";
import { Card } from "@/app/components/ui/Card";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { checkSupabaseConnection } from "@/lib/supabase/server";

const quickActions: Array<{
  description: string;
  href: string;
  icon: AppIconName;
  title: string;
}> = [
  {
    description: "Shape product concepts and visual direction.",
    href: "/fashion-studio",
    icon: "studio",
    title: "Fashion Studio",
  },
  {
    description: "Develop insights and creative intelligence.",
    href: "/fashion-brain",
    icon: "brain",
    title: "Fashion Brain",
  },
  {
    description: "Prepare still concepts for motion workflows.",
    href: "/motion-studio",
    icon: "motion",
    title: "Motion Studio",
  },
];

export default async function DashboardPage() {
  const supabaseConnected = await checkSupabaseConnection();

  return (
    <div>
      <PageHeader
        action={
          <Badge
            role="status"
            variant={supabaseConnected ? "success" : "neutral"}
          >
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${
                supabaseConnected ? "bg-accent-success" : "bg-text-muted"
              }`}
            />
            {supabaseConnected ? "Supabase connected" : "Supabase unavailable"}
          </Badge>
        }
        description="Manage your affiliate creative workflow."
        eyebrow="Workspace overview"
        title="Dashboard"
      />

      <section className="mt-[var(--space-section)]">
        <SectionHeading
          description="Move directly into the creative workspace you need."
          title="Quick Actions"
        />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <Card interactive key={action.href}>
              <Link
                className="group block h-full p-5"
                href={action.href}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-10 place-items-center rounded-card border border-accent-cyan/15 bg-gradient-to-br from-accent-cyan/10 to-accent-violet/10 text-accent-cyan">
                    <AppIcon className="size-5" name={action.icon} />
                  </span>
                  <AppIcon
                    className="size-4 text-text-muted transition duration-[var(--transition-fast)] group-hover:translate-x-0.5 group-hover:text-accent-cyan"
                    name="arrow"
                  />
                </div>
                <h3 className="mt-5 text-base font-semibold text-text-primary">
                  {action.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {action.description}
                </p>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-[var(--space-section)] grid gap-6 xl:grid-cols-2">
        <div>
          <SectionHeading
            description="Saved project activity will appear here in a future sprint."
            title="Recent Projects"
          />
          <Card className="mt-5">
            <EmptyState
              description="No project data is loaded yet. Your saved creative work will stay organized here when project workflows are introduced."
              icon={<AppIcon className="size-5" name="folder" />}
              title="Your project space is ready"
            />
          </Card>
        </div>

        <div>
          <SectionHeading
            description="Generated and uploaded assets will remain private and organized."
            title="Recent Assets"
          />
          <Card className="mt-5">
            <EmptyState
              description="No asset data is loaded yet. Future image and motion outputs will surface here after their approved workflows are built."
              icon={<AppIcon className="size-5" name="image" />}
              title="No recent assets"
            />
          </Card>
        </div>
      </section>
    </div>
  );
}
