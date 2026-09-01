import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import type { Update } from '../../types';

interface LatestUpdatesProps {
  updates: Update[];
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function LatestUpdates({ updates }: LatestUpdatesProps) {
  const displayUpdates = updates.slice(0, 3);

  return (
    <section className="section home-news">
      <div className="container">
        <SectionHeading
          eyebrow="Latest News"
          title="Latest News"
          lede="Discover the latest programmes, activities, achievements and announcements from Science Orbit Forum."
        />

        <div className="home-news__track" style={{ marginTop: 'var(--space-6)' }}>
          {displayUpdates.map((update) => (
            <Reveal key={update.slug} as="article" className="home-news__item">
              <a href={`/updates/${update.slug}`} className="home-news__card" aria-label={`Read more about ${update.title}`}>
                <div className="home-news__media">
                  {update.cover ? (
                    <img src={update.cover} alt={update.title} loading="lazy" />
                  ) : (
                    <div className="home-news__media-fallback" aria-hidden />
                  )}
                </div>

                <div className="home-news__body">
                  <span className="home-news__eyebrow">{update.tag}</span>
                  <h3 className="home-news__title">{update.title}</h3>
                  <p className="home-news__excerpt">{update.excerpt}</p>

                  <div className="home-news__meta">
                    <span>{formatDate(update.date)}</span>
                    <span className="home-news__more">View more</span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
