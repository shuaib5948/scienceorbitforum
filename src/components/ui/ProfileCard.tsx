import type { Person } from '../../types';
import { Card } from './Card';
import { Tag } from './Tags';
import { ArrowLink } from './Links';

export interface ProfileCardProps {
  person: Person;
}

/**
 * People-directory card. Reuses Phase 1 primitives (Card, Tag, ArrowLink)
 * and the token palette. The whole card anchors to the person's profile route,
 * relying on the router's built-in anchor navigation (client-side, no reload).
 */
export function ProfileCard({ person }: ProfileCardProps) {
  return (
    <Card
      variant="default"
      className="profile-card"
      media={
        <a href={person.profileUrl ?? '#'} className="profile-card__media">
          <img
            src={person.image}
            alt={`Portrait of ${person.name}`}
            loading="lazy"
            className="profile-card__img"
          />
        </a>
      }
      title={
        <span className="profile-card__name">
          {person.name} <span className="profile-card__role">{person.title}</span>
        </span>
      }
      meta={
        <div className="profile-card__meta">
          <span className="profile-card__meta-text">
            {person.department ?? person.institution}
          </span>
          <span className="profile-card__topics">
            {person.topics.map((t) => (
              <Tag key={t} variant="navy" className="tag--sm">
                {t}
              </Tag>
            ))}
          </span>
        </div>
      }
      text={<p className="profile-card__bio">{person.bio}</p>}
      footer={person.profileUrl ? (
        <ArrowLink href={person.profileUrl}>View profile</ArrowLink>
      ) : undefined}
    />
  );
}
