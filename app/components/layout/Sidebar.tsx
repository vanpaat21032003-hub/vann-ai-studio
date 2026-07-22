import Link from "next/link";

import { signOut } from "@/app/actions/auth";

const navigation = [
  { href: "/dashboard", label: "🏠 Dashboard" },
  { href: "/fashion-studio", label: "🎨 Fashion Studio" },
  { href: "/fashion-brain", label: "🧠 Fashion Brain" },
  { href: "/motion-studio", label: "🎬 Motion Studio" },
  { href: "/publishing", label: "🚀 Publishing" },
  { href: "/research", label: "📈 Research" },
];

export default function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 flex-col bg-zinc-900 p-6 text-white">
      <h1 className="mb-8 text-2xl font-bold">Vann AI Studio</h1>

      <nav aria-label="Main navigation" className="flex-1 space-y-3">
        {navigation.map((item) => (
          <Link
            className="block w-full rounded-lg p-3 text-left transition hover:bg-zinc-800"
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}

        <div aria-hidden="true" className="border-t border-zinc-700 py-2" />

        <Link
          className="block w-full rounded-lg p-3 text-left transition hover:bg-zinc-800"
          href="/settings"
        >
          ⚙ Settings
        </Link>
      </nav>

      <form action={signOut} className="mt-8 border-t border-zinc-700 pt-4">
        <button
          className="w-full rounded-lg p-3 text-left text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          type="submit"
        >
          Sign out
        </button>
      </form>
    </aside>
  );
}
