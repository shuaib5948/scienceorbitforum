import type { ReactNode } from 'react';

/* ---------------------------------------------------------------------------
   WCAG relative-luminance + contrast helpers (colour section)
   -------------------------------------------------------------------------- */
function clampByte(v: number): number {
  return Math.min(255, Math.max(0, v));
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast ratio between two hex colours (1–21). */
export function contrastRatio(a: string, b: string): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export function wcagLevel(ratio: number): { level: string; pass: boolean } {
  if (ratio >= 7) return { level: 'AAA', pass: true };
  if (ratio >= 4.5) return { level: 'AA', pass: true };
  if (ratio >= 3) return { level: 'AA·large', pass: true };
  return { level: 'Fail', pass: false };
}

/* ---------------------------------------------------------------------------
   Swatch
   --------------------------------------------------------------------------- */

export interface SwatchProps {
  color: string;
  name: string;
  hex?: string;
  tone?: 'light' | 'dark';
}

export function Swatch({ color, name, hex, tone = 'light' }: SwatchProps) {
  const labelHex = (hex ?? color).toUpperCase();
  const labelColor = tone === 'light' ? '#101820' : '#F4F8FC';
  return (
    <div className="swatch">
      <div className="swatch__chip" style={{ backgroundColor: color }} />
      <div style={{ padding: 'var(--space-3) var(--space-4)' }}>
        <div className="swatch__name" style={{ color: labelColor }}>
          {name}
        </div>
        <div className="swatch__hex" style={{ color: tone === 'light' ? 'var(--color-text-muted)' : 'var(--color-text-inverse-muted)' }}>
          {labelHex}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Section shell + head
   -------------------------------------------------------------------------- */
export interface SectionProps {
  id?: string;
  index: string;
  title: string;
  lede?: string;
  tone?: 'light' | 'dark';
  alt?: boolean;
  children: ReactNode;
  className?: string;
}

export function Section({ id, index, title, lede, tone = 'light', alt = false, children, className = '' }: SectionProps) {
  const classes = [
    'ds-section',
    alt ? 'ds-section--alt' : '',
    tone === 'dark' ? 'ds-section--dark' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const titleColor = tone === 'dark' ? '#fff' : 'var(--color-text)';
  const ledeColor = tone === 'dark' ? 'var(--color-text-inverse-muted)' : 'var(--color-text-muted)';

  return (
    <section id={id} className={classes}>
      <div className="container">
        <div className="ds-section__head">
          <span className="ds-section__index">{index}</span>
          <h2 className="ds-section__title" style={{ color: titleColor }}>
            {title}
          </h2>
        </div>
        {lede && (
          <p className="ds-section__lede" style={{ color: ledeColor }}>
            {lede}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

export interface TypeLineProps {
  label: string;
  meta?: string;
  children: ReactNode;
}

export function TypeLine({ label, meta, children }: TypeLineProps) {
  return (
    <div className="type-line">
      <div>
        <div className="type-line__label">{label}</div>
        {meta && <div className="type-line__label" style={{ color: 'var(--color-text-faint)' }}>{meta}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

export const ROW = { display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'center' } as const;