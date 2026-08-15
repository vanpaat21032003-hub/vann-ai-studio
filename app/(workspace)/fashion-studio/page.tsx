import Link from "next/link";

import { AppIcon } from "@/app/components/ui/AppIcon";
import { Card } from "@/app/components/ui/Card";
import { PageHeader } from "@/app/components/ui/PageHeader";

export default function FashionStudioPage() {
  return (
    <div>
      <PageHeader
        description="Create and organize fashion assets for affiliate content."
        eyebrow="Creative workspace"
        title="Fashion Studio"
      />

      <section className="mt-[var(--space-section)] grid gap-5 sm:grid-cols-2">
        <Card interactive>
          <Link
            className="group flex min-h-56 flex-col justify-between p-5 sm:p-7"
            href="/fashion-studio/image-generator"
          >
            <div>
              <span className="grid size-12 place-items-center rounded-card border border-accent-cyan/15 bg-gradient-to-br from-accent-cyan/10 to-accent-violet/10 text-accent-cyan shadow-glow">
                <AppIcon className="size-5" name="image" />
              </span>
              <h2 className="mt-6 text-xl font-semibold tracking-tight text-text-primary">
                Image Generator
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">
                Compose an approved fashion prompt for external generation,
                with optional Direct API image previews when available.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-cyan">
              Open Image Generator
              <AppIcon
                className="size-4 transition duration-[var(--transition-fast)] group-hover:translate-x-0.5"
                name="arrow"
              />
            </span>
          </Link>
        </Card>

        <Card interactive>
          <Link
            className="group flex min-h-56 flex-col justify-between p-5 sm:p-7"
            href="/fashion-studio/products"
          >
            <div>
              <span className="grid size-12 place-items-center rounded-card border border-accent-cyan/15 bg-gradient-to-br from-accent-cyan/10 to-accent-violet/10 text-accent-cyan shadow-glow">
                <AppIcon className="size-5" name="studio" />
              </span>
              <h2 className="mt-6 text-xl font-semibold tracking-tight text-text-primary">
                Product Library
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">
                Organize the private product metadata that powers future Fashion
                Studio workflows.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-cyan">
              Open Product Library
              <AppIcon
                className="size-4 transition duration-[var(--transition-fast)] group-hover:translate-x-0.5"
                name="arrow"
              />
            </span>
          </Link>
        </Card>

        <Card interactive>
          <Link
            className="group flex min-h-56 flex-col justify-between p-5 sm:p-7"
            href="/fashion-studio/models"
          >
            <div>
              <span className="grid size-12 place-items-center rounded-card border border-accent-violet/15 bg-gradient-to-br from-accent-violet/10 to-accent-cyan/10 text-accent-violet shadow-glow">
                <AppIcon className="size-5" name="sparkles" />
              </span>
              <h2 className="mt-6 text-xl font-semibold tracking-tight text-text-primary">
                Model Library
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">
                Store reusable AI-character model profiles — body type, target
                height, style, and pose — for consistent creative workflows.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-violet">
              Open Model Library
              <AppIcon
                className="size-4 transition duration-[var(--transition-fast)] group-hover:translate-x-0.5"
                name="arrow"
              />
            </span>
          </Link>
        </Card>

        <Card interactive>
          <Link
            className="group flex min-h-56 flex-col justify-between p-5 sm:p-7"
            href="/fashion-studio/styles"
          >
            <div>
              <span className="grid size-12 place-items-center rounded-card border border-accent-blue/15 bg-gradient-to-br from-accent-blue/10 to-accent-violet/10 text-accent-blue shadow-glow">
                <AppIcon className="size-5" name="sparkles" />
              </span>
              <h2 className="mt-6 text-xl font-semibold tracking-tight text-text-primary">
                Style Library
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">
                Save reusable lighting, camera, background, and mood directions
                for consistent creative workflows.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-blue">
              Open Style Library
              <AppIcon
                className="size-4 transition duration-[var(--transition-fast)] group-hover:translate-x-0.5"
                name="arrow"
              />
            </span>
          </Link>
        </Card>
      </section>
    </div>
  );
}
