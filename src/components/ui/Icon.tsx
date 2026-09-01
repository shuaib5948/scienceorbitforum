import type { JSX } from 'react';

type IconName =
  | 'orbit'
  | 'microscope'
  | 'atom'
  | 'dna'
  | 'telescope'
  | 'code'
  | 'lightbulb'
  | 'research'
  | 'presentation'
  | 'innovation'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'calendar'
  | 'clock'
  | 'pin'
  | 'users'
  | 'external'
  | 'check'
  | 'docs';

/**
 * Line-icon set. Every icon is stroke-based (strokeWidth 1.5), consistent,
 * minimal and geometric. Colours inherit from `currentColor` so icons adapt
 * to context. Iconography always uses this single family — never mixed.
 */
const PATHS: Record<IconName, JSX.Element> = {
  orbit: (
    <>
      <circle cx="12" cy="12" r="7" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-24 12 12)" />
      <circle cx="12" cy="12" r="1.9" />
      <circle cx="20.4" cy="8.2" r="1.2" />
      <circle cx="4.2" cy="15" r="1.1" opacity="0.6" />
    </>
  ),
  microscope: (
    <>
      <path d="M5 20h14" />
      <path d="M12 20V6" />
      <path d="M10 6h4" />
      <path d="M14 6l5-3" />
      <circle cx="10" cy="8.5" r="2" />
      <path d="M10 10.5v1.5" />
      <path d="M7 15l-2 2" />
    </>
  ),
  atom: (
    <>
      <circle cx="12" cy="12" r="3" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(-30 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(50 12 12)" />
      <circle cx="20.2" cy="8" r="1.1" />
      <circle cx="3.8" cy="9.2" r="1.1" />
    </>
  ),
  dna: (
    <>
      <path d="M6 3c3 4-3 9 2 13s-2-9-2-13z" />
      <path d="M18 3c-3 4 3 9-2 13s2-9 2-13z" />
      <path d="M6 3h12M6 21h12" />
      <path d="M8.5 9.5l7 5M15.5 9.5l-7 5" />
    </>
  ),
  telescope: (
    <>
      <path d="M4 13h16" />
      <path d="M20 13l-6 6M13 16h3" />
      <path d="M7 13V10" />
      <circle cx="7" cy="8.5" r="1.6" />
      <path d="M12 19l1 3" />
    </>
  ),
  code: (
    <>
      <path d="M8 6l-4 6 4 6" />
      <path d="M16 6l4 6-4 6" />
      <path d="M13.5 4l-3 16" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M9.5 19h5" />
      <rect x="8" y="2.5" width="8" height="11" rx="4" />
      <path d="M10 17.5h4" />
      <path d="M10.5 20.5h3" />
      <path d="M12 6v1" />
    </>
  ),
  research: (
    <>
      <path d="M5 4h6" />
      <path d="M8 4c0 4 2 7 2 11h2c0-4 2-7 2-11" />
      <path d="M8 17h8M9 20h6" />
      <path d="M17 11c1.5 1.5 2.5 2.5 3 4" />
    </>
  ),
  presentation: (
    <>
      <path d="M7 4h10" />
      <path d="M8 10h8M8 13h8M8 16h8" />
      <path d="M8 4v15" />
      <path d="M8 19h8" />
      <path d="M12 4v3" />
    </>
  ),
  innovation: (
    <>
      <path d="M12 14c2.5 0 5-1.5 5-4s-2.5-4-5-4-5 1.5-5 4 2.5 4 5 4z" />
      <path d="M12 14v4" />
      <path d="M10 19h4" />
      <path d="M12 9v1" />
    </>
  ),
  'arrow-right': <path d="M4 12h15M14 6l6 6-6 6" />,
  'arrow-up-right': <path d="M6 18L18 6M8 6h10v10" />,
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" />
      <path d="M8 13l2 2 3-3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v4l3 2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6-5.2-6-10a6 6 0 0 1 12 0c0 4.8-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.2" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="4" />
      <path d="M3.5 20c.8-3.4 3-5 5.5-5s4.7 1.6 5.5 5" />
      <path d="M16 5.2a4 4 0 0 1 0 6.6" />
      <path d="M15.5 15.3c2 .6 3.4 2.1 4 4.7" />
    </>
  ),
  external: (
    <>
      <path d="M13 4h7v7" />
      <path d="M20 4L11 13" />
      <path d="M15 11v7H5V8h7" />
    </>
  ),
  check: <path d="M5 12.5l4 4L19 7" />,
  docs: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v5h5M9 11h6M9 14h6M9 17h4" />
    </>
  ),
};

export interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  title?: string;
  ['aria-hidden']?: boolean | 'true' | 'false';
}

export function Icon({ name, size = 24, strokeWidth = 1.5, className = '', title, ...rest }: IconProps) {
  return (
    <svg
      className={`icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}

export type { IconName };