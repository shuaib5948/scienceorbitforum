import { Section, Swatch, contrastRatio, wcagLevel } from '../kit';

const BRAND = [
  { name: 'Primary · Deep Navy', hex: '#071A2F' },
  { name: 'Secondary · Scientific Blue', hex: '#1261A0' },
  { name: 'Accent · Cyan', hex: '#18B6D9' },
];

const BACKGROUNDS = [
  { name: 'Page · Off white', hex: '#F7F9FC' },
  { name: 'Navy surface', hex: '#0A1A33' },
  { name: 'Ink (dark hero)', hex: '#06101F' },
  { name: 'Card · White', hex: '#FFFFFF' },
  { name: 'Muted surface', hex: '#EEF3F8' },
  { name: 'Blue wash', hex: '#E3EEF8' },
  { name: 'Cyan wash', hex: '#EAF6FB' },
  { name: 'Border', hex: '#D9E1EA' },
];

const TEXT = [
  { name: 'Text · primary', hex: '#101820', on: '#FFFFFF' },
  { name: 'Text · muted', hex: '#44566B', on: '#FFFFFF' },
  { name: 'Text · faint', hex: '#7B8A9C', on: '#FFFFFF' },
  { name: 'Inverse', hex: '#F4F8FC', on: '#071A2F' },
  { name: 'Inverse muted', hex: '#B9C8D8', on: '#071A2F' },
];

const STATES = [
  { name: 'Primary hover', hex: '#0A1A2E' },
  { name: 'Primary active', hex: '#071425' },
  { name: 'Secondary hover', hex: '#0E4F86' },
  { name: 'Secondary active', hex: '#0B3F6C' },
  { name: 'Accent hover', hex: '#10A0C4' },
  { name: 'Accent active', hex: '#0C8FAE' },
  { name: 'Disabled bg', hex: '#D6DDE6' },
  { name: 'Disabled text', hex: '#9AA6B4' },
];

interface Pair {
  label: string;
  fg: string;
  bg: string;
}

const DESIGN_PAIRS: Pair[] = [
  { label: 'Body text on page', fg: '#101820', bg: '#F7F9FC' },
  { label: 'Body text on white', fg: '#101820', bg: '#FFFFFF' },
  { label: 'Muted text on white', fg: '#44566B', bg: '#FFFFFF' },
  { label: 'Inverse text on navy', fg: '#F4F8FC', bg: '#0A1A33' },
  { label: 'Inverse muted on navy', fg: '#B9C8D8', bg: '#0A1A33' },
  { label: 'Blue on white', fg: '#1261A0', bg: '#FFFFFF' },
  { label: 'Blue on page', fg: '#1261A0', bg: '#F7F9FC' },
  { label: 'Navy on cyan wash', fg: '#071A2F', bg: '#EAF6FB' },
  { label: 'White on blue (primary btn)', fg: '#FFFFFF', bg: '#1261A0' },
  { label: 'Navy on accent', fg: '#071A2F', bg: '#18B6D9' },
  { label: 'White on navy (navy btn)', fg: '#F4F8FC', bg: '#071A2F' },
  { label: 'Muted on cyan wash', fg: '#44566B', bg: '#EAF6FB' },
];

function ContrastCard({ pair }: { pair: Pair }) {
  const ratio = contrastRatio(pair.fg, pair.bg);
  const { level, pass } = wcagLevel(ratio);
  return (
    <div className="contrast-chip" style={{ backgroundColor: pair.bg, color: pair.fg }}>
      <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{pair.label}</div>
      <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
        {level} · {ratio.toFixed(2)}:1
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: pass ? '#2E7D32' : '#C62828' }}>{pass ? 'PASS' : 'CHECK'}</div>
    </div>
  );
}

/**
 * 02 · COLOUR SYSTEM
 */
export function ColorSection() {
  return (
    <Section
      id="colour"
      index="02"
      title="Colour system"
      lede="A restrained scientific palette: deep navy for authority, scientific blue for action, cyan for energy. Every text/background pairing below meets or exceeds WCAG AA. Gradients are used sparingly and only as subtle backgrounds."
    >
      <p className="eyebrow" style={{ marginTop: 'var(--space-7)' }}>Brand</p>
      <div className="swatch-row" style={{ marginTop: 'var(--space-4)' }}>
        {BRAND.map((c) => (
          <Swatch key={c.name} name={c.name} hex={c.hex} color={c.hex} />
        ))}
      </div>

      <p className="eyebrow" style={{ marginTop: 'var(--space-8)' }}>Background &amp; surfaces</p>
      <div className="swatch__grid" style={{ marginTop: 'var(--space-4)' }}>
        {BACKGROUNDS.map((c) => (
          <Swatch key={c.name} name={c.name} hex={c.hex} color={c.hex} />
        ))}
      </div>

      <p className="eyebrow" style={{ marginTop: 'var(--space-8)' }}>Text</p>
      <div className="swatch-row" style={{ marginTop: 'var(--space-4)' }}>
        {TEXT.map((c) => (
          <Swatch key={c.name} name={c.name} hex={c.hex} color={c.hex} />
        ))}
      </div>

      <p className="eyebrow" style={{ marginTop: 'var(--space-8)' }}>Interactive states</p>
      <div className="swatch__grid" style={{ marginTop: 'var(--space-4)' }}>
        {STATES.map((c) => (
          <Swatch key={c.name} name={c.name} hex={c.hex} color={c.hex} />
        ))}
      </div>

      <p className="eyebrow" style={{ marginTop: 'var(--space-8)' }}>Accessibility contrast</p>
      <div className="contrast-grid" style={{ marginTop: 'var(--space-4)' }}>
        {DESIGN_PAIRS.map((p) => (
          <ContrastCard key={p.label} pair={p} />
        ))}
      </div>
    </Section>
  );
}