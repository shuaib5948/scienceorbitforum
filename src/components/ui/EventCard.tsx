import type { EventItem } from '../../types';
import { Card } from './Card';
import { Tag, Badge } from './Tags';
import { DateLabel } from './Labels';
import { formatDateRange } from '../../lib/dates';
import { ArrowLink } from './Links';

export interface EventCardProps {
  event: EventItem;
}

/** Editorial event card — media + eyebrow tag + title + date + excerpt. */
export function EventCard({ event }: EventCardProps) {
  return (
    <Card
      variant={event.featured ? 'featured' : 'event'}
      className="event-card"
      media={
        <a href={`/events/${event.slug}`} className="event-card__media">
          <img src={event.image} alt={event.title} loading="lazy" />
          {event.featured && <Badge variant="accent">Featured</Badge>}
        </a>
      }
      eyebrow={<Tag variant="accent">{event.tag}</Tag>}
      title={
        <a href={`/events/${event.slug}`} className="event-card__title">
          {event.title}
        </a>
      }
            meta={<DateLabel date={formatDateRange(event.date, event.endDate)} />}

      text={<p className="event-card__excerpt">{event.excerpt}</p>}
      footer={<ArrowLink href={`/events/${event.slug}`}>Event details</ArrowLink>}
    />
  );
}
