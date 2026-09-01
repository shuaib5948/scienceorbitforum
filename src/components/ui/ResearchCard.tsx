import type { ResearchItem } from '../../types';
import { Card } from './Card';
import { Tag } from './Tags';
import { ArrowLink } from './Links';

export interface ResearchCardProps {
  item: ResearchItem;
}

/** Research-program card. */
export function ResearchCard({ item }: ResearchCardProps) {
  return (
    <Card
      variant="research"
      className="research-card"
      eyebrow={<Tag variant="default">{item.tag}</Tag>}
      title={item.title}
      meta={<span className="research-card__lab">{item.lab}</span>}
      text={<p className="research-card__excerpt">{item.excerpt}</p>}
      footer={<ArrowLink href="/research">Explore research</ArrowLink>}
    />
  );
}
