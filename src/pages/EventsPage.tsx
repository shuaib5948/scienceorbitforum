import { Reveal } from '../components/ui/Reveal';
import { PageHero } from '../components/site/PageHero';
import { events } from '../data/events';
import { formatDateRange } from '../lib/dates';
import { Calendar, MapPin } from 'lucide-react';
import type { EventItem } from '../types';

/**
 * Dynamically builds the subdomain URL (`https://<subdomain>.<current-domain>`)
 * based on whatever domain the site is currently hosted on.
 */
function getEventHref(eventItem: EventItem): string {
  if (!eventItem.subdomain) {
    return `/events/${eventItem.slug}`;
  }

  if (typeof window === 'undefined') {
    return `https://${eventItem.subdomain}.scienceorbitforum.org`;
  }

  const { protocol, hostname, port } = window.location;
  const baseHost = hostname.replace(/^(www|icrast|festival)\./i, '');
  const portSuffix = port ? `:${port}` : '';

  // Production domain: https://icrast.scienceorbitforum.org or https://festival.scienceorbitforum.org
  if (baseHost === 'scienceorbitforum.org' || baseHost.endsWith('.scienceorbitforum.org')) {
    return `https://${eventItem.subdomain}.scienceorbitforum.org`;
  }

  // Local development with subdomains
  if (baseHost === 'localhost' || baseHost === '127.0.0.1') {
    return `${protocol}//${eventItem.subdomain}.${baseHost}${portSuffix}`;
  }

  // Fallback for Vercel preview deployments where wildcard subdomains may not be configured
  return `/${eventItem.subdomain}`;
}

export default function EventsPage() {
  return (
    <>
      <PageHero
        className="page-hero--people-gradient"
        eyebrow="Programmes &amp; Conferences"
        title="Science Orbit Forum Events"
        lede="Explore our official academic conferences and flagship community science festivals, connecting researchers, educators and students across Kerala and beyond."
      />

      <section className="container section events-showcase-section">
        <div className="events-two-column-grid">
          {events.map((eventItem, index) => (
            <Reveal key={eventItem.id} as="div">
              <a
                href={getEventHref(eventItem)}
                className="event-duo-card"
                aria-label={`View full programme details for ${eventItem.title}`}
              >
                <div className="event-duo-card__media-wrap">
                  <img
                    src={eventItem.image}
                    alt={eventItem.title}
                    className="event-duo-card__image"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </div>

                <div className="event-duo-card__body">
                  <h2 className="event-duo-card__title">
                    {eventItem.title}
                  </h2>

                  <div className="event-duo-card__meta-list">
                    <div className="event-duo-card__meta-item event-duo-card__meta-item--highlight">
                      <Calendar size={14} color="var(--color-secondary)" />
                      <span>{formatDateRange(eventItem.date, eventItem.endDate)}</span>
                    </div>

                    <div className="event-duo-card__meta-item">
                      <MapPin size={14} color="var(--color-secondary)" />
                      <span>{eventItem.location}</span>
                    </div>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
