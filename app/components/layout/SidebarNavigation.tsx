"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppIcon, type AppIconName } from "@/app/components/ui/AppIcon";

type NavigationItem = {
  href: string;
  icon: AppIconName;
  label: string;
};

type SidebarNavigationProps = {
  footer: ReactNode;
};

const primaryNavigation: NavigationItem[] = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/fashion-studio", icon: "studio", label: "Fashion Studio" },
  { href: "/fashion-brain", icon: "brain", label: "Fashion Brain" },
  { href: "/motion-studio", icon: "motion", label: "Motion Studio" },
  { href: "/publishing", icon: "publishing", label: "Publishing" },
  { href: "/research", icon: "research", label: "Research" },
];

const settingsItem: NavigationItem = {
  href: "/settings",
  icon: "settings",
  label: "Settings",
};

function NavigationLink({ item, pathname }: { item: NavigationItem; pathname: string }) {
  const active =
    pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={`group relative flex min-h-12 items-center gap-3 rounded-control border px-3 py-2.5 text-sm font-medium transition duration-[var(--transition-fast)] ease-[var(--ease-ui)] ${
        active
          ? "border-accent-cyan/20 bg-gradient-to-r from-accent-cyan/12 to-accent-violet/10 text-text-primary shadow-glow"
          : "border-transparent text-text-secondary hover:border-border-soft hover:bg-surface-highlight hover:text-text-primary"
      }`}
      href={item.href}
    >
      <span
        className={`grid size-8 shrink-0 place-items-center rounded-lg border transition duration-[var(--transition-fast)] ${
          active
            ? "border-accent-cyan/25 bg-accent-cyan/10 text-accent-cyan"
            : "border-border-soft bg-surface-soft text-text-muted group-hover:text-text-secondary"
        }`}
      >
        <AppIcon className="size-4" name={item.icon} />
      </span>
      <span className="min-w-0 truncate">{item.label}</span>
      {active ? (
        <span
          aria-hidden="true"
          className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-gradient-to-b from-accent-cyan to-accent-violet"
        />
      ) : null}
    </Link>
  );
}

export function SidebarNavigation({ footer }: SidebarNavigationProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <nav
        aria-label="Workspace navigation"
        className="min-h-0 flex-1 lg:overflow-y-auto lg:overscroll-contain lg:pr-1 lg:[scrollbar-gutter:stable]"
      >
        <p className="mb-3 hidden px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-text-muted lg:block">
          Workspaces
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-col">
          {primaryNavigation.map((item) => (
            <NavigationLink item={item} key={item.href} pathname={pathname} />
          ))}
        </div>
      </nav>

      <div className="mt-3 shrink-0 border-t border-border-soft pt-3 lg:mt-4 lg:pt-4">
        <NavigationLink item={settingsItem} pathname={pathname} />
        {footer}
      </div>
    </div>
  );
}
