import { ButtonLink } from '../ui/Button';
import { Logo } from '../ui/Logo';

/**
 * Not-found shell. TanStack Router renders this for unmatched routes
 * (`notFoundMode: 'fuzzy'` catches partial matches too).
 */
export function NotFound() {
  return (
    <section className="not-found container section" style={{ textAlign: 'center' }}>
      <Logo size={48} tone="dark" />
      <h1 style={{ marginTop: 'var(--space-4)' }}>Page not found</h1>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: 360, marginInline: 'auto' }}>
        The orbit you’re looking for doesn’t exist. It may have moved, or the link
        may have a typo.
      </p>
      <div style={{ marginTop: 'var(--space-5)', display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
        <ButtonLink href="/" variant="primary">
          Back to Science Orbit Forum
        </ButtonLink>
        <ButtonLink href="/people" variant="secondary">
          Browse people
        </ButtonLink>
      </div>
    </section>
  );
}
