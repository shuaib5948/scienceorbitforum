import { Section } from '../kit';

const BREAKPOINTS = [
  { name: 'Mobile', cols: 4, range: '< 640px', note: 'Single-column content, stacked cards' },
  { name: 'Tablet', cols: 8, range: '640 – 1024px', note: 'Two-column layouts, nav collapses' },
  { name: 'Desktop', cols: 12, range: '1024px +', note: 'Full 12-column editorial grid' },
];

/**
 * 06 · GRID SYSTEM
 */
export function GridSection() {
  return (
    <Section
      id="grid"
      index="06"
      title="Grid system"
      lede="A responsive 12 / 8 / 4 column grid. Maximum content width 1240px, 24px column gaps, 16–24px page gutters. A visible but quiet editorial spine for every page."
    >
      <div className="bp-holder" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-5)', marginTop: 'var(--space-7)' }}>
        {BREAKPOINTS.map((b) => (
          <div key={b.name} className="bp-chip">
            <div className="bp-chip__name">{b.name}</div>
            <div className="bp-chip__range">{b.cols} columns · {b.range}</div>
            <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>{b.note}</div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${b.cols}, 1fr)`, gap: 6, marginTop: 'var(--space-2)' }}>
              {Array.from({ length: b.cols }).map((_, i) => (
                <span key={i} style={{ height: 24, background: 'var(--color-surface-blue)', borderRadius: 3 }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="gallery" style={{ marginTop: 'var(--space-7)' }}>
        <div className="gallery__item">
          <p className="eyebrow">Desktop · 12 columns</p>
          <div className="grid-demo-12" style={{ marginTop: 'var(--space-3)' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="grid-cell" />
            ))}
          </div>
          <p className="type-line__label" style={{ marginTop: 'var(--space-3)' }}>
            Gap 24px · max-width 1240px · gutters 24px
          </p>
        </div>
        <div className="gallery__item">
          <p className="eyebrow">Container & gutters</p>
          <div style={{ marginTop: 'var(--space-4)', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 'var(--space-3)' }}>
            {[
              ['Max content width', '1240px'],
              ['Grid column gap', '24px'],
              ['Page gutter · desktop', '24px'],
              ['Page gutter · tablet', '20px'],
              ['Page gutter · mobile', '16px'],
              ['Card gap', '24px'],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="token-card__value" style={{ fontSize: 'var(--text-body-large)' }}>{v}</div>
                <div className="token-card__label">{k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}