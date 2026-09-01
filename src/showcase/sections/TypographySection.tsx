import { Section, TypeLine } from '../kit';

/**
 * 03 · TYPOGRAPHY SYSTEM
 */
export function TypographySection() {
  const S = {
    margin: 0,
  };

  return (
    <Section
      id="typography"
      index="03"
      title="Typography"
      lede="Two families only — Manrope for display and headings, Inter for body and UI. Strong presence in large headings without appearing aggressive; confident, clean and academic."
    >
      <div className="gallery" style={{ marginTop: 'var(--space-7)' }}>
        <div className="gallery__item">
          <p className="eyebrow">Display / Headings</p>
          <p className="type-line__label" style={{ marginTop: 'var(--space-3)' }}>
            Manrope · 400–800 · loaded from Google Fonts
          </p>
          <div style={{ marginTop: 'var(--space-3)', fontFamily: 'var(--font-display)' }}>
            <div style={{ ...S, fontSize: 'var(--text-h4)', fontWeight: 700, color: 'var(--color-text)' }}>H4 · Discipline &amp; laboratory methods</div>
            <div style={{ ...S, fontSize: 'var(--text-h3)', fontWeight: 600, color: 'var(--color-text)', marginTop: 'var(--space-3)' }}>H3 · Where experiments become ideas</div>
            <div style={{ ...S, fontSize: 'var(--text-h2)', fontWeight: 700, letterSpacing: '-0.015em', color: 'var(--color-text)', marginTop: 'var(--space-3)' }}>H2 · Curiosity, rigorously pursued</div>
            <div style={{ ...S, fontSize: 'var(--text-h1)', fontWeight: 700, letterSpacing: '-0.018em', lineHeight: 1.06, color: 'var(--color-text)', marginTop: 'var(--space-4)' }}>H1 · Science made visible.</div>
            <div style={{ ...S, fontSize: 'var(--text-display)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.02, color: 'var(--color-text)', marginTop: 'var(--space-5)' }}>Orbit.</div>
          </div>
        </div>

        <div className="gallery__item">
          <p className="eyebrow">Body &amp; UI</p>
          <p className="type-line__label" style={{ marginTop: 'var(--space-3)' }}>
            Inter · 400–700 · body, captions, navigation
          </p>
          <div style={{ marginTop: 'var(--space-3)', fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
            <p style={{ ...S, fontSize: 'var(--text-body-large)', lineHeight: 1.55 }}>
              Body Large · Students across the campus collaborate on exhibitions, workshops, projects and
              research discussions.
            </p>
            <p style={{ ...S, fontSize: 'var(--text-body)', lineHeight: 1.6, marginTop: 'var(--space-3)' }}>
              Body · The forum conducts academic programmes, science exhibitions and competitions that turn
              scientific curiosity into shared discovery.
            </p>
            <p style={{ ...S, fontSize: 'var(--text-body-small)', lineHeight: 1.5, color: 'var(--color-text-muted)', marginTop: 'var(--space-3)' }}>
              Body Small · Secondary metadata, supportive paragraphs and list content.
            </p>
            <p style={{ ...S, fontSize: 'var(--text-caption)', lineHeight: 1.4, color: 'var(--color-text-muted)', marginTop: 'var(--space-3)' }}>
              Caption · Captions, footnotes, legal and fine print.
            </p>
          </div>

          <div className="divider" />

          <div className="gallery__row" style={{ justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 500, color: 'var(--color-text)', letterSpacing: '0.01em' }}>
              Navigation · About
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--color-text)', letterSpacing: '0.01em' }}>
              Button · 15 / 600
            </span>
            <span className="eyebrow">Eyebrow · 11 / 600 · +12%</span>
          </div>
        </div>
      </div>

      <div className="token-grid" style={{ marginTop: 'var(--space-8)', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          ['Manrope', 'Display, headings, buttons, nav'],
          ['Inter', 'Body, captions, meta, UI'],
          ['2', 'Total font families — never more'],
          ['400–800', 'Single variable range per family'],
        ].map(([v, l]) => (
          <div key={l} className="token-card">
            <div className="token-card__value">{v}</div>
            <div className="token-card__label">{l}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}