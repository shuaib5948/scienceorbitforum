import { Section } from '../kit';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Tag, Badge } from '../../components/ui/Tags';
import { Breadcrumbs, DateLabel, CategoryLabel } from '../../components/ui/Labels';
import { ArrowLink, SocialIcon } from '../../components/ui/Links';
import { Icon } from '../../components/ui/Icon';

/**
 * 13 · UI COMPONENT FOUNDATION
 * Reusable primitives for future pages. Full page layouts are NOT built
 * yet — that begins in Phase 2.
 */
export function ComponentSection() {
  return (
    <Section
      id="components"
      index="13"
      title="UI component foundation"
      lede="The reusable building blocks every future page composes from: header, navigation, footer, buttons, typography, cards, tags, badges, section headings, image containers, dividers, breadcrumbs, labels, arrow links and social icons. No pages built yet."
    >
      <div className="gallery" style={{ marginTop: 'var(--space-7)' }}>
        <div className="gallery__item">
          <p className="eyebrow">Section heading</p>
          <div style={{ marginTop: 'var(--space-3)' }}>
            <SectionHeading
              eyebrow="Events"
              title="Programmes that spark curiosity"
              lede="From laboratory workshops to national exhibitions — every programme is designed around student discovery."
            />
          </div>
        </div>

        <div className="gallery__item">
          <p className="eyebrow">Breadcrumbs</p>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '#' },
              { label: 'Events', href: '#' },
              { label: 'Research Symposium' },
            ]}
          />
          <div style={{ display: 'grid', gap: 'var(--space-3)', marginBlockStart: 'var(--space-4)' }}>
            <CategoryLabel>Research</CategoryLabel>
            <DateLabel date="22 March 2026" />
            <DateLabel date="14 Feb 2026" dot />
          </div>
        </div>

        <div className="gallery__item">
          <p className="eyebrow">Tags & badges</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: 'var(--space-4)', alignItems: 'center' }}>
            <Tag variant="accent">Research</Tag>
            <Tag>Workshop</Tag>
            <Badge>Featured</Badge>
            <Badge variant="accent">Flagship</Badge>
            <Badge variant="outline">Ongoing</Badge>
          </div>
        </div>

        <div className="gallery__item">
          <p className="eyebrow">Arrow links</p>
          <div style={{ display: 'grid', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <ArrowLink>Explore Events</ArrowLink>
            <ArrowLink>Read More</ArrowLink>
            <ArrowLink>Discover Science Orbit Forum</ArrowLink>
          </div>
        </div>

        <div className="gallery__item">
          <p className="eyebrow">Date & category labels with headings</p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-4)', alignItems: 'center' }}>
            <Icon name="calendar" size={18} />
            <DateLabel date="9–11 April 2026" dot />
            <CategoryLabel>Innovation</CategoryLabel>
            <Badge variant="accent">New</Badge>
          </div>
        </div>

        <div className="gallery__item">
          <p className="eyebrow">Social icons</p>
          <div className="gallery__row" style={{ marginTop: 'var(--space-4)' }}>
            <SocialIcon name="instagram" label="Instagram" />
            <SocialIcon name="youtube" label="YouTube" />
            <SocialIcon name="twitter" label="Twitter / X" />
            <SocialIcon name="mail" label="Email" />
            <SocialIcon name="whatsapp" label="WhatsApp" />
          </div>
        </div>
      </div>
    </Section>
  );
}