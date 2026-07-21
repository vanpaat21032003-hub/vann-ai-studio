const sections = ["Recent Projects", "Quick Actions", "Recent Assets"];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Welcome to Vann AI Studio</h1>
      <p className="mt-2 text-zinc-400">
        Your workspace for creating affiliate fashion content.
      </p>
      <p className="mt-4 text-sm text-zinc-500">TODO: Connect dashboard data.</p>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {sections.map((section) => (
          <article className="rounded-xl bg-zinc-900 p-6" key={section}>
            <h2 className="text-lg font-semibold">{section}</h2>
            <p className="mt-3 text-sm text-zinc-400">TODO: Add placeholder content.</p>
          </article>
        ))}
      </section>
    </div>
  );
}
