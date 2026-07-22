import type { ReactNode, SVGProps } from "react";

export type AppIconName =
  | "arrow"
  | "brain"
  | "dashboard"
  | "folder"
  | "image"
  | "lock"
  | "motion"
  | "publishing"
  | "research"
  | "settings"
  | "sign-out"
  | "sparkles"
  | "studio";

export type AppIconProps = SVGProps<SVGSVGElement> & {
  name: AppIconName;
};

const paths: Record<AppIconName, ReactNode> = {
  arrow: <path d="m9 18 6-6-6-6M4 12h11" />,
  brain: (
    <>
      <path d="M9.5 4.5A3 3 0 0 0 4 6v1.2a3.2 3.2 0 0 0-.5 5.9A3.5 3.5 0 0 0 8 18.5h1.5V4.5Z" />
      <path d="M14.5 4.5A3 3 0 0 1 20 6v1.2a3.2 3.2 0 0 1 .5 5.9 3.5 3.5 0 0 1-4.5 5.4h-1.5V4.5ZM9.5 9H7.8M14.5 9h1.7M9.5 14H8M14.5 14H16" />
    </>
  ),
  dashboard: (
    <>
      <rect height="6" rx="1.5" width="6" x="4" y="4" />
      <rect height="6" rx="1.5" width="6" x="14" y="4" />
      <rect height="6" rx="1.5" width="6" x="4" y="14" />
      <rect height="6" rx="1.5" width="6" x="14" y="14" />
    </>
  ),
  folder: (
    <path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h3l2 2h7a2.5 2.5 0 0 1 2.5 2.5v7A2.5 2.5 0 0 1 18 19H6a2.5 2.5 0 0 1-2.5-2.5v-9Z" />
  ),
  image: (
    <>
      <rect height="15" rx="2.5" width="17" x="3.5" y="4.5" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m5 17 4.2-4.2a1.5 1.5 0 0 1 2.1 0l1.4 1.4 1.2-1.2a1.5 1.5 0 0 1 2.1 0l3 3" />
    </>
  ),
  lock: (
    <>
      <rect height="10" rx="2" width="15" x="4.5" y="10" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10M12 14v2" />
    </>
  ),
  motion: (
    <>
      <rect height="16" rx="2.5" width="17" x="3.5" y="4" />
      <path d="m10 9 5 3-5 3V9Z" />
    </>
  ),
  publishing: (
    <>
      <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" />
      <path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
    </>
  ),
  research: (
    <>
      <path d="M5 19V9m5 10V5m5 14v-7m5 7V3" />
      <path d="M3 19h19" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </>
  ),
  "sign-out": (
    <>
      <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
      <path d="M14 8l4 4-4 4m4-4H9" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 1.4 3.6L17 8l-3.6 1.4L12 13l-1.4-3.6L7 8l3.6-1.4L12 3Z" />
      <path d="m18.5 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2ZM5.5 13l.6 1.4 1.4.6-1.4.6L5.5 17l-.6-1.4-1.4-.6 1.4-.6.6-1.4Z" />
    </>
  ),
  studio: (
    <>
      <path d="M12 3.5 14.5 9l5.5.5-4.2 3.7 1.2 5.3-5-2.8-5 2.8 1.2-5.3L4 9.5 9.5 9 12 3.5Z" />
      <path d="m18.5 3 .5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5Z" />
    </>
  ),
};

export function AppIcon({ className = "size-5", name, ...props }: AppIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      >
        {paths[name]}
      </g>
    </svg>
  );
}
