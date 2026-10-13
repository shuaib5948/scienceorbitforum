import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, MapPin, Sparkles, ExternalLink, Compass } from 'lucide-react';

function getMainSiteUrl(): string {
  if (typeof window === 'undefined') return '/';
  const { protocol, hostname, port } = window.location;
  const baseHost = hostname.replace(/^(icrast|festival)\./i, '');
  const portSuffix = port ? `:${port}` : '';
  if (baseHost !== hostname) {
    return `${protocol}//${baseHost}${portSuffix}`;
  }
  return '/';
}

function getIcrastUrl(): string {
  if (typeof window === 'undefined') return '/icrast';
  const { protocol, hostname, port } = window.location;
  const baseHost = hostname.replace(/^(icrast|festival)\./i, '');
  const portSuffix = port ? `:${port}` : '';
  if (hostname.startsWith('festival.')) {
    return `${protocol}//icrast.${baseHost}${portSuffix}`;
  }
  return '/icrast';
}

interface Pillar {
  colorName: string;
  hex: string;
  title: string;
  subtitle: string;
  description: string;
}

const festivalPillars: Pillar[] = [
  {
    colorName: 'Peach Yellow',
    hex: '#ffbd59',
    title: 'PERSPECTIVE & UNITY',
    subtitle: 'Interdisciplinary Collaboration',
    description:
      'Uniting diverse viewpoints, scientific disciplines, students, researchers, and public communities into a cohesive culture of curiosity and shared discovery.',
  },
  {
    colorName: 'Vivid Blue',
    hex: '#5170ff',
    title: 'CONTINUUM & DISCOVERY',
    subtitle: 'The Continuum of Life',
    description:
      'Tracing the magnificent scientific bridge from the smallest subatomic building blocks of matter to the boundless complexity of living organisms and ecosystems.',
  },
  {
    colorName: 'Bright Red',
    hex: '#ff3131',
    title: 'RESEARCH FOUNDATIONAL INTEGRATION',
    subtitle: 'Rigorous Academic Inquiry',
    description:
      'Rooting exploration in fundamental sciences, evidence-based research, and the synthesis of foundational knowledge to tackle pressing global challenges.',
  },
  {
    colorName: 'Cobalt Blue',
    hex: '#002aad',
    title: 'TECHNOLOGY & INNOVATION',
    subtitle: 'Frontier Solutions',
    description:
      'Accelerating modern technologies, computational intelligence, biotechnology, functional materials, and engineering paradigms that advance human well-being.',
  },
  {
    colorName: 'Coral Red',
    hex: '#ff5757',
    title: 'EXPLORATION & EXPERIMENTATION',
    subtitle: 'Hands-on Science',
    description:
      'Encouraging direct laboratory experimentation, open maker workshops, scientific exhibitions, and fearless inquiry beyond the classroom.',
  },
];

