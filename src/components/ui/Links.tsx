import type { ReactNode } from 'react';

export interface ArrowLinkProps {
  href?: string;
  children: ReactNode;
  className?: string;
}

/** Minimal text link with an animated arrow — the website's default "read more". */
export function ArrowLink({ href = '#', children, className = '' }: ArrowLinkProps) {
  return (
    <a href={href} className={`arrow-link ${className}`.trim()}>
      {children}
      <span className="arrow-link__arrow" aria-hidden>
        →
      </span>
    </a>
  );
}

export type SocialName = 'instagram' | 'youtube' | 'twitter' | 'mail' | 'linkedin' | 'whatsapp' | 'facebook';

const SOCIAL_ICONS: Record<SocialName, ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: (
    <path d="M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v6h3v-6h2l.5-3H14V8.5A.5.5 0 0 1 14.5 8z" />
  ),
  youtube: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="3" />
      <path d="M10.5 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
    </>
  ),
  twitter: (
    <path d="M4 4l7 9M20 4l-7 9L4 20h4l7-6M14 7l6-3 0 8z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.5 10v7M7.5 7v.01" />
      <path d="M11 17v-4.5a2.5 2.5 0 0 1 5 0V17M11 10v7" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" />
      <path d="M9 8.5c0 4 2.5 6.5 6.5 6.5l.5-2-2.2-1-1 .8c-1-.5-1.8-1.5-2.2-2.3L11 9.5z" />
    </>
  ),
};

export interface SocialIconProps {
  name: SocialName;
  href?: string;
  label?: string;
  size?: number;
  className?: string;
}

/** Circular social icon (line style). */
export function SocialIcon({ name, href = '#', label, size = 16, className = '' }: SocialIconProps) {
  return (
    <a
      href={href}
      className={`social-icon ${className}`.trim()}
      aria-label={label ?? name}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {SOCIAL_ICONS[name]}
      </svg>
    </a>
  );
}