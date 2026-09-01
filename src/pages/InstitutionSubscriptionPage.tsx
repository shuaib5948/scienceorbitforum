import { PageHero } from '../components/site/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';

const subscriptionDetails = [
  'For colleges, universities, schools and academic institutions seeking sustained engagement with Science Orbit Forum.',
  'Supports institutional participation in science events, workshops, research discussions and public engagement programmes.',
  'Creates a structured way for institutions to connect with students, educators, researchers and innovators.',
  'Helps build a stronger science culture through collaborative learning and community engagement.',
];

export default function InstitutionSubscriptionPage() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Institution Subscription"
        lede="Institution subscription provides schools, colleges and universities with a sustained pathway to participate in Science Orbit Forum’s learning and research community."
        roomy
      />

      <section className="container section">
        <SectionHeading
          eyebrow="For institutions"
          title="A platform for academic collaboration and science engagement"
          lede="This membership model is designed for institutions that want to connect their communities with meaningful science learning, exploration and public engagement."
          align="center"
        />

        <div style={{ maxWidth: 760, margin: 'var(--space-6) auto 0' }}>
          <ul style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, paddingLeft: 'var(--space-5)' }}>
            {subscriptionDetails.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
