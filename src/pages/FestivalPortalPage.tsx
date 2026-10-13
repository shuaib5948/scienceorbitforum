import { Reveal } from '../components/ui/Reveal';
import { OrbOrnament } from '../components/ui/OrbOrnament';
import { Calendar, MapPin, Sparkles, Atom, Cpu, Compass, CheckCircle2, ArrowLeft, Rocket, Users, Award } from 'lucide-react';

function getMainSiteUrl(): string {
  if (typeof window === 'undefined') return '/';
  const { protocol, hostname, port } = window.location;
  const baseHost = hostname.replace(/^(icrast|festival)\./i, '');
  const portSuffix = port ? `:${port}` : '';
  if (baseHost !== hostname) {
    return `${protocol}//${baseHost}${portSuffix}`;
  }
  return '/events';
}

export default function FestivalPortalPage() {
  const mainSiteUrl = getMainSiteUrl();

  const zones = [
    {
      icon: Atom,
      title: 'Live Science & Physics Pavilions',
      desc: 'Hands-on experimental zones demonstrating optics, electromagnetism, fluid dynamics, and chemical reactions in real time.',
    },
    {
      icon: Cpu,
      title: 'Robotics, AI & Maker Arena',
      desc: 'Student-built autonomous robots, IoT prototypes, coding challenges, and hardware hackathons solving real-world problems.',
    },
    {
      icon: Compass,
      title: 'Astronomy & Space Exploration Dome',
      desc: 'Solar observation sessions, evening telescope sky-watching, astrophotography exhibitions, and space science talks.',
    },
    {
      icon: Sparkles,
      title: 'Inter-Institutional Project Expo',
      desc: 'Flagship competition showcasing working models and research posters by high school, undergraduate, and postgraduate teams.',
    },
  ];

  const scheduleDays = [
    {
      day: 'Day 01 · 15 March 2026',
      title: 'Grand Inauguration & Exhibition Opening',
      events: 'Inaugural ceremony, keynote address, opening of Science Pavilions, and School Innovation Showcase.',
    },
    {
      day: 'Day 02 · 16 March 2026',
      title: 'Workshops, Hackathons & Evening Sky Watch',
      events: 'Live STEM workshops, Robotics & Coding Sprint, Public Science Talks, and night-sky telescope session.',
    },
    {
      day: 'Day 03 · 17 March 2026',
      title: 'Final Evaluations & Science Orbit Awards',
      events: 'Project judging by academic panel, Science Quiz Grand Finale, Valedictory ceremony & Innovation Awards.',
    },
  ];

  return (
    <div className="subdomain-portal subdomain-portal--festival">
      {/* Hero Banner */}
      <section className="subdomain-hero subdomain-hero--festival">
        <div className="subdomain-hero__orb" aria-hidden="true">
          <OrbOrnament />
        </div>

        <div className="container subdomain-hero__inner">
          <Reveal>
            <div className="subdomain-hero__top-bar">
              <a href={mainSiteUrl} className="subdomain-hero__back-link">
                <ArrowLeft size={16} />
                <span>Science Orbit Forum</span>
              </a>
              <span className="subdomain-hero__domain-pill">festival.scienceorbitforum.org</span>
            </div>

            <div className="subdomain-hero__badges">
              <span className="subdomain-badge subdomain-badge--cyan">Flagship Annual Festival</span>
              <span className="subdomain-badge subdomain-badge--outline">3 Days · Open to All</span>
            </div>

            <h1 className="subdomain-hero__title">
              Science Orbit Festival 2026
            </h1>
            <p className="subdomain-hero__subtitle">
              A Three-Day Celebration of Scientific Curiosity, Live Experiments, Exhibitions &amp; Collaborative Discovery
            </p>

            <div className="subdomain-hero__meta-grid">
              <div className="subdomain-hero__meta-card">
                <Calendar size={20} className="subdomain-hero__meta-icon" />
                <div>
                  <span className="subdomain-hero__meta-label">Dates</span>
                  <strong className="subdomain-hero__meta-value">15 – 17 March 2026</strong>
                </div>
              </div>

              <div className="subdomain-hero__meta-card">
                <MapPin size={20} className="subdomain-hero__meta-icon" />
                <div>
                  <span className="subdomain-hero__meta-label">Venue</span>
                  <strong className="subdomain-hero__meta-value">Main Campus Grounds &amp; Science Pavilions</strong>
                </div>
              </div>

              <div className="subdomain-hero__meta-card">
                <Users size={20} className="subdomain-hero__meta-icon" />
                <div>
                  <span className="subdomain-hero__meta-label">Participation</span>
                  <strong className="subdomain-hero__meta-value">Students, Researchers, Educators &amp; Public</strong>
                </div>
              </div>
            </div>

            <div className="subdomain-hero__actions">
              <a href="#register-festival" className="subdomain-btn subdomain-btn--primary">
                <Rocket size={17} />
                <span>Register Exhibit / Attend</span>
              </a>
              <a href="#festival-zones" className="subdomain-btn subdomain-btn--ghost">
                <Sparkles size={17} />
                <span>Explore Festival Zones</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* About & Schedule */}
      <section className="subdomain-section">
        <div className="container">
          <div className="subdomain-split">
            <Reveal>
              <span className="subdomain-eyebrow">About the Festival</span>
              <h2 className="subdomain-heading">Where Science Comes Alive Beyond the Classroom</h2>
              <div className="subdomain-feature-image-wrap">
                <img
                  src="/images/science-orbit-festival.jpg"
                  alt="Science Orbit Festival 2026 Exhibition Hall"
                  className="subdomain-feature-image"
                />
              </div>
              <p className="subdomain-text">
                <strong>Science Orbit Festival 2026</strong> is our flagship three-day public science gathering designed to spark wonder, hands-on experimentation, and interdisciplinary dialogue among students, researchers, and the wider community.
              </p>
              <p className="subdomain-text">
                Featuring interactive pavilions, live laboratory demonstrations, student project competitions, and evening astronomy sessions, the festival transforms complex scientific concepts into engaging, memorable experiences for all ages.
              </p>

              <div className="subdomain-highlights-list">
                <div className="subdomain-highlight-item">
                  <CheckCircle2 size={18} />
                  <span>50+ interactive student exhibitions &amp; live science booths</span>
                </div>
                <div className="subdomain-highlight-item">
                  <CheckCircle2 size={18} />
                  <span>Hands-on workshops in physics, chemistry, robotics &amp; astronomy</span>
                </div>
                <div className="subdomain-highlight-item">
                  <CheckCircle2 size={18} />
                  <span>Open entry for school groups, families &amp; science enthusiasts</span>
                </div>
              </div>
            </Reveal>

            {/* 3-Day Schedule Overview */}
            <Reveal delay={100}>
              <div className="subdomain-timeline-card">
                <div className="subdomain-timeline-card__header">
                  <Calendar size={20} />
                  <h3>3-Day Programme Overview</h3>
                </div>
                <div className="subdomain-timeline-list">
                  {scheduleDays.map((item) => (
                    <div key={item.day} className="subdomain-timeline-item">
                      <div className="subdomain-timeline-item__dot" />
                      <div className="subdomain-timeline-item__body">
                        <span className="subdomain-timeline-item__status">{item.day}</span>
                        <h4>{item.title}</h4>
                        <p>{item.events}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Festival Zones */}
      <section id="festival-zones" className="subdomain-section subdomain-section--muted">
        <div className="container">
          <Reveal>
            <div className="subdomain-section-header">
              <span className="subdomain-eyebrow">Experiences &amp; Pavilions</span>
              <h2 className="subdomain-heading">Featured Festival Zones</h2>
              <p className="subdomain-lede">
                Discover four dedicated experiential zones across the campus grounds:
              </p>
            </div>
          </Reveal>

          <div className="subdomain-cards-grid">
            {zones.map((zone, idx) => {
              const IconComponent = zone.icon;
              return (
                <Reveal key={zone.title} delay={idx * 70}>
                  <article className="subdomain-track-card">
                    <div className="subdomain-track-card__icon">
                      <IconComponent size={22} />
                    </div>
                    <h3 className="subdomain-track-card__title">{zone.title}</h3>
                    <p className="subdomain-track-card__desc">{zone.desc}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Registration Banner */}
      <section id="register-festival" className="subdomain-section">
        <div className="container">
          <Reveal>
            <div className="subdomain-cta-banner">
              <div className="subdomain-cta-banner__content">
                <span className="subdomain-badge subdomain-badge--cyan">Exhibitor &amp; Visitor Registration</span>
                <h2>Showcase Your Project at Science Orbit Festival 2026</h2>
                <p>
                  Whether you are presenting a working science model, competing in the inter-institutional quiz, or visiting with your school or institution, register early to secure your slot.
                </p>

                <div className="subdomain-cta-stats">
                  <div className="subdomain-cta-stat">
                    <Calendar size={18} />
                    <span>15 – 17 March 2026</span>
                  </div>
                  <div className="subdomain-cta-stat">
                    <Award size={18} />
                    <span>Innovation &amp; Expo Awards</span>
                  </div>
                  <div className="subdomain-cta-stat">
                    <Users size={18} />
                    <span>Open to Schools &amp; Colleges</span>
                  </div>
                </div>
              </div>

              <div className="subdomain-cta-banner__action">
                <a href="/join" className="subdomain-btn subdomain-btn--primary">
                  <span>Register Now</span>
                  <Rocket size={16} />
                </a>
                <a href={mainSiteUrl} className="subdomain-btn subdomain-btn--ghost">
                  <span>Back to Main Forum</span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
