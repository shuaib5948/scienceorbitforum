import { SectionHeading } from '../components/ui/SectionHeading';
import { ButtonLink } from '../components/ui/Button';
import { ArrowLink } from '../components/ui/Links';
import { Tag } from '../components/ui/Tags';
import { Reveal } from '../components/ui/Reveal';
import { EventCard } from '../components/ui/EventCard';
import { PageHero } from '../components/site/PageHero';
import { events } from '../data/events';

/** Event categories, per the master prompt requirements. */
const CATEGORIES = [
  'Conclave',
  'Science Festival',
  'Workshop',
  'Exhibition',
  'Academic Talk',
  'Competition',
  'Model UN COPUOS',
  'Student Programme',
  'Research Presentation',
  'Public Science Programme',
];

export default function EventsPage() {
  const featured = events.find((e) => e.featured);
  const others = events.filter((e) => e !== featured);

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Explore Science Orbit Forum Events"
        lede="Discover programmes, gatherings and activities designed to explore ideas, share knowledge and inspire scientific curiosity."
      />

      <section className="container section">
        <SectionHeading eyebrow="Featured Event" title="Flagship programme" />
        {featured ? (
          <article className="feature-wide" style={{ marginTop: 'var(--space-5)' }}>
            <div className="feature-wide__media">
              <img src={featured.image} alt={featured.title} />
            </div>
            <div className="feature-wide__body">
              <span className="feature-wide__eyebrow">{featured.tag}</span>
              <h3 className="feature-wide__title">
                <a href={`/events/${featured.slug}`}>{featured.title}</a>
              </h3>
              <div className="feature-wide__meta">
                <span>{new Date(featured.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                <span>{featured.location}</span>
              </div>
              <p className="feature-wide__excerpt">{featured.excerpt}</p>
              <div className="feature-wide__footer">
                <a href={`/events/${featured.slug}`} className="arrow-link">Event details →</a>
              </div>
            </div>
          </article>
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>No featured event at this time.</p>
        )}
      </section>

      <section className="container section" style={{ paddingTop: 0 }}>
        <SectionHeading eyebrow="Upcoming Events" title="Upcoming programmes" />
        {others.length ? (
          <div className="page__grid page__grid--cards" style={{ marginTop: 'var(--space-5)' }}>
            {others.map((e) => (
              <Reveal key={e.id} as="article">
                <EventCard event={e} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>No upcoming events scheduled at this time.</p>
        )}
      </section>

      <section className="section" style={{ background: 'var(--color-surface-muted)' }}>
        <div className="container">
          <SectionHeading eyebrow="Event Categories" title="Types of programmes" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-5)' }}>
            {CATEGORIES.map((c) => (
              <Tag key={c} variant="navy">{c}</Tag>
            ))}
          </div>
        </div>
      </section>

      <section className="container section">
        <SectionHeading eyebrow="Past Events" title="Previous activities" />
        <p style={{ color: 'var(--color-text-muted)', maxWidth: 560, marginTop: 'var(--space-3)' }}>
          Past events, highlights and archives will be added as Science Orbit Forum continues its journey. Event reports and documentation can be found in the Updates section.
        </p>
        <div style={{ marginTop: 'var(--space-4)' }}>
          <ArrowLink href="/updates">See event reports in Updates →</ArrowLink>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-bg-navy)', color: 'var(--color-text-inverse)', textAlign: 'center' }}>
        <div className="container">
          <Reveal>
            <h2 style={{ fontSize: 'var(--text-h2)' }}>Join us at our next event.</h2>
            <p style={{ color: 'var(--color-text-inverse-muted)', maxWidth: 480, margin: 'var(--space-4) auto 0' }}>
              Become part of Science Orbit Forum and participate in our programmes.
            </p>
            <div style={{ marginTop: 'var(--space-6)' }}>
              <ButtonLink href="/join" variant="inverse" withArrow>Join Science Orbit Forum</ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
