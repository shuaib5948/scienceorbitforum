import { Section } from '../kit';

const SCALE = [
  ['--space-1', 4],
  ['--space-2', 8],
  ['--space-3', 12],
  ['--space-4', 16],
  ['--space-5', 24],
  ['--space-6', 32],
  ['--space-7', 48],
  ['--space-8', 64],
  ['--space-9', 80],
  ['--space-10', 96],
  ['--space-11', 128],
  ['--space-12', 160],
] as const;

/**
 * 05 · SPACING SYSTEM
 */
export function SpacingSection() {
  return (
    <Section
      id="spacing"
      index="05"
      title="Spacing & whitespace"
      lede="A single 4px-based scale. Generous whitespace is a core part of the brand — the site should feel spacious and calm rather than dense. This scale is the only spacing vocabulary used across every layout."
    >
      <div className="gallery" style={{ marginTop: 'var(--space-7)' }}>
        <div className="gallery__item">
          <p className="eyebrow">Spacing scale (4 · base)</p>
          <div style={{ display: 'grid', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            {SCALE.map(([token, px]) => (
              <div key={token} className="space-line">
                <span style={{ width: 150, fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
                  {token}
                </span>
                <span style={{ width: 56, fontSize: 13, color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                  {px}px
                </span>
                <span className="space-line__bar" style={{ width: Math.max(px * 2.4, 8) }} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="gallery__item">
            <p className="eyebrow">Whitespace rules</p>
            <ul style={{ margin: 'var(--space-3) 0 0', color: 'var(--color-text-muted)', display: 'grid', gap: 'var(--space-2)', listStyle: 'none', padding: 0 }}>
              <li>• 64–96px between sections (mobile: 64px)</li>
              <li>• 24px around cards and grid gaps</li>
              <li>• 24px default between heading and body</li>
              <li>• 32px+ inside hero and featured panels</li>
              <li>• Prefer 4px multiples at all times</li>
            </ul>
          </div>
          <div className="gallery__item" style={{ marginTop: 'var(--space-5)', background: 'var(--color-surface-blue)' }}>
            <p className="eyebrow">Key paddings</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
              {[
                ['Section pad', '96 / 64'],
                ['Card inner', '24'],
                ['Button pad', '20 × 44'],
                ['Header pad', '16'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="token-card__value" style={{ fontSize: 'var(--text-body-large) ' }}>{v}</div>
                  <div className="token-card__label">{k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}