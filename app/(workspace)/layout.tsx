import Sidebar from "../components/layout/Sidebar";
import { requireAuthenticatedSession } from "@/lib/supabase/auth";

export default async function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAuthenticatedSession();

  return (
    <div className="min-h-dvh bg-app text-text-primary lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)]">
      <Sidebar />
      <main
        className="min-w-0 px-[var(--space-shell-x)] pt-[max(var(--space-shell-y),env(safe-area-inset-top))] pb-[max(var(--space-shell-y),env(safe-area-inset-bottom))]"
        id="main-content"
      >
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
