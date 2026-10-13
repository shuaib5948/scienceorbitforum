import { useState } from 'react';
import { ButtonLink } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';
import { NewsModal } from '../ui/NewsModal';
import type { Update } from '../../types';

interface SciVerseSectionProps {
  articles: Update[];
}

export function SciVerseSection({ articles }: SciVerseSectionProps) {
  const [selectedArticle, setSelectedArticle] = useState<Update | null>(null);
  const displayArticles = articles.slice(0, 3);
  if (displayArticles.length === 0) return null;

  return (
    <>
      <section className="section home-sciverse">
        <div className="container">
          <SectionHeading
            eyebrow="SciVerse"
            title="Read from Our People"
            lede="Ideas, insights and stories from the people of Science Orbit Forum."
          />

          <div className="home-sciverse__grid" style={{ marginTop: 'var(--space-6)' }}>
            {displayArticles.map((article) => (
              <article
                key={article.slug}
                className="home-sciverse__card"
                onClick={() => setSelectedArticle(article)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  className="home-sciverse__image"
                  src={article.cover ?? 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=40'}
                  alt={article.title}
                  loading="lazy"
                />

                <div className="home-sciverse__body">
                  <span className="eyebrow home-sciverse__eyebrow">{article.tag}</span>

                  <h3 className="home-sciverse__title">
                    <span>{article.title}</span>
                  </h3>

                  <p className="home-sciverse__excerpt">{article.excerpt}</p>

                  <div className="home-sciverse__meta">
                    <span>By {article.author}</span>
                  </div>

                  <span className="arrow-link home-sciverse__link">
                    Read Article
                    <span className="arrow-link__arrow" aria-hidden>
                      →
                    </span>
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
            <ButtonLink href="/updates" variant="secondary" withArrow>
              Explore SciVerse
            </ButtonLink>
          </div>
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
