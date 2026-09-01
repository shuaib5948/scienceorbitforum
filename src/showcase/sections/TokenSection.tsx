import { Section } from '../kit';

const COVERAGE = [
  ['Colours', '--color-*'],
  ['Typography', '--font-*, --text-*, --leading-*, --tracking-*'],
  ['Spacing', '--space-1 … --space-12'],
  ['Border radius', '--radius-*'],
  ['Borders', '--border-*'],
  ['Shadows', '--shadow-*'],
  ['Grid & container', '--container-max, --gutter-*, --columns-*'],
  ['Button sizes', '--button-*'],
  ['Icon sizes', '--icon-*'],
  ['Motion', '--duration-*, --ease-*'],
];

const SNIPPET = `:root {
  --color-primary: #071a2f;     /* Deep Navy      */
  --color-secondary: #1261a0;   /* Scientific Blue */
  --color-accent: #18b6d9;      /* Cyan           */
  --color-bg: #f7f9fc;          /* Off white      */
  --color-text: #101820;
  --color-text-muted: #44566b;

  --font-display: 'Manrope', sans-serif;
  --font-body: 'Inter', sans-serif;
  --text-h2: 38px;
  --leading-h2: 1.12;

  --space-1: 4px;
  --space-5: 24px;
  --space-8: 64px;

  --radius-md: 10px;
  --radius-lg: 16px;

  --container-max: 1240px;
  --grid-gap: 24px;

  --button-height: 44px;
  --icon-lg: 24px;

  --duration-base: 250ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}`;

/**
 * 14 · DESIGN TOKENS
 */
export function TokenSection() {
  return (
    <Section
      id="tokens"
      index="14"
      title="Design tokens"
      lede="Every value in this system is a token — available as CSS custom properties and as machine-readable JSON. Production pages consume the same tokens this showcase uses, so the whole website stays consistent by construction."
    >
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: 'var(--space-6)', marginTop: 'var(--space-7)' }}>
        <div className="token-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {COVERAGE.map(([name, key]) => (
            <div key={name} className="token-card">
              <div className="token-card__value" style={{ fontSize: 'var(--text-body-large)' }}>{name}</div>
              <div className="token-card__label" style={{ fontFamily: 'var(--font-body)', fontSize: 12, marginTop: 4 }}>{key}</div>
            </div>
          ))}
        </div>

        <div className="gallery__item gallery__item--dark" style={{ background: '#0A1526', borderColor: 'rgb(244 248 252 / 0.12)' }}>
          <p className="eyebrow eyebrow--light">Sample · tokens.css</p>
          <pre
            style={{
              margin: 'var(--space-3) 0 0',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              lineHeight: 1.5,
              color: '#C8ECFB',
              overflow: 'auto',
              maxHeight: 460,
              whiteSpace: 'pre',
            }}
          >
            {SNIPPET}
          </pre>
        </div>
      </div>

      <div className="gallery__row" style={{ marginTop: 'var(--space-7)' }}>
        {['src/styles/tokens.css', 'src/tokens/design-tokens.json', 'src/tokens/index.ts'].map((f) => (
          <span key={f} className="tag tag--accent">{f}</span>
        ))}
      </div>
    </Section>
  );
}