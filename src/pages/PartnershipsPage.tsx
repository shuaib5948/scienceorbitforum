import { PageHero } from '../components/site/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';

const types = [
  {
    title: 'Academic Collaboration',
    text: 'Partnerships with institutions, learning communities and research groups to strengthen scientific exchange.',
  },
  {
    title: 'Public Engagement',
    text: 'Shared initiatives that make science more visible, accessible and relevant in everyday life.',
  },
  {
    title: 'Programmatic Support',
    text: 'Working together to design workshops, events and projects that support civic curiosity and learning.',
  },
];

export default function PartnershipsPage() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Partnerships"
        lede="Partnerships help connect Science Orbit Forum with institutions, communities and organisations that care deeply about science and learning."
        roomy
      />

      <section className="container section">
        <SectionHeading
          eyebrow="How we collaborate"
          title="Partnerships rooted in shared purpose"
          lede="We work with partners who want to expand access to knowledge, participation and meaningful scientific engagement."
          align="center"
        />

        <div className="page__grid page__grid--cards" style={{ marginTop: 'var(--space-6)' }}>
          {types.map((item) => (
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
