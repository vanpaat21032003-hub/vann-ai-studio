import { Card } from "@/app/components/ui/Card";

export default function ModelLibraryLoading() {
  return (
    <div aria-busy="true" aria-label="Loading Model Library">
      <div className="h-4 w-32 animate-pulse rounded-full bg-surface-highlight" />
      <div className="mt-5 h-10 w-64 max-w-full animate-pulse rounded-control bg-surface-highlight" />
      <div className="mt-4 h-5 w-96 max-w-full animate-pulse rounded-control bg-surface-highlight" />
      <div className="mt-[var(--space-section)] grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card className="min-h-56 animate-pulse p-6" key={index}>
            <div className="size-11 rounded-card bg-surface-highlight" />
            <div className="mt-5 h-6 w-2/3 rounded-control bg-surface-highlight" />
            <div className="mt-3 h-4 w-1/2 rounded-control bg-surface-highlight" />
            <div className="mt-auto h-4 w-24 rounded-control bg-surface-highlight" />
          </Card>
        ))}
      </div>
    </div>
  );
}
