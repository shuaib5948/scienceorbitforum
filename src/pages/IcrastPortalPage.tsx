import { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Reveal } from '../components/ui/Reveal';
import {
  IcrastLayout,
  ICRAST_PARTICIPATE_URL,
  ICRAST_GUIDELINES_DOWNLOAD_URL,
} from '../components/icrast/IcrastLayout';
import {
  ArrowUpRight,
  ArrowRight,
  Download,
  FileText,
  Presentation,
  CheckCircle2,
  Users,
} from 'lucide-react';

const RESEARCH_THEMES = [
  'Molecular Biology and Genetic Engineering',
  'Advanced Functional Materials and Biomaterials',
  'Tissue Engineering and Regenerative Medicine',
  'Biosensors and Diagnostic Technologies',
  'Marine Science and Marine Biotechnology',
  'Space Science and Space Biotechnology',
  'Agricultural Science and Precision Agriculture',
  'Environmental Science and Environmental Engineering',
  'Renewable Energy and Storage Technologies',
  'Chemical Engineering and Process Engineering',
  'Nanoscience and Nanotechnology',
];

const IMPORTANT_DATES = [
  {
    step: '01',
    day: '30',
    month: 'OCT 2026',
    label: 'Abstract Submission Deadline',
    color: 'red',
  },
  {
    step: '02',
    day: '09',
    month: 'NOV 2026',
    label: 'Acceptance Notification',
    color: 'amber',
  },
  {
    step: '03',
    day: '15',
    month: 'NOV 2026',
    label: 'Full Paper Submission',
    color: 'sky',
  },
  {
    step: '04',
    day: '21',
    month: 'NOV 2026',
    label: 'Conference Presentation',
    color: 'blue',
    isFinal: true,
  },
];

