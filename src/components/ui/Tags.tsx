import type { ReactNode } from 'react';

export interface TagProps {
  children: ReactNode;
  variant?: 'default' | 'accent' | 'navy';
  className?: string;
}

/** Pill tag for disciplines, topics and categories. */
export function Tag({ children, variant = 'default', className = '' }: TagProps) {
  const mod = variant !== 'default' ? ` tag--${variant}` : '';
  return <span className={`tag${mod} ${className}`.trim()}>{children}</span>;
}

export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'outline' | 'accent' | 'light';
  className?: string;
}

/** Small uppercase status / context badge. */
export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const mod = variant !== 'default' ? ` badge--${variant}` : '';
  return <span className={`badge${mod} ${className}`.trim()}>{children}</span>;
}