export default function FestivalPortalPage() {
  const mainSiteUrl = getMainSiteUrl();
  const icrastUrl = getIcrastUrl();

  // Simple animated progress simulation for the loading feel
  const [progress, setProgress] = useState(68);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 94 ? 68 : prev + 2));
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="festival-coming-soon">
      {/* Dynamic atmospheric color glows */}
      <div className="festival-aura" aria-hidden="true">
        <div className="festival-aura__orb festival-aura__orb--yellow" />
        <div className="festival-aura__orb festival-aura__orb--vivid-blue" />
        <div className="festival-aura__orb festival-aura__orb--bright-red" />
        <div className="festival-aura__orb festival-aura__orb--cobalt-blue" />
        <div className="festival-aura__orb festival-aura__orb--coral-red" />
        <div className="festival-aura__grid-mesh" />
      </div>

      {/* Top Navigation Bar */}
      <header className="festival-nav">
        <div className="festival-nav__container">
          <a href={mainSiteUrl} className="festival-nav__back">
            <ArrowLeft size={16} />
            <span>Science Orbit Forum</span>
          </a>

          <div className="festival-nav__badge-wrap">
            <span className="festival-domain-pill">festival.scienceorbitforum.org</span>
          </div>

          <div className="festival-nav__links">
            <a href={icrastUrl} className="festival-nav__link">
              <span>ICRAST-26</span>
              <ExternalLink size={13} />
            </a>
            <a href="/join" className="festival-nav__link festival-nav__link--cta">
              Join Forum
            </a>
          </div>
        </div>
      </header>

      {/* Hero & Loading Stage */}
      <main className="festival-hero">
        <div className="festival-hero__container">
          {/* Official Festival Logo Emblem */}
          <div className="festival-logo-frame">
            <div className="festival-logo-frame__ring" aria-hidden="true" />
            <div className="festival-logo-frame__inner">
              <img
                src="/images/science-festival-logo.png"
                alt="Science Orbit Festival 2K26 Logo"
                className="festival-logo-img"
              />
            </div>
          </div>

          {/* Status Badge */}
          <div className="festival-status-badge">
            <span className="festival-status-dot" />
            <span className="festival-status-text">COMING SOON · DECEMBER 2026</span>
          </div>

          {/* Title and Theme */}
          <h1 className="festival-title">
            <span className="festival-title__main">Science Orbit Festival 2K26</span>
            <span className="festival-title__code">SOF-26</span>
          </h1>

          <p className="festival-theme-quote">
            <span className="festival-theme-quote__mark">“</span>
            From Atoms to Ecosystems: The Continuum of Life
            <span className="festival-theme-quote__mark">”</span>
          </p>

          <p className="festival-lede">
            Science Orbit Forum has launched <strong>Science Orbit Festival 2K26 (SOF-26)</strong>,
            a premier multi-month celebration of scientific curiosity, interdisciplinary research, and discovery.
            Culminating in <strong>December 2026 in Kozhikode (Calicut), Kerala</strong>.
          </p>

          {/* Simulated Loading & Initialization Bar */}
          <div className="festival-loader-box">
            <div className="festival-loader-header">
              <span className="festival-loader-label">
                <Sparkles size={14} className="festival-loader-sparkle" />
                <span>Portal &amp; Programme Modules Loading</span>
              </span>
              <span className="festival-loader-percent">{progress}%</span>
            </div>

            <div className="festival-loader-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="festival-loader-bar"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="festival-loader-footer">
              <span className="festival-loader-subtext">
                Assembling Pavilions · Student Expos · Workshops · Scientific Dialogues
              </span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="festival-meta-strip">
            <div className="festival-meta-cell">
              <Calendar size={17} className="festival-meta-cell__icon" />
              <div>
                <span className="festival-meta-cell__label">Festival Timeline</span>
                <strong className="festival-meta-cell__val">Oct 2026 – Dec 2026</strong>
              </div>
            </div>

            <div className="festival-meta-cell">
              <MapPin size={17} className="festival-meta-cell__icon" />
              <div>
                <span className="festival-meta-cell__label">Culmination Venue</span>
                <strong className="festival-meta-cell__val">Kozhikode (Calicut), Kerala</strong>
              </div>
            </div>

            <div className="festival-meta-cell">
              <Compass size={17} className="festival-meta-cell__icon" />
              <div>
                <span className="festival-meta-cell__label">Featured Flagship</span>
                <strong className="festival-meta-cell__val">ICRAST-26 (21 Nov 2026)</strong>
              </div>
            </div>
          </div>

          {/* Section: The 5 Thematic Pillars */}
          <section className="festival-pillars-section" aria-labelledby="pillars-title">
            <div className="festival-pillars-header">
              <span className="festival-eyebrow">Festival Color System &amp; Thematic Pillars</span>
              <h2 id="pillars-title" className="festival-pillars-title">
                The Spectrum of SOF-26
              </h2>
              <p className="festival-pillars-subtitle">
                Each color in our festival emblem embodies a foundational pillar of scientific progress and community engagement:
              </p>
            </div>

            <div className="festival-pillars-grid">
              {festivalPillars.map((pillar) => (
                <article
                  key={pillar.hex}
                  className="festival-pillar-card"
                  style={{
                    borderColor: `${pillar.hex}33`,
                    '--pillar-color': pillar.hex,
                  } as React.CSSProperties}
                >
                  <div
                    className="festival-pillar-card__accent"
                    style={{ background: pillar.hex }}
                  />

                  <div className="festival-pillar-card__top">
                    <span
                      className="festival-pillar-swatch"
                      style={{ background: pillar.hex }}
                      aria-hidden="true"
                    />
                    <div className="festival-pillar-color-info">
                      <span className="festival-pillar-color-name">{pillar.colorName}</span>
                      <code className="festival-pillar-hex">{pillar.hex}</code>
                    </div>
                  </div>

                  <h3 className="festival-pillar-title" style={{ color: pillar.hex }}>
                    {pillar.title}
                  </h3>
                  <span className="festival-pillar-subtitle">{pillar.subtitle}</span>

                  <p className="festival-pillar-desc">{pillar.description}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Actions & Next Steps */}
          <div className="festival-actions-row">
            <a href={mainSiteUrl} className="festival-btn festival-btn--secondary">
              <ArrowLeft size={16} />
              <span>Return to Science Orbit Forum</span>
            </a>

            <a href={icrastUrl} className="festival-btn festival-btn--primary">
              <span>Explore ICRAST-26 Conference</span>
              <ExternalLink size={16} />
            </a>

            <a href="/join" className="festival-btn festival-btn--outline">
              <span>Join the Community</span>
            </a>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="festival-footer">
        <div className="festival-footer__container">
          <p className="festival-footer__copy">
            © 2026 Science Orbit Forum. Science Orbit Festival 2K26 (SOF-26). All rights reserved.
          </p>
          <div className="festival-footer__links">
            <a href={mainSiteUrl}>Home</a>
            <span aria-hidden="true">·</span>
            <a href={icrastUrl}>ICRAST-26</a>
            <span aria-hidden="true">·</span>
            <a href="/join">Membership</a>
            <span aria-hidden="true">·</span>
            <a href="/updates">Updates</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
