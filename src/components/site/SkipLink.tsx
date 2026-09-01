/**
 * Science Orbit Forum — skip link (Phase 2). Renders first in the DOM so
 * keyboard users can jump past the navigation.
 */
export interface SkipLinkProps {
  target?: string;
  label?: string;
}

export function SkipLink({ target = '#main', label = 'Skip to main content' }: SkipLinkProps) {
  return (
    <a href={target} className="skip-link">
      {label}
    </a>
  );
}
