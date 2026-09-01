import { SectionHeading } from '../ui/SectionHeading';
import { ArrowLink } from '../ui/Links';
import { Reveal } from '../ui/Reveal';
import { Tag } from '../ui/Tags';
import { Calendar, MapPin } from 'lucide-react';
import { formatDateRange } from '../../lib/dates';
import type { EventItem } from '../../types';

/**
 * FeaturedEvent — Two-column spotlight: photo left (4:3, subtle zoom on
 * hover), text right: label → title → date/location → excerpt → link.
 */
interface FeaturedEventProps {
  event: EventItem;
}

export function FeaturedEvent({ event }: FeaturedEventProps) {
  return (
    <section className="section" style={{ background: 'var(--color-bg)' }}>
      <div className="container">
        <SectionHeading
          eyebrow="Featured Programme"
          title="What Science Orbit Forum is doing next"
          lede="A look at one of the forum's current flagship programmes."
        />
        <div className="featured-event">
          <Reveal>
            <a href={`/events/${event.slug}`} className="featured-event__media">
              <img src={event.image} alt={event.title} loading="lazy" />
            </a>
          </Reveal>

          <Reveal delay={80}>
            <div className="featured-event__body">
              <Tag variant="accent">{event.tag}</Tag>
              <h3 className="featured-event__title">{event.title}</h3>
              <p className="featured-event__meta">
                <span>
                  <Calendar size={16} /> {formatDateRange(event.date, event.endDate)}
                </span>
                <span>
                  <MapPin size={16} /> {event.location}
                </span>
              </p>
              <p className="featured-event__excerpt">{event.excerpt}</p>
              <ArrowLink href={`/events/${event.slug}`}>View Event Details</ArrowLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

