import { Reveal } from '../ui/Reveal';

/**
 * IntroSection — About masthead: centered editorial statement (eyebrow →
 * headline → supporting line), a thin divider, then a four-pillar value row.
 * Each pillar is counted (01–04): large number + short word + three-word
 * descriptor. Whitespace-driven, no cards, no links — identity + values only.
 */
export function IntroSection() {
  const pillars = [
    { num: '01', word: 'Curiosity', descriptor: 'driven learning' },
    { num: '02', word: 'Exploration', descriptor: 'over answers' },
    { num: '03', word: 'Community', descriptor: 'over hierarchy' },
    { num: '04', word: 'Impact', descriptor: 'over noise' },
  ];

  return (
    <section className="container section home-about">
      <Reveal>
        <div className="home-about__intro">
          <span className="eyebrow">About Science Orbit Forum</span>
          <h2 className="home-about__title">
            A community built on curiosity, not credentials.
          </h2>
          <p className="home-about__copy">
            Science Orbit Forum is an open forum where students, researchers, educators
            and science enthusiasts come together to ask questions, share ideas
            and pursue discovery — beyond the boundaries of a classroom.
          </p>
        </div>
      </Reveal>

      <hr className="home-about__divider" />

      <div className="home-about__pillars">
        {pillars.map((pillar) => (
          <Reveal key={pillar.num} as="div">
            <div className="about-pillar">
              <span className="about-pillar__num">{pillar.num}</span>
              <span className="about-pillar__word">{pillar.word}</span>
              <span className="about-pillar__descriptor">{pillar.descriptor}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

