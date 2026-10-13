import { useState } from 'react';
import { Reveal } from '../components/ui/Reveal';
import { PageHero } from '../components/site/PageHero';
import { NewsModal } from '../components/ui/NewsModal';
import { updates } from '../data/updates';
import { Calendar, User, ArrowRight } from 'lucide-react';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function UpdatesPage() {
  const [selectedArticle, setSelectedArticle] = useState<(typeof updates)[0] | null>(null);

  return (
    <>
      <PageHero
        className="page-hero--people-gradient"
        eyebrow="Latest Updates"
        title="Latest News from Science Orbit Forum"
        lede="Stay informed with official announcements, conference updates, and festival developments from Science Orbit Forum."
      />

      <section className="container section updates-cards-section">
        <div className="updates-four-column-grid">
          {updates.map((item, index) => (
            <Reveal key={item.slug} as="div">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setSelectedArticle(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedArticle(item);
                  }
                }}
                className="event-duo-card"
                aria-label={`Read news story: ${item.title}`}
                style={{ cursor: 'pointer' }}
              >
                <div className="event-duo-card__media-wrap">
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="event-duo-card__image"
                    loading={index < 2 ? 'eager' : 'lazy'}
                  />
                  <span className="event-duo-card__badge">{item.tag}</span>
                </div>

                <div className="event-duo-card__body">
                  <h2 className="event-duo-card__title">
                    {item.title}
                  </h2>

                  <div className="event-duo-card__meta-list">
                    <div className="event-duo-card__meta-item event-duo-card__meta-item--highlight">
                      <Calendar size={15} color="var(--color-secondary)" />
                      <span>{formatDate(item.date)}</span>
                    </div>

                    {item.author && (
                      <div className="event-duo-card__meta-item">
                        <User size={15} color="var(--color-secondary)" />
                        <span>By {item.author}</span>
                      </div>
                    )}
                  </div>

                  <p className="event-duo-card__excerpt">
                    {item.excerpt}
                  </p>

                  <div className="event-duo-card__footer">
                    <span className="event-duo-card__cta">
                      <span>Read full story</span>
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Reader Modal */}
      <NewsModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </>
  );
}
