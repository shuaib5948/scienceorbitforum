import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'navy' | 'secondary' | 'ghost' | 'inverse';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  withArrow?: boolean;
  children: ReactNode;
  className?: string;
}

export interface ButtonProps
  extends CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {}

export interface ButtonLinkProps
  extends CommonProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  href: string;
}

function classes(variant: ButtonVariant, size: ButtonSize, extra?: string): string {
  return ['btn', `btn--${variant}`, size !== 'md' ? `btn--${size}` : '', extra ?? '']
    .filter(Boolean)
    .join(' ');
}

const Arrow = () => <span className="btn__arrow" aria-hidden>→</span>;

export function Button({
  variant = 'primary',
  size = 'md',
  withArrow = false,
  children,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={classes(variant, size, className)} {...rest}>
      {children}
      {withArrow && <Arrow />}
    </button>
  );
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  withArrow = false,
  children,
  className,
  href,
  ...rest
}: ButtonLinkProps) {
  return (
    <a href={href} className={classes(variant, size, className)} {...rest}>
      {children}
      {withArrow && <Arrow />}
    </a>
  );
}