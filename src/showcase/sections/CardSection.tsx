import { Section } from '../kit';
import { Card } from '../../components/ui/Card';
import { ArrowLink, DateLabel, Icon } from '../../components/ui';

const MEDIA = (bg: string, icon: 'orbit' | 'microscope' | 'research' | 'atom') => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: `radial-gradient(120% 120% at 20% 0%, #123b63, ${bg})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <span style={{ display: 'inline-flex', color: 'rgba(244,248,252,0.85)' }}>
      <Icon name={icon} size={48} strokeWidth={1.3} />
    </span>
  </div>
);

/**
 * 08 · CARD SYSTEM
 */
export function CardSection() {
  return (
    <Section
      id="cards"
      index="08"
      title="Cards"
      lede="A small, disciplined set of reusable cards — event, update, research, image and featured. Moderate corner radius, subtle borders and generous padding keep them editorial and academic, never dashboard-like."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-6)', marginTop: 'var(--space-7)' }}>
        <Card
          variant="event"
          media={MEDIA('#0E4F86', 'orbit')}
          eyebrow={<DateLabel date="22 March 2026" />}
          title="Student Research Symposium"
          text="A day of presentations, posters and peer discussion across physics, biology, chemistry and computer science."
          meta={<span className="tag tag--accent">Research</span>}
          footer={<ArrowLink>View Event</ArrowLink>}
        />

        <Card
          variant="update"
          title="Observatory session announced"
          text="The astronomy club invites first-year students to an evening of telescope observation and star mapping on campus."
          meta={<DateLabel date="14 Feb 2026" dot />}
          footer={<ArrowLink>Read More</ArrowLink>}
        />

        <Card
          variant="research"
          media={MEDIA('#0B4A7D', 'microscope')}
          eyebrow={<DateLabel date="Ongoing" />}
          title="Microbial Water Quality Study"
          text="Undergraduate teams sample campus water sources and document findings for the department yearbook."
          meta={<span className="tag tag--accent">Laboratory</span>}
          footer={<ArrowLink>Explore</ArrowLink>}
        />

        <Card
          variant="featured"
          media={MEDIA('#18B6D9', 'atom')}
          eyebrow="Featured"
          title="Innovation & Science Exhibition 2026"
          text="Flagship annual exhibition of student-built models, working prototypes and research displays, open to all departments."
          meta={<DateLabel date="9–11 April 2026" dot />}
          footer={
            <div className="gallery__row">
              <span className="badge badge--accent">Flagship</span>
              <ArrowLink>Explore Event</ArrowLink>
            </div>
          }
        />
      </div>
    </Section>
  );
}