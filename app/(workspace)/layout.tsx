import Sidebar from "../components/layout/Sidebar";
import { requireAuthenticatedSession } from "@/lib/supabase/auth";

export default async function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAuthenticatedSession();

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
