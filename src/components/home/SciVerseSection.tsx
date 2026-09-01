import { ButtonLink } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';
import type { Update } from '../../types';

interface SciVerseSectionProps {
  articles: Update[];
}

export function SciVerseSection({ articles }: SciVerseSectionProps) {
  const displayArticles = articles.slice(0, 3);

  return (
    <section className="section home-sciverse">
      <div className="container">
        <SectionHeading
          eyebrow="SciVerse"
          title="Read from Our People"
          lede="Ideas, insights and stories from the people of Science Orbit Forum."
        />

        <div className="home-sciverse__grid" style={{ marginTop: 'var(--space-6)' }}>
          {displayArticles.map((article) => (
            <article key={article.slug} className="home-sciverse__card">
              <img
                className="home-sciverse__image"
                src={article.cover ?? 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=40'}
                alt={article.title}
                loading="lazy"
              />

              <div className="home-sciverse__body">
                <span className="eyebrow home-sciverse__eyebrow">{article.tag}</span>

                <h3 className="home-sciverse__title">
                  <a href={`/updates/${article.slug}`}>{article.title}</a>
                </h3>

                <p className="home-sciverse__excerpt">{article.excerpt}</p>

                <div className="home-sciverse__meta">
                  <span>By {article.author}</span>
                </div>

                <a href={`/updates/${article.slug}`} className="arrow-link home-sciverse__link">
                  Read Article
                  <span className="arrow-link__arrow" aria-hidden>
                    →
                  </span>
                </a>
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
  );
}
