import { ButtonLink } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

/** Shared navy closing CTA ("Become part of the community…"). */
export function AboutCta() {
  return (
    <section
      className="section"
      style={{
        background: 'var(--color-bg-navy)',
        color: 'var(--color-text-inverse)',
        textAlign: 'center',
      }}
    >
      <div className="container">
        <Reveal>
          <h2 style={{ fontSize: 'var(--text-h2)' }}>
            Become part of the Science Orbit Forum community.
          </h2>
          <p
            style={{
              color: 'var(--color-text-inverse-muted)',
              maxWidth: 480,
              margin: 'var(--space-4) auto 0',
            }}
          >
            Join curious minds exploring science, research and innovation together.
          </p>
          <div style={{ marginTop: 'var(--space-6)' }}>
            <ButtonLink href="/join" variant="inverse" withArrow>
              Join Science Orbit Forum
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

