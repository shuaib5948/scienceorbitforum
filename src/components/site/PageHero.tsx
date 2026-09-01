import type { ReactNode } from 'react';
import { OrbOrnament } from '../ui/OrbOrnament';
import { Reveal } from '../ui/Reveal';

export interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  /** Center the hero copy (editorial masthead style). */
  align?: 'left' | 'center';
  /** Thin cyan rule at the bottom seam of the band. */
  divider?: boolean;
  /** Extra vertical breathing room for dark opening bands. */
  roomy?: boolean;
  className?: string;
  /** Optional extra content (e.g. CTA row) rendered under the lede. */
  children?: ReactNode;
}

/**
 * Compact navy hero band shared by all interior pages.
 * Mirrors the home hero language: deep navy field, orbital graphic at ~12%
 * opacity behind the copy, eyebrow → Sora headline → muted supporting line.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  align = 'left',
  divider = false,
  roomy = false,
  className = '',
  children,
}: PageHeroProps) {
  return (
    <section
      className={
        [
          'page-hero',
          divider ? 'page-hero--seam' : '',
          roomy ? 'page-hero--roomy' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')
      }
    >
      <div className="page-hero__orb" aria-hidden>
        <OrbOrnament />
      </div>

      <div className={`container section page-hero__content${align === 'center' ? ' page-hero__content--center' : ''}`}>
        <Reveal>
          {eyebrow && <span className={`eyebrow${align === 'center' ? ' eyebrow--light' : ''}`}>{eyebrow}</span>}
          <h1 className="page-hero__title">{title}</h1>
          {lede && <p className="page-hero__lede">{lede}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
