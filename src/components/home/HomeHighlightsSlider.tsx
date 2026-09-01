import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HighlightItem {
  title: string;
  image: string;
  tag?: string;
}

const highlights: HighlightItem[] = [
  {
    title: 'Community science festival',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=40',
    tag: 'Science festival',
  },
  {
    title: 'Hands-on learning in action',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=40',
    tag: 'Workshops',
  },
  {
    title: 'Research conversations',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=40',
    tag: 'Research',
  },
  {
    title: 'Open discussion sessions',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=40',
    tag: 'Community',
  },
  {
    title: 'Field observations and discovery',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=40',
    tag: 'Fieldwork',
  },
];

export function HomeHighlightsSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % highlights.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  const visibleSlides = Array.from({ length: 5 }, (_, offset) => {
    const index = (activeIndex + offset - 2 + highlights.length) % highlights.length;
    return {
      ...highlights[index],
      index,
      isActive: offset === 2,
      isPrev: offset === 1,
      isNext: offset === 3,
    };
  });

  const moveSlide = (direction: number) => {
    setActiveIndex((current) => (current + direction + highlights.length) % highlights.length);
  };

  return (
    <section className="section home-highlights">
      <div className="container">
        <div className="section-head section-head--center home-highlights__head">
          <h2 className="section-head__title">Science Orbit Forum in Action</h2>
          <p className="section-head__lede">Moments, programmes and experiences from our science community.</p>
        </div>

        <div className="home-highlights__viewport" aria-label="Science Orbit Forum highlights carousel">
          <button
            type="button"
            className="home-highlights__nav home-highlights__nav--prev"
            aria-label="Previous highlight"
            onClick={() => moveSlide(-1)}
          >
            <ChevronLeft size={18} />
          </button>

          <div className="home-highlights__track">
            {visibleSlides.map((slide, index) => (
              <article
                key={`${slide.title}-${slide.index}-${index}`}
                className={[
                  'home-highlights__slide',
                  slide.isActive ? 'is-active' : '',
                  slide.isPrev ? 'is-prev' : '',
                  slide.isNext ? 'is-next' : '',
                ].join(' ')}
                onClick={() => setActiveIndex(slide.index)}
              >
                <img src={slide.image} alt={slide.title} loading="lazy" />
                {slide.tag && <span className="home-highlights__label">{slide.tag}</span>}
              </article>
            ))}
          </div>

          <button
            type="button"
            className="home-highlights__nav home-highlights__nav--next"
            aria-label="Next highlight"
            onClick={() => moveSlide(1)}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="home-highlights__dots" aria-label="Highlight pagination">
          {highlights.map((slide, index) => (
            <button
              key={`${slide.title}-dot`}
              type="button"
              className={index === activeIndex ? 'is-active' : ''}
              onClick={() => setActiveIndex(index)}
              aria-label={`View highlight ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
