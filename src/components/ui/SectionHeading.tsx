import type { ReactNode } from 'react';

export interface SectionHeadingProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
}

/** Section heading block: eyebrow + display title + optional lede. */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'left',
  tone = 'light',
  className = '',
}: SectionHeadingProps) {
  const classes = [
    'section-head',
    align === 'center' ? 'section-head--center' : '',
    tone === 'dark' ? 'section-head--on-dark' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {eyebrow && <span className={`eyebrow ${tone === 'dark' ? 'eyebrow--light' : ''} section-head__eyebrow`}>{eyebrow}</span>}
      <h2 className="section-head__title">{title}</h2>
      {lede && <p className="section-head__lede">{lede}</p>}
    </div>
  );
}