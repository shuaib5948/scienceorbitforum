import { ButtonLink } from '../ui/Button';
import { OrbOrnament } from '../ui/OrbOrnament';
import { Reveal } from '../ui/Reveal';
import { ChevronDown } from 'lucide-react';

/**
 * HeroSection — Centered hero over the deep navy field.
 * The orbital graphic sits behind the copy at ~12% opacity (decorative only,
 * never competing with text contrast). Copy enters once with an 80ms stagger;
 * a single subtle scroll cue pulses below the CTAs. Reduced motion disables
 * the cue animation via CSS.
 */
export function HeroSection() {
  return (
    <section className="home-hero">
      <div className="home-hero__orb" aria-hidden>
        <OrbOrnament />
      </div>

      <div className="container section home-hero__content">
        <Reveal delay={80}>
          <figure className="home-hero__quote">
            <span className="home-hero__quote-mark" aria-hidden>
              “
            </span>
            <h1 className="home-hero__title home-hero__title--quote">
              Nothing in life is to be feared, it is only to be understood.
            </h1>
            <figcaption className="home-hero__quote-author">
              — Marie Curie
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={160}>
          <p className="home-hero__lede">
            Science Orbit Forum brings together curious minds to explore science, share
            ideas, engage with research and participate in programmes that inspire
            scientific thinking and innovation.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="home-hero__actions">
            <ButtonLink href="/join" size="lg" withArrow>
              Join Science Orbit Forum
            </ButtonLink>
            <ButtonLink href="/events" size="lg" variant="inverse">
              Explore Events
            </ButtonLink>
          </div>
        </Reveal>

        <span className="home-hero__scroll" aria-hidden>
          <ChevronDown size={22} />
        </span>
      </div>
    </section>
  );
}

