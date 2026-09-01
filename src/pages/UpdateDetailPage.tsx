import { useParams, Link } from '@tanstack/react-router';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ButtonLink } from '../components/ui/Button';
import { Breadcrumbs, DateLabel, CategoryLabel } from '../components/ui/Labels';
import { Tag } from '../components/ui/Tags';
import { ImageFrame } from '../components/ui/ImageFrame';
import { Reveal } from '../components/ui/Reveal';
import { updates } from '../data/updates';
import { events } from '../data/events';
import { formatDate } from '../lib/dates';

/** Dynamic update detail page: /updates/[slug] */
export default function UpdateDetailPage() {
  const params = useParams({ strict: false }) as { updateSlug: string };
  const item = updates.find((u) => u.slug === params.updateSlug);
  const relatedUpdates = updates.filter((u) => u.slug !== item?.slug && u.tag === item?.tag).slice(0, 3);
  const relatedEvent = events.find((e) => e.tag === item?.tag);

  if (!item) {
    return (
      <section className="container section" style={{ textAlign: 'center' }}>
        <h2>Update not found</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>This article may have been removed or the link may be incomplete.</p>
        <ButtonLink href="/updates" variant="primary">Back to updates</ButtonLink>
      </section>
    );
  }

  return (
    <>
      <section className="container section">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Updates', href: '/updates' }, { label: item.title }]} />
      </section>

      <section className="container section" style={{ maxWidth: 860, paddingTop: 0 }}>
        <Reveal>
          <Tag variant="accent">{item.tag}</Tag>
          <h1 style={{ fontSize: 'var(--text-h1)', lineHeight: 'var(--leading-h1)', marginTop: 'var(--space-4)' }}>{item.title}</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-3)', fontSize: 'var(--text-body-large)' }}>
            <DateLabel date={formatDate(item.date)} />
            {item.author && <span style={{ margin: '0 12px', color: 'var(--color-border-strong)' }}>•</span>}
            {item.author && <span>By {item.author}</span>}
          </p>
        </Reveal>
      </section>

      {item.cover && (
        <section className="container section" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <Reveal>
              <ImageFrame src={item.cover} alt={item.title} ratio="16/9" />
            </Reveal>
          </div>
        </section>
      )}

      <section className="container section">
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontSize: 'var(--text-body-large)', color: 'var(--color-text)', lineHeight: 1.7, marginTop: 'var(--space-4)' }}>{item.excerpt}</p>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginTop: 'var(--space-4)' }}>
              This is the editorial reading experience for Science Orbit Forum updates. The full article content, additional images, media and related materials will be added as the content library grows.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-surface-muted)' }}>
        <div className="container">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <SectionHeading eyebrow="Article Content" title="Full article" />
            <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>
              The complete article body will be populated with rich content including text, images, quotes, and embedded media as Science Orbit Forum continues to publish updates.
            </p>
          </div>
        </div>
      </section>

      {relatedEvent && (
        <section className="container section">
          <SectionHeading eyebrow="Related Event" title="Event related to this update" />
          <div style={{ maxWidth: 720, marginTop: 'var(--space-5)' }}>
            <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <Tag variant="accent">{relatedEvent.tag}</Tag>
              <h4 style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-h4)' }}>{relatedEvent.title}</h4>
              <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)', fontSize: 'var(--text-body-small)' }}>{relatedEvent.excerpt}</p>
              <Link to={`/events/${relatedEvent.slug}`} style={{ color: 'var(--color-secondary)', fontSize: 'var(--text-body-small)', fontWeight: 600, marginTop: 'var(--space-3)', display: 'inline-block' }}>
                View event →
              </Link>
            </div>
          </div>
        </section>
      )}

      {relatedUpdates.length > 0 && (
        <section className="section" style={{ background: 'var(--color-surface-muted)' }}>
          <div className="container">
            <SectionHeading eyebrow="Related Updates" title="More stories you may be interested in" />
            <div className="page__grid page__grid--cards" style={{ marginTop: 'var(--space-5)' }}>
              {relatedUpdates.map((u) => (
                <Reveal key={u.slug} as="article">
                  <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <Tag variant="navy">{u.tag}</Tag>
                    <h4 style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-h4)' }}>{u.title}</h4>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)', fontSize: 'var(--text-body-small)' }}>{u.excerpt}</p>
                    <Link to={`/updates/${u.slug}`} style={{ color: 'var(--color-secondary)', fontSize: 'var(--text-body-small)', fontWeight: 600, marginTop: 'var(--space-3)', display: 'inline-block' }}>
                      Read more →
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container section" style={{ textAlign: 'center' }}>
        <Reveal>
          <h2 style={{ fontSize: 'var(--text-h2)' }}>Stay informed about Science Orbit Forum.</h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: 480, margin: 'var(--space-4) auto 0' }}>
            Join the community to receive updates on events, programmes and activities.
          </p>
          <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <ButtonLink href="/join" withArrow>Join Science Orbit Forum</ButtonLink>
            <Link to="/updates" className="btn btn--secondary">← Back to updates</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}