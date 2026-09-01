import type { ReactNode } from 'react';

export type CardVariant = 'default' | 'event' | 'update' | 'research' | 'image' | 'featured';

export interface CardProps {
  variant?: CardVariant;
  eyebrow?: ReactNode;
  title?: ReactNode;
  text?: ReactNode;
  meta?: ReactNode;
  footer?: ReactNode;
  media?: ReactNode;
  className?: string;
}

/**
 * Editorial card. Moderate corner radius, subtle border, generous inner
 * spacing. Feels like an academic publication card, not a SaaS dashboard.
 */
export function Card({
  variant = 'default',
  eyebrow,
  title,
  text,
  meta,
  footer,
  media,
  className = '',
}: CardProps) {
  const variantClass = variant === 'default' ? '' : ` card--${variant}`;

  return (
    <article className={`card${variantClass} ${className}`.trim()}>
      {media && <figure className="card__media">{media}</figure>}
      <div className="card__body">
        {eyebrow && <div className="card__eyebrow">{eyebrow}</div>}
        {title && <h4 className="card__title">{title}</h4>}
        {text && <p className="card__text">{text}</p>}
        {meta && <div className="card__meta">{meta}</div>}
        {footer && <div className="card__footer">{footer}</div>}
      </div>
    </article>
  );
}