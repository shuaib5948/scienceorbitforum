import { useState } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { NewsModal } from '../ui/NewsModal';
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
  const [selectedArticle, setSelectedArticle] = useState<Update | null>(null);
  const displayUpdates = updates.slice(0, 2);

  return (
    <>
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
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedArticle(update)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedArticle(update);
                    }
                  }}
                  className="home-news__card"
                  aria-label={`Read more about ${update.title}`}
                  style={{ cursor: 'pointer' }}
                >
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
                      <span className="home-news__more">Read full story →</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Reader Modal for full contents */}
      <NewsModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </>
  );
}
