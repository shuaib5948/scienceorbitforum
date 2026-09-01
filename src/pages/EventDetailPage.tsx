import { useParams, Link } from '@tanstack/react-router';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ButtonLink } from '../components/ui/Button';
import { Breadcrumbs, DateLabel, CategoryLabel } from '../components/ui/Labels';
import { Tag } from '../components/ui/Tags';
import { ImageFrame } from '../components/ui/ImageFrame';
import { Reveal } from '../components/ui/Reveal';
import { events } from '../data/events';
import { updates } from '../data/updates';
import { formatDateRange } from '../lib/dates';

/** Dynamic event detail page: /events/[slug] */
export default function EventDetailPage() {
  const params = useParams({ strict: false }) as { eventSlug: string };
  const eventSlug = params.eventSlug;
  const item = events.find((e) => e.slug === eventSlug);
  const relatedUpdates = updates.filter((u) => u.tag === item?.tag).slice(0, 3);
  const relatedEvents = events.filter((e) => e.id !== item?.id && e.tag === item?.tag).slice(0, 3);

  if (!item) {
    return (
      <section className="container section" style={{ textAlign: 'center' }}>
        <h2>Event not found</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>
          This event may have been removed or the link may be incomplete.
        </p>
        <ButtonLink href="/events" variant="primary">Back to events</ButtonLink>
      </section>
    );
  }

  return (
    <>
      <section className="container section">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Events', href: '/events' }, { label: item.title }]} />
      </section>

      <section className="container section" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <Reveal>
            <Tag variant="accent">{item.tag}</Tag>
            <h1 style={{ fontSize: 'var(--text-h1)', lineHeight: 'var(--leading-h1)', marginTop: 'var(--space-4)' }}>{item.title}</h1>
            <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-3)', fontSize: 'var(--text-body-large)' }}>
              <DateLabel date={formatDateRange(item.date, item.endDate)} />
              <span style={{ margin: '0 12px', color: 'var(--color-border-strong)' }}>•</span>
              {item.location}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container section" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <Reveal>
            <ImageFrame src={item.image} alt={item.title} ratio="16/9" />
          </Reveal>
        </div>
      </section>

      <section className="container section">
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <SectionHeading eyebrow="About the Event" title={item.title} />
          <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-4)', lineHeight: 1.7 }}>{item.excerpt}</p>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-4)', lineHeight: 1.7 }}>
            This event brings together students, researchers, educators and science enthusiasts to explore ideas, share knowledge and participate in activities that inspire scientific curiosity and innovation.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-surface-muted)' }}>
        <div className="container">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <SectionHeading eyebrow="Event Details" title="Practical information" />
            <div style={{ display: 'grid', gap: 'var(--space-4)', marginTop: 'var(--space-5)' }}>
              {[
                ['Date & Time', formatDateRange(item.date, item.endDate)],
                ['Location', item.location],
                ['Category', item.tag],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'baseline', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
                  <CategoryLabel>{k}</CategoryLabel>
                  <span style={{ color: 'var(--color-text)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <SectionHeading eyebrow="Programme" title="Schedule & Activities" />
          <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>
            The detailed programme, schedule and activities for this event will be announced closer to the event date. Check back for updates on sessions, workshops, presentations and interactive activities.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-surface-muted)' }}>
        <div className="container">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <SectionHeading eyebrow="Speakers & Guests" title="Featured speakers and guests" />
            <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>
              Information about speakers, guests and facilitators will be shared as the event programme is finalized.
            </p>
          </div>
        </div>
      </section>

      <section className="container section">
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <SectionHeading eyebrow="Highlights" title="Event highlights" />
          <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>
            Highlights, photos and documentation from this event will be shared after the event concludes.
          </p>
        </div>
      </section>

      {relatedUpdates.length > 0 && (
        <section className="section" style={{ background: 'var(--color-surface-muted)' }}>
          <div className="container">
            <SectionHeading eyebrow="Related Updates" title="Event reports and coverage" />
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

      {relatedEvents.length > 0 && (
        <section className="container section">
          <SectionHeading eyebrow="Related Events" title="Other programmes you may be interested in" />
          <div className="page__grid page__grid--cards" style={{ marginTop: 'var(--space-5)' }}>
            {relatedEvents.map((e) => (
              <Reveal key={e.id} as="article">
                <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <Tag variant="accent">{e.tag}</Tag>
                  <h4 style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-h4)' }}>{e.title}</h4>
                  <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)', fontSize: 'var(--text-body-small)' }}>{formatDateRange(e.date, e.endDate)}</p>
                  <Link to={`/events/${e.slug}`} style={{ color: 'var(--color-secondary)', fontSize: 'var(--text-body-small)', fontWeight: 600, marginTop: 'var(--space-3)', display: 'inline-block' }}>
                    View event →
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="container section" style={{ textAlign: 'center' }}>
        <Reveal>
          <h2 style={{ fontSize: 'var(--text-h2)' }}>Interested in participating?</h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: 480, margin: 'var(--space-4) auto 0' }}>
            Join Science Orbit Forum to stay informed about upcoming events and programmes.
          </p>
          <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <ButtonLink href="/join" withArrow>Join Science Orbit Forum</ButtonLink>
            <Link to="/events" className="btn btn--secondary">← Back to events</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}