// Iconos de línea (currentColor). Trazado tipo Lucide (MIT).
import type { SVGProps } from "react";

export type IconName =
  | "search"
  | "close"
  | "chevron"
  | "chevron-right"
  | "arrow-up"
  | "chart"
  | "compare"
  | "rankings"
  | "access"
  | "command"
  | "external"
  | "globe"
  | "layers"
  | "book"
  | "play"
  | "trophy"
  | "flame"
  | "sparkles"
  | "info"
  | "target"
  | "shuffle"
  | "scatter"
  | "wallet"
  | "lock"
  | "check"
  | "back"
  | "refresh"
  | "plus"
  | "minus"
  | "coins"
  | "trending"
  | "percent"
  | "scale"
  | "shield"
  | "brain"
  | "sun"
  | "moon"
  | "passport"
  | "building"
  | "gavel"
  | "alert";

const PATHS: Record<IconName, JSX.Element> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  close: <path d="M18 6 6 18M6 6l12 12" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  "arrow-up": <path d="M12 19V5M5 12l7-7 7 7" />,
  chart: <path d="M3 3v18h18M8 16V9M13 16V5M18 16v-6" />,
  compare: <path d="M12 3v18M6 8l-3 3 3 3M18 8l3 3-3 3M3 11h6M15 11h6" />,
  rankings: <path d="M4 20V10M10 20V4M16 20v-8M2 20h20" />,
  access: (
    <>
      <circle cx="12" cy="4.5" r="1.6" />
      <path d="M4 8h16M12 8v7M8.5 20l3.5-5 3.5 5" />
    </>
  ),
  command: <path d="M6 9a3 3 0 1 0 3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  layers: <path d="m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5" />,
  book: <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5ZM19 19v2" />,
  play: <path d="M6 4.5v15l13-7.5-13-7.5Z" />,
  trophy: (
    <>
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M9 21h6M12 14v3" />
    </>
  ),
  flame: <path d="M12 3c1 3 4 4.5 4 8a4 4 0 1 1-8 0c0-1.5.6-2.4 1.2-3 .2 1 .8 1.6 1.4 1.8C10.4 8 10 6 12 3Z" />,
  sparkles: <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3ZM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.5h.01" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  shuffle: <path d="M16 4h4v4M20 4l-7 7M4 20l5-5M16 20h4v-4M4 4l16 16" />,
  scatter: (
    <>
      <path d="M3 3v18h18" />
      <circle cx="8" cy="15" r="1.2" />
      <circle cx="12" cy="10" r="1.2" />
      <circle cx="16" cy="12" r="1.2" />
      <circle cx="18" cy="6" r="1.2" />
      <circle cx="10" cy="17" r="1.2" />
    </>
  ),
  wallet: <path d="M3 7a2 2 0 0 1 2-2h12v3M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-3M3 7h17a1 1 0 0 1 1 1v3M17 12h.01" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  check: <path d="M4 12.5 9 17.5 20 6.5" />,
  back: <path d="M19 12H5M12 5l-7 7 7 7" />,
  refresh: <path d="M21 12a9 9 0 1 1-2.6-6.4M21 4v5h-5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  coins: (
    <>
      <ellipse cx="8" cy="6" rx="5" ry="2.5" />
      <path d="M3 6v5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V6" />
      <ellipse cx="16" cy="13" rx="5" ry="2.5" />
      <path d="M11 13v5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-5" />
    </>
  ),
  trending: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
  percent: (
    <>
      <path d="M19 5 5 19" />
      <circle cx="7.5" cy="7.5" r="2" />
      <circle cx="16.5" cy="16.5" r="2" />
    </>
  ),
  scale: <path d="M12 3v18M5 21h14M6 6h12M6 6 3 12a3 3 0 0 0 6 0L6 6Zm12 0-3 6a3 3 0 0 0 6 0l-3-6Z" />,
  shield: <path d="M12 3l8 3v6c0 4.4-3.2 7.6-8 9-4.8-1.4-8-4.6-8-9V6l8-3Z" />,
  brain: <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 5 1V5a2 2 0 0 0-2-1ZM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-5 1" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />,
  passport: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M9 16h6" />
    </>
  ),
  building: <path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M15 21V9h3a2 2 0 0 1 2 2v10M3 21h18M8 7h2M8 11h2M8 15h2" />,
  gavel: <path d="m14 11-7 7-3-3 7-7M12.5 6.5l5 5M16 3l5 5-2.5 2.5-5-5L16 3ZM7 21h8" />,
  alert: (
    <>
      <path d="M10.3 4.3 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </>
  ),
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 16, strokeWidth = 1.75, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
