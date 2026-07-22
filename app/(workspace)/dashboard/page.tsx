import { checkSupabaseConnection } from "@/lib/supabase/server";

const sections = ["Recent Projects", "Quick Actions", "Recent Assets"];

export default async function DashboardPage() {
  const supabaseConnected = await checkSupabaseConnection();

  return (
    <div>
      <h1 className="text-4xl font-bold">Welcome to Vann AI Studio</h1>
      <p className="mt-2 text-zinc-400">
        Your workspace for creating affiliate fashion content.
      </p>
      <div
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300"
        role="status"
      >
        <span
          aria-hidden="true"
          className={`size-2 rounded-full ${
            supabaseConnected ? "bg-emerald-400" : "bg-zinc-500"
          }`}
        />
        {supabaseConnected ? "Supabase connected" : "Supabase unavailable"}
      </div>

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
