import { SectionHeading } from '../ui/SectionHeading';
import { ArrowLink } from '../ui/Links';
import { Reveal } from '../ui/Reveal';
import { ZoomIn } from 'lucide-react';
import { events } from '../../data/events';

/**
 * ScienceInAction — a horizontal slider where one card is shown at a time.
 */
export function ScienceInAction() {
  const tiles = events.slice(0, 5).map((event) => ({
    src: event.image,
    label: event.tag,
  }));

  return (
    <section className="section" style={{ background: 'var(--color-surface-muted)' }}>
      <div className="container">
        <SectionHeading
          eyebrow="Science in Action"
          title="From scientific exhibitions to discussions, presentations and hands-on initiatives."
        />

        <div className="science-slider" aria-label="Science in action highlights">
          {tiles.map((tile, i) => (
            <Reveal key={`${tile.label}-${i}`} as="article" className="science-slide">
              <div className="science-slide__media">
                <img src={tile.src} alt={tile.label} loading="lazy" />
                <span className="science-slide__badge">{tile.label}</span>
                <span className="science-slide__view" aria-hidden>
                  <ZoomIn size={20} />
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <div style={{ marginTop: 'var(--space-5)', textAlign: 'right' }}>
          <ArrowLink href="/events">View Gallery</ArrowLink>
        </div>
      </div>
    </section>
  );
}

