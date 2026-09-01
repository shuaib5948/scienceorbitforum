import type { CSSProperties } from 'react';

const logoImage = new URL('../../../logo.png', import.meta.url).href;

export type LogoMarkTone = 'light' | 'dark';

export interface LogoMarkProps {
  size?: number;
  tone?: LogoMarkTone;
  className?: string;
}

/**
 * Science Orbit mark — geometric orbital symbol.
 * Uses the logo.png asset for consistent branding.
 */
export function LogoMark({ size = 40, tone = 'light', className = '' }: LogoMarkProps) {
  return (
    <img
      src={logoImage}
      alt="Science Orbit mark"
      width={size}
      height={size}
      className={`brand__mark ${className}`.trim()}
      style={{ display: 'block' }}
    />
  );
}

export interface LogoProps {
  tone?: LogoMarkTone;
  layout?: 'horizontal' | 'icon' | 'stacked';
  size?: number;
  className?: string;
  style?: CSSProperties;
  department?: string;
}

/**
 * Science Orbit wordmark lockup.
 *
 * - `horizontal` : mark beside "SCIENCE ORBIT" in single color
 * - `icon`       : the mark alone (favicon / avatar / compact contexts)
 * - `stacked`    : mark above the wordmark
 */
export function Logo({
  tone = 'light',
  layout = 'horizontal',
  size = 40,
  className = '',
  style,
  department = '(none)',
}: LogoProps) {
  const onDark = tone === 'dark';

  return (
    <span
      className={`brand ${layout === 'stacked' ? 'brand--stacked' : ''} ${onDark ? 'brand--on-dark' : ''} ${className}`.trim()}
      style={style}
    >
      <LogoMark size={layout === 'icon' ? size : size} tone={tone} />
      {layout !== 'icon' && (
        <span className="brand__word">
          <span className="brand__title">SCIENCE ORBIT FORUM</span>
        </span>
      )}
    </span>
  );
}