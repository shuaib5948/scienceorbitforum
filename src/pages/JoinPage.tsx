import { useEffect, useState } from 'react';
import { PageHero } from '../components/site/PageHero';
import { Reveal } from '../components/ui/Reveal';
import {
  MEMBERSHIP_CATEGORIES,
  MEMBERSHIP_BENEFITS,
  MEMBERSHIP_REGULATIONS,
} from '../data/membership';
import {
  ArrowRight,
  Award,
  Crown,
  Medal,
  GraduationCap,
  Building2,
  Users,
  Briefcase,
  Coins,
  ChevronDown,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, typeof Crown> = {
  platinum: Crown,
  gold: Medal,
  silver: GraduationCap,
  institutional: Building2,
};

const BENEFIT_ICONS: Record<string, typeof Users> = {
  community: Users,
  development: Briefcase,
  funding: Coins,
};

export default function JoinPage() {
  const [openRegSection, setOpenRegSection] = useState<string | null>('01');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const scrollToHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;
      const el = document.getElementById(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
      }
    };
    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  const toggleRegulation = (number: string) => {
    setOpenRegSection((prev) => (prev === number ? null : number));
  };

  return (
    <>
      <PageHero
        className="page-hero--people-gradient"
        eyebrow="Join Science Orbit Forum"
        title="Become Part of the Orbit"
        lede="Select your membership tier below to apply, explore member privileges, and review our institutional membership regulations."
      />

      {/* Section 1: 4 Membership Categories */}
      <section
        id="membership-categories"
        className="container section membership-hub-section"
      >
        <Reveal>
          <div className="membership-section-head">
            <span className="subdomain-eyebrow">Membership Categories</span>
            <h2 className="subdomain-heading">
              Membership Categories
            </h2>
            <p className="subdomain-lede">
              Select a membership category below to proceed to the application form.
            </p>
          </div>
        </Reveal>

        <div className="membership-categories-grid">
          {MEMBERSHIP_CATEGORIES.map((category, idx) => {
            const IconComponent = CATEGORY_ICONS[category.id] ?? Award;

            if (category.comingSoon) {
              return (
                <Reveal key={category.id} delay={idx * 60}>
                  <div
                    className="membership-category-card membership-category-card--disabled"
                    aria-label="Institutions: Coming soon"
                  >
                    <div className="membership-category-card__header">
                      <div className="membership-category-card__icon membership-category-card__icon--muted">
                        <IconComponent size={20} />
                      </div>
                      <h3 className="membership-category-card__title">
                        {category.title}
                      </h3>
                    </div>

                    <div className="membership-category-card__body membership-category-card__body--centered">
                      <span className="membership-category-card__soon-text">
                        {category.cost}
                      </span>
                    </div>

                    <div className="membership-category-card__footer">
                      <span className="membership-category-card__btn membership-category-card__btn--disabled">
                        <span>Coming soon</span>
                      </span>
                    </div>
                  </div>
                </Reveal>
              );
            }

            return (
              <Reveal key={category.id} delay={idx * 60}>
                <a
                  href={`/join/apply?category=${category.id}`}
                  className="membership-category-card"
                  aria-label={`Apply for ${category.title} Membership`}
                >
                  <div className="membership-category-card__header">
                    <div className="membership-category-card__icon">
                      <IconComponent size={20} />
                    </div>
                    <h3 className="membership-category-card__title">
                      {category.title}
                    </h3>
                    <div className="membership-category-card__cost-row">
                      <span className="membership-category-card__price">
                        {category.cost}
                      </span>
                    </div>
                  </div>

                  <div className="membership-category-card__body">
                    <span className="membership-category-card__eligibility-label">
                      Eligibility
                    </span>
                    <ul className="membership-category-card__eligibility-list">
                      {category.eligibility?.map((person) => (
                        <li key={person}>{person}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="membership-category-card__footer">
                    <span className="membership-category-card__btn">
                      <span>Apply Now</span>
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Section 2: Membership Benefits */}
      <section
        id="membership-benefits"
        className="membership-band membership-band--muted"
      >
        <div className="container">
          <Reveal>
            <div className="membership-section-head">
              <span className="subdomain-eyebrow">Member Privileges</span>
              <h2 className="subdomain-heading">Membership Benefits</h2>
              <p className="subdomain-lede">
                Every member of Science Orbit Forum gains access to academic, publishing, and collaborative opportunities:
              </p>
            </div>
          </Reveal>

          <div className="membership-benefits-grid">
            {MEMBERSHIP_BENEFITS.map((benefit, idx) => {
              const BenefitIcon = BENEFIT_ICONS[benefit.id] ?? Award;
              return (
                <Reveal key={benefit.id} delay={idx * 60}>
                  <article className="membership-benefit-card">
                    <div className="membership-benefit-card__icon">
                      <BenefitIcon size={20} />
                    </div>
                    <h3 className="membership-benefit-card__title">
                      {benefit.title}
                    </h3>
                    <p className="membership-benefit-card__desc">
                      {benefit.description}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: Membership Regulations (9-Section Accordion) */}
      <section id="membership-regulations" className="membership-band">
        <div className="container">
          <Reveal>
            <div className="membership-section-head">
              <span className="subdomain-eyebrow">
                Provisional Edition – 2026
              </span>
              <h2 className="subdomain-heading">
                Membership Regulations, Terms and Conditions
              </h2>
              <p className="subdomain-lede">
                Official governance rules, member responsibilities, and terms of admission for Science Orbit Forum (SOF).
              </p>
            </div>
          </Reveal>

          <div className="membership-regulations-accordion">
            {MEMBERSHIP_REGULATIONS.map((reg) => {
              const isOpen = openRegSection === reg.number;
              return (
                <div
                  key={reg.number}
                  className={`membership-accordion-item ${
                    isOpen ? 'is-open' : ''
                  }`}
                >
                  <button
                    type="button"
                    className="membership-accordion-trigger"
                    onClick={() => toggleRegulation(reg.number)}
                    aria-expanded={isOpen}
                  >
                    <div className="membership-accordion-trigger__left">
                      <span className="membership-accordion-num">
                        {reg.number}
                      </span>
                      <h3 className="membership-accordion-title">
                        {reg.title}
                      </h3>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`membership-accordion-caret ${
                        isOpen ? 'is-rotated' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="membership-accordion-panel">
                      <div className="membership-accordion-clauses">
                        {reg.clauses.map((clause, cIdx) => (
                          <div key={cIdx} className="membership-clause">
                            <p className="membership-clause__text">
                              {clause.code && (
                                <strong className="membership-clause__code">
                                  {clause.code}{' '}
                                </strong>
                              )}
                              {clause.text}
                            </p>
                            {clause.bullets && (
                              <ul className="membership-clause__bullets">
                                {clause.bullets.map((b) => (
                                  <li key={b}>{b}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="membership-regulations-effective">
            Effective date: To be announced
          </p>
        </div>
      </section>
    </>
  );
}
