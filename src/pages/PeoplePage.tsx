import { PageHero } from '../components/site/PageHero';
import { Reveal } from '../components/ui/Reveal';

const presidentImage = '/images/rasheed.jpg';
const secretaryImage = '/images/shabeer.jpg';

export default function PeoplePage() {
  return (
    <>
      <PageHero
        className="page-hero--people-gradient"
        eyebrow="Our People"
        title="The People Behind Science Orbit Forum"
        lede="Meet the people who guide, coordinate and contribute to the work of Science Orbit Forum."
      />

      {/* Clean Leadership Section */}
      <section className="people-leadership-section">
        <div className="container">
          <div className="people-leadership-rows">
            {/* Row 1: President */}
            <Reveal>
              <article className="leader-row">
                <div className="leader-row__photo-col">
                  <div className="leader-row__photo-wrap">
                    <img
                      src={presidentImage}
                      alt="Portrait of M. Rasheed T. P."
                      className="leader-row__photo"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="leader-row__content">
                  <p className="leader-row__role">President · Science Orbit Forum</p>
                  <h2 className="leader-row__name">M. Rasheed T. P.</h2>
                  <p className="leader-row__bio">
                    M. Rasheed T. P. holds a Master’s degree in Physics from the Central University of Uttarakhand, along with a Bachelor’s degree in Physics from the University of Calicut and a Bachelor’s degree in Education from Tamil Nadu Teachers Education University. With over five and a half years of experience in STEM education and administration, he has developed extensive expertise in educational initiatives, academic coordination, and organizational administration. His experience and commitment to advancing science and STEM education contribute to the organization’s vision of fostering scientific learning, innovation, and collaboration.
                  </p>
                </div>
              </article>
            </Reveal>

            {/* Row 2: Secretary */}
            <Reveal>
              <article className="leader-row leader-row--reverse">
                <div className="leader-row__content">
                  <p className="leader-row__role">Secretary · Science Orbit Forum</p>
                  <h2 className="leader-row__name">M. Shabeer U.</h2>
                  <p className="leader-row__bio">
                    M Shabeer U holds a Bachelor’s degree in Chemistry from the University of Calicut and a Master’s degree in Chemistry from the National Institute of Technology Calicut. He is currently a Research Scholar at the Materials Research Laboratory, Department of Chemistry, National Institute of Technology Calicut, where he is engaged in research in the field of materials chemistry. With an academic and research-oriented background, he contributes to the organization’s objectives of promoting scientific research, innovation, and meaningful engagement with science and technology.
                  </p>
                </div>

                <div className="leader-row__photo-col">
                  <div className="leader-row__photo-wrap">
                    <img
                      src={secretaryImage}
                      alt="Portrait of M. Shabeer U."
                      className="leader-row__photo"
                      loading="lazy"
                    />
                  </div>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
