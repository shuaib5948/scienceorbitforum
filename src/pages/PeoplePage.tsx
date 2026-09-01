import { PageHero } from '../components/site/PageHero';

const presidentImage = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80';
const secretaryImage = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80';

export default function PeoplePage() {
  return (
    <>
      <PageHero
        eyebrow="OUR PEOPLE"
        title="The People Behind Science Orbit Forum"
        lede="Meet the people who guide, coordinate and contribute to the work of Science Orbit Forum."
        align="center"
      />

      <section className="container section people-page" style={{ paddingTop: 'var(--space-7)' }}>
        <h2 style={{
          margin: 0,
          fontFamily: 'var(--font-subhead)',
          fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
        }}>
          Leadership
        </h2>

        <div className="people-page__leadership-grid" style={{ marginTop: 'var(--space-5)' }}>
          <article className="people-page__profile">
            <div className="people-page__photo">
              <img
                src={presidentImage}
                alt="Portrait of M. Rasheed T. P."
              />
            </div>

            <div>
              <p style={{
                margin: 0,
                color: 'var(--color-text-muted)',
                fontSize: 'var(--text-body-small)',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}>
                President
              </p>

              <h3 style={{
                margin: 'var(--space-2) 0 0',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 2vw, 2.2rem)',
                lineHeight: 1.15,
                color: 'var(--color-text)',
              }}>
                M. Rasheed T. P.
              </h3>

              <p style={{
                marginTop: 'var(--space-3)',
                fontSize: 'clamp(0.96rem, 1.15vw, 1.07rem)',
                lineHeight: 1.8,
                color: 'var(--color-text)',
                maxWidth: 680,
              }}>
                M. Rasheed T. P. holds a Master’s degree in Physics from the Central University of Uttarakhand, along with a Bachelor’s degree in Physics from the University of Calicut and a Bachelor’s degree in Education from Tamil Nadu Teachers Education University. With over five and a half years of experience in STEM education and administration, he has developed extensive expertise in educational initiatives, academic coordination, and organizational administration. His experience and commitment to advancing science and STEM education contribute to the organization’s vision of fostering scientific learning, innovation, and collaboration.
              </p>
            </div>
          </article>

          <article className="people-page__profile people-page__profile--reverse">
            <div>
              <p style={{
                margin: 0,
                color: 'var(--color-text-muted)',
                fontSize: 'var(--text-body-small)',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}>
                Secretary
              </p>

              <h3 style={{
                margin: 'var(--space-2) 0 0',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 2vw, 2.2rem)',
                lineHeight: 1.15,
                color: 'var(--color-text)',
              }}>
                M. Shabeer U.
              </h3>
            </div>

            <div className="people-page__photo">
              <img
                src={secretaryImage}
                alt="Portrait of M. Shabeer U."
              />
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
