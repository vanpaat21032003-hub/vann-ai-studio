import Link from "next/link";

import { AppIcon } from "@/app/components/ui/AppIcon";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { Input } from "@/app/components/ui/Input";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { getOwnedProducts } from "@/lib/products/data";
import { getProductStatusLabel, type ProductStatus } from "@/lib/products/schema";

const statusVariants: Record<
  ProductStatus,
  "neutral" | "cyan" | "violet"
> = {
  draft: "cyan",
  analyzed: "violet",
  archived: "neutral",
};

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

type ProductStatusFilter = "all" | "draft" | "archived";

function readSearchParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

function readStatusFilter(
  value: string | string[] | undefined,
): ProductStatusFilter {
  return value === "draft" || value === "archived" ? value : "all";
}

export default async function ProductLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string | string[];
    status?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const search = readSearchParam(params.q).trim().slice(0, 100);
  const status = readStatusFilter(params.status);
  const products = await getOwnedProducts({ search, status });
  const hasFilters = Boolean(search) || status !== "all";

  return (
    <div>
      <Link
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-accent-cyan"
        href="/fashion-studio"
      >
        <span aria-hidden="true">←</span>
        Fashion Studio
      </Link>
      <PageHeader
        action={
          <Link
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-violet px-5 py-3 text-sm font-semibold text-white shadow-glow transition duration-[var(--transition-fast)] hover:brightness-110"
            href="/fashion-studio/products/new"
          >
            Add product
            <span aria-hidden="true" className="text-base leading-none">
              +
            </span>
          </Link>
        }
        description="Organize the product metadata that powers your private creative workflow."
        eyebrow="Fashion Studio"
        title="Product Library"
      />

      <Card className="mt-[var(--space-section)] p-4 sm:p-5">
        <form
          action="/fashion-studio/products"
          className="grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_auto]"
          method="get"
        >
          <div>
            <label className="sr-only" htmlFor="product-search">
              Search products
            </label>
            <Input
              defaultValue={search}
              id="product-search"
              name="q"
              placeholder="Search title, brand, category, or color"
              type="search"
            />
          </div>
          <div className="relative">
            <label className="sr-only" htmlFor="product-status">
              Filter by status
            </label>
            <select
              className="min-h-12 w-full appearance-none rounded-control border border-border-soft bg-app/70 py-3 pr-12 pl-4 text-sm text-text-primary shadow-inner shadow-black/10 transition duration-[var(--transition-fast)] hover:border-border-strong focus:border-accent-cyan/60 focus:ring-2 focus:ring-accent-cyan/15"
              defaultValue={status}
              id="product-status"
              name="status"
            >
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-text-muted"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="m8 10 4 4 4-4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          </div>
          <Button type="submit">Apply filters</Button>
        </form>
        {hasFilters ? (
          <div className="mt-3 flex justify-end">
            <Link
              className="text-sm font-medium text-text-secondary transition hover:text-accent-cyan"
              href="/fashion-studio/products"
            >
              Clear filters
            </Link>
          </div>
        ) : null}
      </Card>

      <section className="mt-6" aria-label="Products">
        {products.length === 0 ? (
          <Card>
            <EmptyState
              action={
                <Link
                  className="inline-flex min-h-10 items-center justify-center rounded-control border border-border-strong bg-surface-highlight px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-accent-cyan/40 hover:bg-surface-soft"
                  href={
                    hasFilters
                      ? "/fashion-studio/products"
                      : "/fashion-studio/products/new"
                  }
                >
                  {hasFilters ? "Clear filters" : "Create first product"}
                </Link>
              }
              description={
                hasFilters
                  ? "No owned products match the current search and status filter."
                  : "Add product metadata to begin building your private fashion workflow. No sample data is shown here."
              }
              icon={<AppIcon className="size-5" name="studio" />}
              title={
                hasFilters
                  ? "No matching products"
                  : "Your Product Library is empty"
              }
            />
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <Card interactive key={product.id}>
                <Link
                  className="group flex h-full min-h-64 flex-col p-5 sm:p-6"
                  href={`/fashion-studio/products/${product.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-card border border-accent-cyan/15 bg-gradient-to-br from-accent-cyan/10 to-accent-violet/10 text-accent-cyan">
                      <AppIcon className="size-5" name="studio" />
                    </span>
                    <Badge variant={statusVariants[product.status]}>
                      {getProductStatusLabel(product.status)}
                    </Badge>
                  </div>

                  <div className="mt-6">
                    <h2 className="break-words text-lg font-semibold tracking-tight text-text-primary">
                      {product.title}
                    </h2>
                    <p className="mt-2 text-sm text-text-secondary">
                      {[product.brand, product.category]
                        .filter(Boolean)
                        .join(" · ") || "Metadata ready to complete"}
                    </p>
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-4 border-t border-border-soft pt-5">
                    <div>
                      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-text-muted">
                        Updated
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">
                        {formatUpdatedAt(product.updated_at)}
                      </p>
                    </div>
                    <AppIcon
                      className="size-4 text-text-muted transition duration-[var(--transition-fast)] group-hover:translate-x-0.5 group-hover:text-accent-cyan"
                      name="arrow"
                    />
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
