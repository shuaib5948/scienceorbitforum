import { PageHero } from '../components/site/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';

const programmeAreas = [
  'Public science events and open learning experiences',
  'Student and researcher engagement programmes',
  'Science communication and community storytelling',
  'Partnership-led initiatives for broader access to knowledge',
];

export default function SupportOurProgrammesPage() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Support Our Programmes"
        lede="You can help Science Orbit Forum create opportunities for meaningful science engagement across classrooms, communities and public spaces."
        roomy
      />

      <section className="container section">
        <SectionHeading
          eyebrow="Enable impact"
          title="Help build the next wave of participation"
          lede="Support can make science more visible, more inclusive and more connected to real communities."
          align="center"
        />

        <div style={{ maxWidth: 760, margin: 'var(--space-6) auto 0' }}>
          <ul style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, paddingLeft: 'var(--space-5)' }}>
            {programmeAreas.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
