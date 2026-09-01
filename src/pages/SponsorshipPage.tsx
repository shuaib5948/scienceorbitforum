import { PageHero } from '../components/site/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';

const sponsorshipAreas = [
  {
    title: 'Event Support',
    text: 'Helping fund public programmes, workshops and community experiences that bring science closer to people.',
  },
  {
    title: 'Research Access',
    text: 'Supporting the tools, conversations and opportunities that enable learning and discovery across communities.',
  },
  {
    title: 'Community Reach',
    text: 'Helping Science Orbit Forum connect wider audiences with relevant, timely and meaningful scientific engagement.',
  },
];

export default function SponsorshipPage() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Sponsorship"
        lede="Sponsorship enables Science Orbit Forum to deliver stronger programmes, deeper community reach and more inclusive scientific participation."
        roomy
      />

      <section className="container section">
        <SectionHeading
          eyebrow="Areas of support"
          title="Where sponsorship creates impact"
          lede="Sponsorship helps turn ideas into events, visibility into participation and curiosity into action."
          align="center"
        />

        <div className="page__grid page__grid--cards" style={{ marginTop: 'var(--space-6)' }}>
          {sponsorshipAreas.map((item) => (
            <article key={item.title} className="card" style={{ padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-muted)' }}>
              <h3 className="card__title" style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--text-h4)' }}>{item.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