export default function IcrastPortalPage() {
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

  return (
    <IcrastLayout>
      {/* 01. Hero Section */}
      <section className="icrast-hero">
        <div className="container icrast-hero__container">
          <Reveal>
            <div className="icrast-hero__layout">
              <div className="icrast-hero__main">
                {/* 1. Concise Main Heading */}
                <h1 className="icrast-hero__heading">
                  International Conference on Recent Advancements in Science and
                  Technology 2026
                </h1>

                {/* 2. Clean Editorial Theme & Collaboration Lines */}
                <p className="icrast-hero__theme-line">
                  <span>Theme:</span> Advances in Biotechnology and Frontier
                  Sciences for Human Well-Being.
                </p>

                <p className="icrast-hero__collaboration">
                  <span className="icrast-hero__collab-line">
                    In collaboration with Prof. M.S. Swaminathan Chair for
                    Science Popularisation and Research,
                  </span>
                  <strong className="icrast-hero__collab-uni">
                    University of Calicut
                  </strong>
                </p>

                {/* 3. Action Button */}
                <div className="icrast-hero__ctas">
                  <Link
                    to="/icrast/submit"
                    className="icrast-btn icrast-btn--red icrast-btn--lg"
                  >
                    <span>Participate Now</span>
                    <ArrowUpRight size={16} />
                  </Link>
                  <a
                    href={ICRAST_GUIDELINES_DOWNLOAD_URL}
                    download="ICRAST-26-Presentation-Guidelines.pdf"
                    className="icrast-btn icrast-btn--outline-blue icrast-btn--lg"
                  >
                    <Download size={15} />
                    <span>Presentation Guidelines</span>
                  </a>
                </div>
              </div>

              {/* 4. Uncropped Right-Side Biotechnology Illustration */}
              <div className="icrast-hero__visual">
                <img
                  src="/images/icrast-hero-side.png"
                  alt="Biotechnology and Frontier Sciences"
                  className="icrast-hero__side-img"
                />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Bottom Screen-Edge Horizontal Scrolling Ticker */}
        <div className="icrast-hero__bottom-strip">
          <div className="icrast-hero__flicker-line" aria-hidden="true" />
          <div className="icrast-ticker" aria-label="ICRAST-26 Key Highlights">
            <div className="icrast-ticker__track">
              {[0, 1, 2, 3, 4, 5].map((groupIdx) => (
                <div
                  key={groupIdx}
                  className="icrast-ticker__group"
                  aria-hidden={groupIdx > 0}
                >
                  <span className="icrast-ticker__item icrast-ticker__item--code">
                    ICRAST-26
                  </span>
                  <span className="icrast-ticker__dot" />
                  <span className="icrast-ticker__item">21th Nov 2026</span>
                  <span className="icrast-ticker__dot" />
                  <span className="icrast-ticker__item">Hybrid Mode</span>
                  <span className="icrast-ticker__dot" />
                  <span className="icrast-ticker__item icrast-ticker__item--free">
                    Free Registration
                  </span>
                  <span className="icrast-ticker__dot" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 02. About the Conference */}
      <section id="about" className="icrast-section">
        <div className="container">
          <Reveal>
            <div className="icrast-about-grid">
              <div className="icrast-about-main">
                <span className="icrast-kicker">About the Conference</span>
                <h2 className="icrast-section-title">
                  Advancing Biotechnology and Frontier Sciences for Human
                  Well-Being
                </h2>

                <p className="icrast-body-text">
                  The International Conference on Recent Advancements in Science
                  and Technology 2026 (ICRAST-26) is an international
                  interdisciplinary academic conference organized by Science
                  Orbit Forum in collaboration with the Prof. M.S. Swaminathan
                  Chair for Science Popularisation and Research, University of
                  Calicut. Centered on the theme Advances in Biotechnology and
                  Frontier Sciences for Human Well-Being, the conference convenes
                  scientists, faculty members, research scholars, and students
                  worldwide to share original research, foster collaborative
                  discovery, and examine translational advancements that directly
                  contribute to health, sustainability, and societal well-being.
                </p>

                {/* Concise Color-Themed Key Facts Strip */}
                <div className="icrast-about-facts">
                  <div className="icrast-about-fact icrast-about-fact--red">
                    <span className="icrast-about-fact__label">Date</span>
                    <strong className="icrast-about-fact__value">
                      21th Nov 2026
                    </strong>
                  </div>
                  <div className="icrast-about-fact icrast-about-fact--amber">
                    <span className="icrast-about-fact__label">Format</span>
                    <strong className="icrast-about-fact__value">
                      Hybrid Mode
                    </strong>
                  </div>
                  <div className="icrast-about-fact icrast-about-fact--sky">
                    <span className="icrast-about-fact__label">Venue</span>
                    <strong className="icrast-about-fact__value">
                      Univ. of Calicut
                    </strong>
                  </div>
                  <div className="icrast-about-fact icrast-about-fact--blue">
                    <span className="icrast-about-fact__label">Fee</span>
                    <strong className="icrast-about-fact__value icrast-about-fact__value--accent">
                      Free Registration
                    </strong>
                  </div>
                </div>
              </div>

              {/* Right Column: Concise Color-Coded Conference Objectives Card */}
              <div className="icrast-objectives-card">
                <div
                  className="icrast-objectives-card__accent"
                  aria-hidden="true"
                />
                <div className="icrast-objectives-card__body">
                  <h3 className="icrast-objectives-card__title">
                    Conference Objectives
                  </h3>
                  <ul className="icrast-objectives-list">
                    <li>
                      <span className="icrast-objectives-list__num icrast-objectives-list__num--red">
                        01
                      </span>
                      <div>
                        <strong>Frontier Research Exchange</strong>
                        <p>
                          Share breakthroughs in biotechnology, materials, and
                          applied sciences.
                        </p>
                      </div>
                    </li>
                    <li>
                      <span className="icrast-objectives-list__num icrast-objectives-list__num--amber">
                        02
                      </span>
                      <div>
                        <strong>Academic Collaboration</strong>
                        <p>
                          Connect universities, laboratories, and early-career
                          researchers.
                        </p>
                      </div>
                    </li>
                    <li>
                      <span className="icrast-objectives-list__num icrast-objectives-list__num--sky">
                        03
                      </span>
                      <div>
                        <strong>Inclusive Hybrid Access</strong>
                        <p>
                          Enable zero-fee global participation through in-person
                          and online sessions.
                        </p>
                      </div>
                    </li>
                    <li>
                      <span className="icrast-objectives-list__num icrast-objectives-list__num--blue">
                        04
                      </span>
                      <div>
                        <strong>Science for Human Well-Being</strong>
                        <p>
                          Promote translational solutions for health,
                          agriculture, and sustainability.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 03. Research Themes */}
      <section id="themes" className="icrast-section icrast-section--muted">
        <div className="container">
          <Reveal>
            <div className="icrast-section-head">
              <span className="icrast-kicker">Conference Themes</span>
              <h2 className="icrast-section-title">
                Thematic Areas &amp; Research Tracks
              </h2>
              <p className="icrast-section-sub">
                Original research abstracts and posters are invited across 11
                interdisciplinary tracks:
              </p>
            </div>
          </Reveal>

          <div className="icrast-themes-grid">
            {RESEARCH_THEMES.map((topic, index) => {
              const num = String(index + 1).padStart(2, '0');
              const colorVariant = ['red', 'amber', 'sky', 'blue'][index % 4];
              return (
                <Reveal key={topic} delay={index * 25}>
                  <div
                    className={`icrast-theme-card icrast-theme-card--${colorVariant}`}
                  >
                    <span
                      className={`icrast-theme-card__num icrast-theme-card__num--${colorVariant}`}
                    >
                      {num}
                    </span>
                    <h3 className="icrast-theme-card__title">{topic}</h3>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 04. Important Dates */}
      <section id="dates" className="icrast-section">
        <div className="container">
          <Reveal>
            <div className="icrast-section-head">
              <span className="icrast-kicker">Key Deadlines</span>
              <h2 className="icrast-section-title">
                Important Dates &amp; Deadlines
              </h2>
              <p className="icrast-section-sub">
                Key milestones for abstract submission, peer notification, and
                conference presentation:
              </p>
            </div>
          </Reveal>

          <Reveal delay={50}>
            <div className="icrast-stepper-chain">
              <div className="icrast-stepper-chain__line" aria-hidden="true" />
              <div className="icrast-stepper-chain__grid">
                {IMPORTANT_DATES.map((item) => (
                  <div
                    key={item.step}
                    className={`icrast-step-node icrast-step-node--${item.color} ${
                      item.isFinal ? 'icrast-step-node--final' : ''
                    }`}
                  >
                    <div className="icrast-step-node__marker">
                      <span className="icrast-step-node__num">{item.step}</span>
                    </div>

                    <div className="icrast-step-node__card">
                      <div className="icrast-step-node__cal">
                        <span className="icrast-step-node__month">
                          {item.month}
                        </span>
                        <span className="icrast-step-node__day">
                          {item.day}
                        </span>
                      </div>
                      <h3 className="icrast-step-node__title">{item.label}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 05. Submission and Presentation */}
      <section id="submission" className="icrast-section">
        <div className="container">
          <Reveal>
            <div className="icrast-submission-banner">
              <div
                className="icrast-submission-banner__accent"
                aria-hidden="true"
              />
              <div className="icrast-submission-banner__content">
                <span className="icrast-submission-banner__kicker">
                  Call for Abstracts &amp; Presentations
                </span>
                <h2 className="icrast-submission-banner__title">
                  Submit Your Abstract for ICRAST-26
                </h2>
                <p className="icrast-submission-banner__text">
                  Authors and researchers are invited to submit original
                  abstracts (250–300 words) across our 11 interdisciplinary
                  tracks. Present your findings through oral or poster sessions
                  in hybrid mode with completely free registration.
                </p>

                <div className="icrast-submission-banner__pills">
                  <span className="icrast-submission-banner__pill">
                    Hybrid Mode (Online &amp; In-Person)
                  </span>
                  <span className="icrast-submission-banner__pill">
                    100% Free Registration
                  </span>
                  <span className="icrast-submission-banner__pill">
                    Deadline: 30th Oct 2026
                  </span>
                </div>

                <div className="icrast-submission-banner__actions">
                  <Link
                    to="/icrast/submit"
                    className="icrast-btn icrast-btn--red icrast-btn--lg"
                  >
                    <span>Participate Now</span>
                    <ArrowUpRight size={16} />
                  </Link>

                  <a
                    href={ICRAST_GUIDELINES_DOWNLOAD_URL}
                    download="ICRAST-26-Presentation-Guidelines.pdf"
                    className="icrast-submission-banner__link"
                  >
                    <Download size={15} />
                    <span>Download Presentation Guidelines</span>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </IcrastLayout>
  );
}
