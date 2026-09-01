import type { ReactNode } from 'react';

export interface DividerProps {
  variant?: 'default' | 'strong' | 'gradient';
  className?: string;
}

/** Horizontal rule variants. */
export function Divider({ variant = 'default', className = '' }: DividerProps) {
  const mod = variant !== 'default' ? ` divider--${variant}` : '';
  return <hr className={`divider${mod} ${className}`.trim()} />;
}

export interface BreadcrumbsProps {
  items: Array<{ label: string; href?: string }>;
  className?: string;
}

/** Breadcrumb trail: Home › Section › Current */
export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`breadcrumbs ${className}`.trim()}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={item.label} className="breadcrumbs__item">
            {last ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <>
                <a className="breadcrumbs__link" href={item.href ?? '#'}>
                  {item.label}
                </a>
                <span className="breadcrumbs__sep" aria-hidden>
                  &nbsp;›&nbsp;
                </span>
              </>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export interface DateLabelProps {
  date: string;
  dot?: boolean;
  className?: string;
}

/** Uniform date label used on events and updates. */
export function DateLabel({ date, dot = true, className = '' }: DateLabelProps) {
  return (
    <span className={`date-label ${className}`.trim()}>
      {dot && <span className="date-label__dot" aria-hidden />}
      {date}
    </span>
  );
}

export interface CategoryLabelProps {
  children: ReactNode;
  className?: string;
}

/** Category marker with a rotated diamond bullet. */
export function CategoryLabel({ children, className = '' }: CategoryLabelProps) {
  return <span className={`category-label ${className}`.trim()}>{children}</span>;
}