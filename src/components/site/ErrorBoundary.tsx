import type { ErrorComponentProps } from '@tanstack/react-router';
import { Button, ButtonLink } from '../ui/Button';

/**
 * Route error boundary. Catches thrown errors / loader failures for any route
 * that doesn't declare its own `errorComponent`.
 */
export function ErrorBoundary({ error, reset }: ErrorComponentProps) {
  const message =
    error instanceof Error ? error.message : 'Something went wrong while loading this page.';

  return (
    <section className="error-boundary container section">
      <h2>Something went wrong</h2>
      <p style={{ color: 'var(--color-text-muted)' }}>{message}</p>
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        {reset ? <Button onClick={reset}>Try again</Button> : null}
        <ButtonLink href="/" variant="secondary">
          Back to home
        </ButtonLink>
      </div>
    </section>
  );
}
