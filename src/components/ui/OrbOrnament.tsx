import type { CSSProperties, ReactNode } from 'react';

export interface OrbOrnamentProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Subtle decorative orbital field — two slowly rotating rings, a few dots
 * and a scientific dot-grid. Used only as a faint background texture for
 * heroes and dark sections. Respects reduced-motion via base.css.
 */
export function OrbOrnament({ children, className = '', style }: OrbOrnamentProps) {
  return (
    <div className={`orb-field ${className}`.trim()} style={style} aria-hidden>
      <div className="orb-ring" />
      <div className="orb-ring--accent" />
      <span className="orb-dot" style={{ top: '18%', right: '22%' }} />
      <span className="orb-dot--soft" style={{ bottom: '20%', left: '18%' }} />
      <div className="orb-grid" />
      {children}
    </div>
  );
}