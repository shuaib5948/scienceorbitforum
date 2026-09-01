import type { ReactNode } from 'react';
import { PageHero } from './PageHero';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { ArrowLink } from '../ui/Links';
import { ButtonLink } from '../ui/Button';

export interface StatementPillar {
  title: string;
  desc: string;
}

export interface StatementRelated {
  title: string;
  desc: string;
  href: string;
  cta?: string;
}

export interface StatementPageProps {
  breadcrumbs: Array<{ label: string; href?: string }>;
  eyebrow: string;
  title: ReactNode;
  lede: ReactNode;
  keywords: string[];
  pillars?: StatementPillar[];
  related?: { eyebrow: string; title: string; lede?: string; items: StatementRelated[] };
}

/**
 * StatementPage — a clean interior-page layout for the Mission and Vision pages:
 *
 *   navy statement hero (breadcrumbs → eyebrow → title → lede → keywords)
 *   → related-page links → closing CTA.

 * Reuses the existing design tokens, SectionHeading, Breadcrumbs and the
 * membership-CCTA language so the pages stay consistent with the rest of the site.
 */
export function StatementPage({
  breadcrumbs,
  eyebrow,
  title,
  lede,
  keywords,
  pillars,
  related,
}: StatementPageProps) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        lede={lede}
        roomy
      >
        {keywords.length > 0 && (
          <Reveal delay={160}>
            <hr className="statement__rule" aria-hidden />
            <p className="statement__keywords">
              {keywords.map((word, i) => (
                <span key={word}>
                  {i > 0 && <span className="statement__dot" aria-hidden> • </span>}
                  {word}
                </span>
              ))}
            </p>
          </Reveal>
        )}
      </PageHero>

      {pillars && pillars.length > 0 && (
        <section className="container section">
          <div className="statement-pillars">
            {pillars.map((pillar, i) => (
              <Reveal key={pillar.title} as="article" delay={i * 60}>
                <div className="statement-pillar">
                  <span className="statement-pillar__icon" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="statement-pillar__title">{pillar.title}</h3>
                  <p className="statement-pillar__desc">{pillar.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {related && (
        <section className="container section">
          <SectionHeading eyebrow={related.eyebrow} title={related.title} lede={related.lede} align="center" />
          <div className="statement-related">
            {related.items.map((r, i) => (
              <Reveal key={r.href} as="article" delay={i * 60}>
                <div className="statement-related__card">
                  <h3 className="statement-related__title">{r.title}</h3>
                  <p className="statement-related__desc">{r.desc}</p>
                  <ArrowLink href={r.href}>{r.cta ?? 'Learn more'}</ArrowLink>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="membership-cta">
        <div className="membership-cta__orb" aria-hidden />
        <div className="container">
          <Reveal>
            <div className="membership-cta__inner">
              <span className="eyebrow eyebrow--light">Your Curiosity Has a Place Here.</span>
              <h2 className="membership-cta__title">Become part of the Science Orbit Forum community.</h2>
              <p className="membership-cta__lede">
                Join curious minds exploring science, research and innovation together.
              </p>
              <ButtonLink href="/join" size="lg" withArrow className="membership-cta__btn">
                Join Science Orbit Forum
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}