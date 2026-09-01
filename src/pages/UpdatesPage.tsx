import { SectionHeading } from '../components/ui/SectionHeading';
import { ButtonLink } from '../components/ui/Button';
import { ArrowLink } from '../components/ui/Links';
import { Reveal } from '../components/ui/Reveal';
import { PageHero } from '../components/site/PageHero';
import { UpdateCard } from '../components/ui/UpdateCard';
import { Tag } from '../components/ui/Tags';
import { updates } from '../data/updates';

/** Editorial update categories, per the master prompt requirements. */
const CATEGORIES = [
  'Science',
  'Research',
  'Event Reports',
  'Announcements',
  'Student Achievements',
  'Activities',
  'Community Stories',
  'Science Awareness',
];

export default function UpdatesPage() {
  const featured = updates[0];
  const latest = updates.slice(1);
  const scienceResearch = updates.filter(u => u.tag === 'Science' || u.tag === 'Research');
  const eventReports = updates.filter(u => u.tag === 'Event Reports');
  const achievements = updates.filter(u => u.tag === 'Student Achievements');

  return (
    <>
      <PageHero
        eyebrow="Updates"
        title="Latest from Science Orbit Forum"
        lede="The official Science Orbit Forum editorial section — science, research, event reports, announcements, student achievements and community stories."
      />

      <section className="container section">
        <SectionHeading eyebrow="Featured" title="Featured story" />
        {featured ? (
          <article className="feature-wide" style={{ marginTop: 'var(--space-5)' }}>
            <div className="feature-wide__media">
              <img src={featured.cover} alt={featured.title} />
            </div>
            <div className="feature-wide__body">
              <span className="feature-wide__eyebrow">{featured.tag}</span>
              <h3 className="feature-wide__title">
                <a href={`/updates/${featured.slug}`}>{featured.title}</a>
              </h3>
              <div className="feature-wide__meta">
                <span>{new Date(featured.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                <span>by {featured.author}</span>
              </div>
              <p className="feature-wide__excerpt">{featured.excerpt}</p>
              <div className="feature-wide__footer">
                <a href={`/updates/${featured.slug}`} className="arrow-link">Read more →</a>
              </div>
            </div>
          </article>
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>No featured update at this time.</p>
        )}
      </section>

      <section className="container section" style={{ paddingTop: 0 }}>
        <SectionHeading eyebrow="Latest Updates" title="Recent stories" />
        {latest.length ? (
          <div className="page__grid page__grid--cards" style={{ marginTop: 'var(--space-5)' }}>
            {latest.map((u) => (
              <Reveal key={u.slug} as="article">
                <UpdateCard update={u} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>No recent updates at this time.</p>
        )}
      </section>

      {scienceResearch.length > 0 && (
        <section className="section" style={{ background: 'var(--color-surface-muted)' }}>
          <div className="container">
            <SectionHeading eyebrow="Science & Research" title="Research and scientific content" />
            <div className="page__grid page__grid--cards" style={{ marginTop: 'var(--space-5)' }}>
              {scienceResearch.slice(0, 3).map((u) => (
                <Reveal key={u.slug} as="article">
                  <UpdateCard update={u} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {eventReports.length > 0 && (
        <section className="container section">
          <SectionHeading eyebrow="Event Reports" title="Reports from Science Orbit Forum activities" />
          <div className="page__grid page__grid--cards" style={{ marginTop: 'var(--space-5)' }}>
            {eventReports.slice(0, 3).map((u) => (
              <Reveal key={u.slug} as="article">
                <UpdateCard update={u} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {achievements.length > 0 && (
        <section className="section" style={{ background: 'var(--color-surface-muted)' }}>
          <div className="container">
            <SectionHeading eyebrow="Achievements" title="Student and community achievements" />
            <div className="page__grid page__grid--cards" style={{ marginTop: 'var(--space-5)' }}>
              {achievements.slice(0, 3).map((u) => (
                <Reveal key={u.slug} as="article">
                  <UpdateCard update={u} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container section">
        <SectionHeading eyebrow="Browse by Category" title="Content categories" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-5)' }}>
          {CATEGORIES.map((c) => (
            <Tag key={c} variant="navy">{c}</Tag>
          ))}
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-bg-ink)', color: 'var(--color-text-inverse)', textAlign: 'center' }}>
        <div className="container">
          <Reveal>
            <h2 style={{ fontSize: 'var(--text-h2)' }}>Stay updated with Science Orbit Forum.</h2>
            <p style={{ color: 'var(--color-text-inverse-muted)', maxWidth: 480, margin: 'var(--space-4) auto 0' }}>
              Join the community to receive updates on events, programmes and activities.
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
