import { PageHero } from '../components/site/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';

const points = [
  {
    title: 'Eligibility',
    text: 'Membership is open to individuals and organisations aligned with Science Orbit Forum’s values of curiosity, learning and community engagement.',
  },
  {
    title: 'Participation',
    text: 'All members are expected to contribute respectfully, participate constructively and support an inclusive scientific culture.',
  },
  {
    title: 'Communication',
    text: 'We use member information to share programme updates, event invitations and relevant opportunities for learning and collaboration.',
  },
  {
    title: 'Review and Renewal',
    text: 'Membership status may be reviewed periodically to ensure continued alignment with the community’s purpose, values and standards.',
  },
];

export default function MembershipRegulationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Membership Regulations"
        lede="Membership is built around trust, respectful participation and a shared commitment to open, thoughtful scientific engagement."
        roomy
      />

      <section className="container section">
        <SectionHeading
          eyebrow="Guidelines"
          title="The standards that shape participation"
          lede="These regulations help maintain a welcoming, credible and constructive forum for all members."
          align="center"
        />

        <div className="page__grid page__grid--cards" style={{ marginTop: 'var(--space-6)' }}>
          {points.map((point) => (
            <article key={point.title} className="card" style={{ padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-muted)' }}>
              <h3 className="card__title" style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--text-h4)' }}>{point.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{point.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
