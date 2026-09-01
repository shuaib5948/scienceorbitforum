import { Logo } from '../../components/ui/Logo';
import { OrbOrnament } from '../../components/ui/OrbOrnament';

/**
 * 00 · COVER — the design-system front matter.
 */
export function HeroSection() {
  return (
    <div className="ds-hero">
      <div className="ds-hero__orb" aria-hidden>
        <OrbOrnament style={{ opacity: 0.7, top: '-10%', left: '55%', height: '640px' }} />
      </div>

      <div className="container" style={{ position: 'relative' }}>
        <p className="eyebrow eyebrow--light ds-hero__eyebrow">Science Orbit Forum · Design System</p>
        <h1 className="ds-hero__title" style={{ marginBlockStart: 'var(--space-4)' }}>
          Where curiosity
          <br />
          orbits knowledge.
        </h1>
        <p className="ds-hero__lede" style={{ marginBlockStart: 'var(--space-5)' }}>
          Phase 1 establishes the visual identity and design foundation for the student science forum of the
          Department of Science &amp; Technology at Jamia Madeenathunnoor — a modern, academic, international
          visual language built around the concept of the orbit.
        </p>

        <div className="ds-hero__meta" style={{ marginBlockStart: 'var(--space-6)' }}>
          {['Phase 1 · Foundation', 'React + Node', '14 deliverables', 'Design tokens', 'WCAG AA+'].map((t) => (
            <span key={t} className="ds-hero__tag">
              <span style={{ color: 'var(--color-accent)' }}>◆</span>
              {t}
            </span>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-8)',
            marginBlockStart: 'var(--space-10)',
            alignItems: 'center',
          }}
        >
          <div>
            <p className="type-line__label" style={{ color: 'var(--color-text-inverse-muted)', marginBottom: 'var(--space-3)' }}>
              Logo · light
            </p>
            <div
              style={{
                display: 'inline-block',
                padding: 'var(--space-5) var(--space-6)',
                background: 'linear-gradient(180deg, #FFFFFF, #EAF1F8)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <Logo size={44} />
            </div>
          </div>
          <div>
            <p className="type-line__label" style={{ color: 'var(--color-text-inverse-muted)', marginBottom: 'var(--space-3)' }}>
              Logo · dark
            </p>
            <div
              style={{
                display: 'inline-block',
                padding: 'var(--space-5) var(--space-6)',
                background: 'linear-gradient(180deg, #0A1A33, #071A2F)',
                border: '1px solid rgb(244 248 252 / 0.12)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <Logo tone="dark" size={44} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}