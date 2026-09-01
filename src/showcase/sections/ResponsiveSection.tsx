import { Section } from '../kit';

const BPS = [
  {
    name: 'Mobile',
    cols: 4,
    range: '< 640px',
    rules: [
      'Single column content',
      '4-column grid',
      '16px gutters',
      'Nav collapses to drawer',
      'Section padding 64px',
    ],
  },
  {
    name: 'Tablet',
    cols: 8,
    range: '640 – 1024px',
    rules: [
      '8-column grid',
      '20px gutters',
      'Two-column card grids',
      'Footer → 2 columns',
    ],
  },
  {
    name: 'Desktop',
    cols: 12,
    range: '1024px +',
    rules: [
      '12-column grid',
      '24px gutters',
      'Max width 1240px',
      'Full editorial layout',
    ],
  },
];

/**
 * 12 · RESPONSIVE RULES
 */
export function ResponsiveSection() {
  return (
    <Section
      id="responsive"
      index="12"
      title="Responsive rules"
      lede="The grid scales 12 → 8 → 4 columns. This entire showcase is responsive — resize the window to see the grid, cards, header and navigation adapt. No fixed pixel widths at component level; everything flows from tokens."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-5)', marginTop: 'var(--space-7)' }}>
        {BPS.map((b) => (
          <div key={b.name} className="bp-chip">
            <div className="bp-chip__name">{b.name}</div>
            <div className="bp-chip__range">{b.cols} columns · {b.range}</div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${b.cols}, 1fr)`, gap: 6, marginTop: 'var(--space-3)' }}>
              {Array.from({ length: b.cols }).map((_, i) => (
                <span key={i} style={{ height: 30, background: 'var(--color-surface-blue)', borderRadius: 4 }} />
              ))}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-3) 0 0', color: 'var(--color-text-muted)', display: 'grid', gap: 'var(--space-2)', fontSize: 'var(--text-body-small)' }}>
              {b.rules.map((r) => (
                <li key={r}>• {r}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="gallery__item" style={{ marginTop: 'var(--space-6)' }}>
        <p className="eyebrow">Header & navigation behaviour</p>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-3)', maxWidth: 720, fontSize: 'var(--text-body)' }}>
          Desktop shows the full inline navigation with a compact “Explore Events” call-to-action. Below 1024px the inline
          nav collapses to a left slide-in drawer with a press backdrop and full-width CTA. The sticky header keeps a
          frosted-glass blur and 1px bottom border at every size.
        </p>
      </div>
    </Section>
  );
}