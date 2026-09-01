import type { Update } from '../../types';
import { Card } from './Card';
import { Tag } from './Tags';
import { DateLabel } from './Labels';
import { ArrowLink } from './Links';
import { formatDate } from '../../lib/dates';
import { Newspaper } from 'lucide-react';

export interface UpdateCardProps {
  update: Update;
}

/** Editorial update / article card — identical structure with or without a cover photo. */
export function UpdateCard({ update }: UpdateCardProps) {
  return (
    <Card
      variant="update"
      className="update-card"
      media={
        <a href={`/updates/${update.slug}`} className="update-card__media">
          {update.cover ? (
            <img src={update.cover} alt={update.title} loading="lazy" />
          ) : (
            <span className="update-card__media-fallback" aria-hidden>
              <Newspaper size={28} strokeWidth={1.6} />
            </span>
          )}
        </a>
      }
      eyebrow={<Tag variant="accent">{update.tag}</Tag>}
      title={
        <a href={`/updates/${update.slug}`} className="update-card__title">
          {update.title}
        </a>
      }
      meta={
        <span className="update-card__meta">
                  <DateLabel date={formatDate(update.date)} dot={false} />

          <span className="update-card__author">by {update.author}</span>
        </span>
      }
      text={<p className="update-card__excerpt">{update.excerpt}</p>}
      footer={<ArrowLink href={`/updates/${update.slug}`}>Read more</ArrowLink>}
    />
  );
}
