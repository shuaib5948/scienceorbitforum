import { ButtonLink } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

export function MembershipCTA() {
  return (
    <section className="membership-cta">
      <div className="membership-cta__orb" aria-hidden />
      <div className="container">
        <Reveal>
          <div className="membership-cta__inner home-membership__inner">
            <span className="eyebrow eyebrow--light">Be Part of the Orbit</span>
            <h2 className="membership-cta__title home-membership__title">
              Join a community of curious minds.
            </h2>

            <ButtonLink href="/join" size="lg" withArrow className="membership-cta__btn">
              Join Science Orbit Forum
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

