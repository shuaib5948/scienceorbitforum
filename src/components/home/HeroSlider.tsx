import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';
import type { NavigationOptions } from 'swiper/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { heroSlidesData } from '../../content/hero-slides';
import { ButtonLink } from '../ui/Button';
import { OrbOrnament } from '../ui/OrbOrnament';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

/**
 * HeroSlider — Science Orbit Forum homepage flagship hero carousel.
 * Modern academic carousel with atmospheric space-navy overlays,
 * orbital iconography, high-contrast editorial typography, and interactive controls.
 */
export const HeroSlider: React.FC = () => {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  return (
    <section 
      className="hero-slider"
      aria-roledescription="carousel"
      aria-label="Science Orbit Forum Highlights"
    >
      <Swiper
        modules={[Autoplay, Pagination, EffectFade, Navigation]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1400}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: false,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
            const nav = swiper.params.navigation as NavigationOptions;
            nav.prevEl = prevRef.current;
            nav.nextEl = nextRef.current;
          }
        }}
        loop={true}
        className="hero-slider__swiper"
      >
        {heroSlidesData.map((slide, index) => (
          <SwiperSlide key={slide.id} className="hero-slider__slide">
            {/* Background Photographic Image */}
            <div className="hero-slider__bg">
              <img
                src={slide.image}
                alt={(slide.titlePrimary || slide.quote?.text || 'Science Orbit Forum Highlight').replace('\n', ' ')}
                className="hero-slider__image"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              
              {/* Space Navy Dual Scrim for Maximum Text Contrast */}
              <div className="hero-slider__overlay-dark" />
              <div className="hero-slider__overlay-gradient" />

              {/* Signature Science Orbit Ring Graphic */}
              <div className="hero-slider__orb">
                <OrbOrnament />
              </div>
            </div>

            {/* Slide Foreground Content */}
            <div className="hero-slider__content">
              {slide.quote ? (
                /* Pure Quote Block — Small Font Size, Elegant Typography */
                <div className="hero-slider__quote-box">
                  <span className="hero-slider__quote-mark" aria-hidden>“</span>
                  <blockquote className="hero-slider__quote-text">
                    {slide.quote.text.replace(/^[“"]|[”"]$/g, '')}
                  </blockquote>
                  <cite className="hero-slider__quote-author">
                    — {slide.quote.author}
                  </cite>
                </div>
              ) : (
                /* Standard Slide Headline & Subdescription */
                <>
                  {slide.titlePrimary && (
                    <h1 className="hero-slider__title">
                      {slide.titlePrimary}
                    </h1>
                  )}
                  {slide.subdescription && (
                    <p className="hero-slider__subdescription">
                      {slide.subdescription}
                    </p>
                  )}
                </>
              )}

              {/* Dual CTA Actions */}
              <div className="hero-slider__actions">
                <ButtonLink
                  href={slide.primaryCta.to}
                  variant="primary"
                  size="lg"
                  withArrow
                  className="hero-slider__btn-primary"
                >
                  {slide.primaryCta.label}
                </ButtonLink>

                <ButtonLink
                  href={slide.secondaryCta.to}
                  variant="inverse"
                  size="lg"
                  className="hero-slider__btn-secondary"
                >
                  {slide.secondaryCta.label}
                </ButtonLink>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Prev / Next Navigation Arrows */}
      <button
        ref={prevRef}
        type="button"
        className="hero-slider__arrow hero-slider__arrow--prev"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        ref={nextRef}
        type="button"
        className="hero-slider__arrow hero-slider__arrow--next"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
    </section>
  );
};

export default HeroSlider;
