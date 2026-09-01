import { Section } from '../kit';

const PERSONALITY = [
  'Intelligent',
  'Modern',
  'Scientific',
  'Academic',
  'Curious',
  'Inspiring',
  'Youthful',
  'Professional',
  'Institutional',
  'International',
];

const PIPELINE = ['Curiosity', 'Exploration', 'Learning', 'Research', 'Innovation', 'Impact'];

const THIS_IS = [
  'A modern university research institution',
  'A professional scientific organisation',
  'A student innovation forum',
  'An ambitious international science voice',
];

const THIS_IS_NOT = [
  'A generic college website',
  'A SaaS startup',
  'A corporate business site',
  'A membership platform',
  'A gaming or over-futuristic AI site',
];

/**
 * 01 · BRAND DIRECTION
 */
export function BrandSection() {
  return (
    <Section
      index="01"
      title="Brand direction"
      lede="Science Orbit Forum brings together students interested in science, technology, research, innovation and exploration. It is a student forum of the Department of Science and Technology — not a membership organisation, startup, commercial platform or social network. The visual language must carry institutional credibility and student curiosity in equal measure."
    >
      <div
        className="swatch-row"
        style={{ marginTop: 'var(--space-7)' }}
      >
        <div>
          <p className="eyebrow">Personality</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
            {PERSONALITY.map((t) => (
              <span key={t} className="tag tag--accent">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow">The orbit concept</p>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-3)', fontSize: 'var(--text-body)' }}>
            The orbit is the organising idea: continuous movement around a centre of knowledge.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
            {PIPELINE.map((step, i) => (
              <span key={step} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span className="orbit-pill">{step}</span>
                {i < PIPELINE.length - 1 && <span style={{ color: 'var(--color-accent)' }}>→</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-6)', marginTop: 'var(--space-7)' }}>
        <div className="gallery__item">
          <p className="eyebrow">Positioning</p>
          <blockquote
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-h4)',
              lineHeight: 1.4,
              color: 'var(--color-primary)',
              margin: 'var(--space-4) 0 0',
            }}
          >
            “An ambitious student science forum with the credibility of an academic institution and the visual
            quality of a modern international science organization.”
          </blockquote>
        </div>
        <div>
          <div className="gallery__item" style={{ background: 'var(--color-surface)' }}>
            <p className="eyebrow">Positive reference</p>
            <ul style={{ color: 'var(--color-text-muted)', listStyle: 'none', padding: 0, marginTop: 'var(--space-3)', display: 'grid', gap: 'var(--space-2)' }}>
              {THIS_IS.map((t) => (
                <li key={t}>✓ {t}</li>
              ))}
            </ul>
          </div>
          <div className="gallery__item" style={{ background: 'var(--color-surface-blue)', marginTop: 'var(--space-5)' }}>
            <p className="eyebrow">Avoid</p>
            <ul style={{ color: 'var(--color-text-muted)', listStyle: 'none', padding: 0, marginTop: 'var(--space-3)', display: 'grid', gap: 'var(--space-2)' }}>
              {THIS_IS_NOT.map((t) => (
                <li key={t}>✕ {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}