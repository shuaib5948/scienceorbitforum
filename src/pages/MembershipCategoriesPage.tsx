import { PageHero } from '../components/site/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ButtonLink } from '../components/ui/Button';

const categories = [
  {
    title: 'Platinum',
    price: 'Rs. 10,000 / year',
    eligibility: 'Scientists and Faculties',
    description: 'For senior researchers and academic leaders seeking deeper engagement, visibility and influence within the Science Orbit Forum community.',
    features: ['Priority access to programmes', 'Leadership networking', 'Research collaboration opportunities', 'Featured participation and visibility'],
    highlight: true,
  },
  {
    title: 'Gold',
    price: 'Rs. 5,000 / year',
    eligibility: 'Graduates, PhDs, Postdocs and Industry Personnel',
    description: 'A strong membership for professionals and early-career researchers who want to connect, learn and contribute actively.',
    features: ['Access to events and workshops', 'Professional community connections', 'Knowledge-sharing channels', 'Career-support opportunities'],
    highlight: false,
  },
  {
    title: 'Silver',
    price: 'Rs. 1,000 / year',
    eligibility: 'School Students, Under Graduates and others',
    description: 'An accessible option for students and early learners who want to grow through community participation and science engagement.',
    features: ['Student participation access', 'Science learning opportunities', 'Community events', 'Mentorship and exposure'],
    highlight: false,
  },
  {
    title: 'Institution Subscription',
    price: 'Custom institutional plan',
    eligibility: 'Colleges, universities, schools and academic institutions',
    description: 'For institutions looking to build sustained engagement with Science Orbit Forum programmes, academic collaboration and public science initiatives.',
    features: ['Institutional participation', 'Research and academic collaboration', 'Student engagement pathways', 'Long-term science partnership'],
    highlight: false,
  },
];

export default function MembershipCategoriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Membership Categories"
        lede="Science Orbit Forum welcomes different ways to participate, depending on how you learn, teach, research, collaborate and contribute."
        roomy
      />

      <section className="container section">
        <SectionHeading
          eyebrow="Who can join"
          title="Choose a path that fits your role"
          lede="Every membership category is designed to make science more open, thoughtful and connected."
          align="center"
        />

        <div className="page__grid page__grid--cards" style={{ marginTop: 'var(--space-6)' }}>
          {categories.map((item) => (
            <article
              key={item.title}
              className="card"
              style={{
                padding: 0,
                borderRadius: 'var(--radius-lg)',
                background: item.highlight ? 'var(--color-bg-navy)' : 'var(--color-surface-muted)',
                color: item.highlight ? '#fff' : 'var(--color-text)',
                border: item.highlight ? '1px solid rgba(63, 209, 224, 0.35)' : '1px solid var(--color-border)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <h3 className="card__title" style={{ margin: 0, fontSize: 'var(--text-h4)', color: item.highlight ? '#fff' : 'var(--color-text)' }}>
                    {item.title}
                  </h3>
                  {item.highlight && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(63, 209, 224, 0.14)',
                      color: '#dffcff',
                      fontSize: '0.7rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      borderRadius: '999px',
                      padding: '0.35rem 0.6rem',
                      fontWeight: 700,
                    }}>
                      Popular
                    </span>
                  )}
                </div>

                <div style={{ marginTop: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: item.highlight ? '1px solid rgba(255,255,255,0.12)' : '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: 'clamp(1.7rem, 2vw, 2.3rem)', fontWeight: 700, lineHeight: 1.1, color: item.highlight ? '#fff' : 'var(--color-text)' }}>
                    {item.price}
                  </div>
                </div>

                <p style={{ marginTop: 'var(--space-4)', marginBottom: 0, color: item.highlight ? 'rgba(255,255,255,0.82)' : 'var(--color-text-muted)', lineHeight: 1.7 }}>
                  {item.description}
                </p>

                <div style={{ marginTop: 'var(--space-4)' }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-body-small)', letterSpacing: '0.08em', textTransform: 'uppercase', color: item.highlight ? '#bfeff7' : 'var(--color-text-muted)' }}>
                    Eligibility
                  </p>
                  <p style={{ marginTop: 'var(--space-2)', marginBottom: 0, color: item.highlight ? '#fff' : 'var(--color-text)' }}>
                    {item.eligibility}
                  </p>
                </div>

                <ul style={{ marginTop: 'var(--space-4)', marginBottom: 0, paddingLeft: '1.1rem', display: 'grid', gap: 'var(--space-2)', color: item.highlight ? 'rgba(255,255,255,0.82)' : 'var(--color-text-muted)', lineHeight: 1.65 }}>
                  {item.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <div style={{ marginTop: 'auto', paddingTop: 'var(--space-5)' }}>
                  <ButtonLink href="/join" variant={item.highlight ? 'inverse' : 'primary'} withArrow>
                    Subscribe
                  </ButtonLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
