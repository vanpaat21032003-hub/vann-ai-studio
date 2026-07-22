import { signOut } from "@/app/actions/auth";
import { SidebarNavigation } from "@/app/components/layout/SidebarNavigation";
import { AppIcon } from "@/app/components/ui/AppIcon";
import { Button } from "@/app/components/ui/Button";

export default function Sidebar() {
  return (
    <aside className="relative z-20 flex w-full flex-col border-b border-border-soft bg-sidebar/95 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-panel backdrop-blur-xl lg:sticky lg:top-0 lg:h-dvh lg:max-h-dvh lg:min-h-0 lg:overflow-hidden lg:border-r lg:border-b-0 lg:px-5 lg:pt-6 lg:pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <div className="mb-4 flex shrink-0 items-center gap-3 px-1 lg:mb-6 lg:px-2">
        <div className="relative grid size-10 shrink-0 place-items-center rounded-card border border-accent-cyan/20 bg-gradient-to-br from-accent-cyan/15 to-accent-violet/15 text-accent-cyan shadow-glow">
          <AppIcon className="size-5" name="sparkles" />
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-accent-success ring-2 ring-sidebar"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight text-text-primary">
            Vann AI Studio
          </p>
          <p className="mt-0.5 text-xs text-text-muted">Private AI workspace</p>
        </div>
      </div>

      <SidebarNavigation
        footer={
          <form action={signOut} className="mt-2">
            <Button
              className="w-full justify-start"
              size="sm"
              type="submit"
              variant="ghost"
            >
              <span className="grid size-8 place-items-center rounded-lg border border-border-soft bg-surface-soft text-text-muted">
                <AppIcon className="size-4" name="sign-out" />
              </span>
              Sign out
            </Button>
          </form>
        }
      />
    </aside>
  );
}
