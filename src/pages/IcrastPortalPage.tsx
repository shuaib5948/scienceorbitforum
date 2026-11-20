import { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Reveal } from '../components/ui/Reveal';
import {
  IcrastLayout,
  ICRAST_PARTICIPATE_URL,
} from '../components/icrast/IcrastLayout';
import {
  ArrowUpRight,
  ArrowRight,
  FileText,
  Presentation,
  CheckCircle2,
  Users,
  Ticket,
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
    day: '06',
    month: 'NOV 2026',
    label: 'Abstract Submission Deadline',
    color: 'red',
    badge: 'Extended',
  },
  {
    step: '02',
    day: '12',
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

interface IcrastGuest {
  id: string;
  name: string;
  designation: string;
  institution?: string;
  image: string;
  accentColor?: string;
  customStyle?: React.CSSProperties;
}

const GUESTS_AND_SPEAKERS: IcrastGuest[] = [
  {
    id: 'raveendran',
    name: 'Dr. P. Raveendran',
    designation: 'Vice Chancellor',
    institution: 'University of Calicut',
    image: '/images/guest-raveendran.jpg',
    accentColor: '#f51616',
  },
  {
    id: 'shafi',
    name: 'Dr. P. Muhammed Shafi',
    designation: 'Inspire Faculty,\nDepartment of Physics',
    institution: 'NIT Calicut',
    image: '/images/guest-shafi.jpg',
    accentColor: '#3355ff',
  },
  {
    id: 'pramod',
    name: 'Dr. Pramod C.',
    designation: 'Assistant Professor,\nDepartment of Botany',
    institution: 'University of Calicut',
    image: '/images/guest-pramod.jpg',
    accentColor: '#f9ae3b',
  },
  {
    id: 'ali-muhammed',
    name: 'Dr. Ali Muhammad K. S.',
    designation: 'Senior Chemist &\nAPI Specialist',
    institution: 'Molecular Radionuclide Pharmacy Pvt Ltd. Kochi',
    image: '/images/guest-ali.jpg',
    accentColor: '#29b6f6',
  },
  {
    id: 'deepti',
    name: 'Dr. Deepti M',
    designation: 'Assistant Professor,\nDepartment of Biotechnology',
    institution: 'University of Calicut & Director, Students and Industry Relations, Biocodez LLP',
    image: '/images/guest-deepti.jpg',
    accentColor: '#10b981',
    customStyle: {
      objectPosition: 'center 18%',
    },
  },
  {
    id: 'muzammil',
    name: 'Dr. Muzammil NM',
    designation: 'Research Associate',
    institution: 'Center for Nonlinear Dynamics, Trichy',
    image: '/images/guest-muzammil.jpg',
    accentColor: '#f9ae3b',
    customStyle: {
      objectPosition: 'center 15%',
    },
  },
  {
    id: 'sara',
    name: 'Dr. Sara Bologna',
    designation: 'Postdoc',
    institution: 'CEITEC MU, Brno, Czech Republic',
    image: '/images/guest-sara.jpg',
    accentColor: '#3355ff',
    customStyle: {
      transform: 'scale(1.18)',
      objectPosition: 'center 15%',
    },
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

                {/* 3. Action Buttons */}
                <div className="icrast-hero__ctas" style={{ flexWrap: 'wrap' }}>
                  <Link
                    to="/icrast/full-paper"
                    className="icrast-btn icrast-btn--red icrast-btn--lg"
                  >
                    <span>Submit Paper</span>
                    <ArrowUpRight size={16} />
                  </Link>
                  <Link
                    to="/icrast/register"
                    className="icrast-btn icrast-btn--outline-blue icrast-btn--lg"
                  >
                    <span>Register Now</span>
                  </Link>
                  <Link
                    to="/icrast/delegate"
                    className="icrast-btn icrast-btn--lg"
                    style={{
                      backgroundColor: '#185ADB',
                      color: '#ffffff',
                      border: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontWeight: 700,
                      boxShadow: '0 4px 14px rgba(24, 90, 219, 0.25)',
                      textDecoration: 'none',
                    }}
                  >
                    <Ticket size={17} />
                    <span>Delegate Pass</span>
                  </Link>
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
                  <span className="icrast-ticker__item icrast-ticker__item--extended">
                    <span className="icrast-ticker__tag">Active</span>
                    Full Paper Submission Open
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

      {/* 03. Distinguished Guests & Speakers */}
      <section id="guests" className="icrast-section icrast-section--guests">
        <div className="container">
          <Reveal>
            <div className="icrast-section-head">
              <span className="icrast-kicker">Distinguished Dignitaries</span>
              <h2 className="icrast-section-title">
                Guests of Honour &amp; Keynote Speakers
              </h2>
              <p className="icrast-section-sub">
                Eminent academicians, scientists, and leadership gracing
                ICRAST-26:
              </p>
            </div>
          </Reveal>

          <div className="icrast-guests-grid">
            {GUESTS_AND_SPEAKERS.map((guest, index) => (
              <Reveal key={guest.id} delay={index * 35}>
                <div
                  className="icrast-guest-card"
                  style={
                    {
                      '--guest-accent': guest.accentColor,
                      '--guest-border': `${guest.accentColor}33`,
                    } as React.CSSProperties
                  }
                >
                  <div className="icrast-guest-card__image-wrap">
                    <img
                      src={guest.image}
                      alt={guest.name}
                      className="icrast-guest-card__image"
                      style={guest.customStyle}
                      loading="lazy"
                    />
                  </div>

                  <div className="icrast-guest-card__content">
                    <h3 className="icrast-guest-card__name">{guest.name}</h3>
                    <p className="icrast-guest-card__designation">
                      {guest.designation}
                    </p>
                    {guest.institution && (
                      <p className="icrast-guest-card__institution">
                        {guest.institution}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Centered Academic Notice: Upcoming Guests */}
          <Reveal delay={120}>
            <p className="icrast-guests-note">
              More distinguished keynote speakers and guests will be announced soon.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 04. Research Themes */}
      <section id="themes" className="icrast-section">
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

      {/* 05. Important Dates */}
      <section id="dates" className="icrast-section icrast-section--muted">
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
                      {item.badge && (
                        <span className="icrast-step-node__corner-badge">
                          {item.badge}
                        </span>
                      )}
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
                  <span className="icrast-submission-banner__pill icrast-submission-banner__pill--highlight">
                    Full Paper Submission Active
                  </span>
                </div>

                <div className="icrast-submission-banner__actions">
                  <Link
                    to="/icrast/full-paper"
                    className="icrast-btn icrast-btn--red icrast-btn--lg"
                  >
                    <span>Submit Paper</span>
                    <ArrowUpRight size={16} />
                  </Link>
                  <Link
                    to="/icrast/register"
                    className="icrast-btn icrast-btn--outline-white icrast-btn--lg"
                  >
                    <span>Register Now</span>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </IcrastLayout>
  );
}
