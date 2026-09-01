import { PageHero } from '../components/site/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';

const supportAreas = [
  'Community programmes and public outreach',
  'Student and early researcher opportunities',
  'Scientific conversations and event experiences',
  'Partnerships that grow the forum’s reach and impact',
];

export default function FundingSupportPage() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Funding & Support"
        lede="Support helps Science Orbit Forum build accessible events, educational experiences and scientific spaces for a wider community."
        roomy
      />

      <section className="container section">
        <SectionHeading
          eyebrow="How support helps"
          title="Investing in curiosity and public engagement"
          lede="Science Orbit Forum grows through the support of partners, contributors and people who believe in open scientific learning."
          align="center"
        />

        <div style={{ maxWidth: 760, margin: 'var(--space-6) auto 0' }}>
          <ul style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, paddingLeft: 'var(--space-5)' }}>
            {supportAreas.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
