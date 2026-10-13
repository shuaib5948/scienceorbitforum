import { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Reveal } from '../components/ui/Reveal';
import {
  IcrastLayout,
  ICRAST_PARTICIPATE_URL,
} from '../components/icrast/IcrastLayout';
import {
  MapPin,
  Calendar,
  Plane,
  Train,
  Car,
  ExternalLink,
  ArrowRight,
  ArrowUpRight,
  Building,
  Hotel,
  Compass,
  Laptop,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Coffee,
  HeartPulse,
  CreditCard,
} from 'lucide-react';

const ATTRACTIONS = [
  {
    name: 'Calicut University Botanical Garden',
    category: 'On-Campus Attraction',
    distance: 'Inside Campus (Walking Distance)',
    description:
      'One of the largest university botanical gardens in India, featuring over 4,000 plant species, living ginger collections, and premier flora conservation.',
    mapsUrl:
      'https://maps.google.com/?q=Calicut+University+Botanical+Garden,+Thenhipalam',
    image:
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=70',
  },
  {
    name: 'Kozhikode Beach',
    category: 'Coastal Destination',
    distance: 'Approx. 24 km from Campus',
    description:
      'Historic shoreline promenade renowned for century-old piers, sweeping sunset horizons, and authentic Malabar coastal cuisine.',
    mapsUrl: 'https://maps.google.com/?q=Kozhikode+Beach,+Kerala',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=70',
  },
  {
    name: 'Kadalundi Bird Sanctuary',
    category: 'Biodiversity Hotspot',
    distance: 'Approx. 16 km from Campus',
    description:
      'A serene riverine estuary and mangrove reserve sheltered where the Kadalundi River meets the Arabian Sea, home to over 100 migratory bird species.',
    mapsUrl:
      'https://maps.google.com/?q=Kadalundi+Bird+Sanctuary,+Kozhikode',
    image:
      'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&q=70',
  },
  {
    name: 'Regional Science Centre & Planetarium',
    category: 'Science & Discovery',
    distance: 'Approx. 22 km from Campus',
    description:
      'Premier interactive science museum and digital planetarium in Kozhikode showcasing hands-on physics galleries, life sciences, and sky shows.',
    mapsUrl:
      'https://maps.google.com/?q=Regional+Science+Centre+and+Planetarium,+Calicut',
    image:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=70',
  },
];

export default function IcrastVenuePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <IcrastLayout>
      {/* 01. Venue Hero Section */}
      <section className="icrast-venue-hero">
        <div className="container">
          <Reveal>
            <div className="icrast-venue-hero__layout">
              <div className="icrast-venue-hero__content">
                <span className="icrast-kicker">Conference Venue</span>
                <h1 className="icrast-venue-hero__title">
                  University of Calicut
                </h1>
                <p className="icrast-venue-hero__subtitle">
                  International Conference on Recent Advancements in Science and
                  Technology 2026 (ICRAST-26)
                </p>

                <div className="icrast-venue-hero__meta">
                  <span className="icrast-venue-hero__meta-item">
                    <MapPin size={16} />
                    <span>Thenhipalam, Malappuram, Kerala, India</span>
                  </span>
                  <span className="icrast-venue-hero__meta-dot" />
                  <span className="icrast-venue-hero__meta-item">
                    <Calendar size={16} />
                    <span>21 November 2026</span>
                  </span>
                </div>

                <div className="icrast-venue-hero__actions">
                  <a
                    href="https://maps.google.com/?q=University+of+Calicut,+Thenhipalam,+Kerala+673635"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icrast-btn icrast-btn--red icrast-btn--lg"
                  >
                    <MapPin size={16} />
                    <span>View on Google Maps</span>
                    <ExternalLink size={14} />
                  </a>
                  <a
                    href="#directions"
                    className="icrast-btn icrast-btn--outline-navy icrast-btn--lg"
                  >
                    <span>Plan Your Visit</span>
                    <ArrowRight size={15} />
                  </a>
                </div>
              </div>

              <div className="icrast-venue-hero__visual">
                <div className="icrast-venue-hero__visual-card">
                  <img
                    src="/images/calicut-university-campus.png"
                    alt="University of Calicut Campus, Thenhipalam"
                    className="icrast-venue-hero__img"
                  />
                  <div className="icrast-venue-hero__visual-caption">
                    <span className="icrast-venue-hero__caption-badge">
                      <Building size={14} />
                      <span>Main University Campus · Thenhipalam</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 02. About the Venue */}
      <section className="icrast-section">
        <div className="container">
          <Reveal>
            <div className="icrast-venue-about-card">
              <div
                className="icrast-venue-about-card__accent"
                aria-hidden="true"
              />
              <div className="icrast-venue-about-card__body">
                <div className="icrast-section-head">
                  <span className="icrast-kicker">About the Venue</span>
                  <h2 className="icrast-section-title">
                    Welcome to the University of Calicut
                  </h2>
                </div>

                <div className="icrast-venue-about-grid">
                  <div className="icrast-venue-about-text">
                    <p className="icrast-body-text">
                      ICRAST-26 will bring together researchers, academicians,
                      students, and science professionals at the University of
                      Calicut, Kerala, India. The conference provides an
                      international scholarly platform to share original
                      findings, discuss scientific breakthroughs, and explore
                      emerging technologies across biotechnology and frontier
                      disciplines.
                    </p>
                    <p className="icrast-body-text">
                      Organized in collaboration with the Prof. M.S. Swaminathan
                      Chair for Science Popularisation and Research, University
                      of Calicut, the conference will be conducted in hybrid
                      mode—enabling participation through both in-person sessions
                      on campus and live virtual presentation rooms online.
                    </p>
                  </div>

                  <div className="icrast-venue-highlights">
                    <div className="icrast-venue-highlight-item">
                      <Building size={20} />
                      <div>
                        <strong>Premier State University</strong>
                        <span>
                          Established in 1968, the largest university in Kerala
                          by student strength and department footprint.
                        </span>
                      </div>
                    </div>
                    <div className="icrast-venue-highlight-item">
                      <Compass size={20} />
                      <div>
                        <strong>Thenhipalam Main Campus</strong>
                        <span>
                          Over 500 acres of lush green campus situated directly
                          along National Highway 66.
                        </span>
                      </div>
                    </div>
                    <div className="icrast-venue-highlight-item">
                      <ShieldCheck size={20} />
                      <div>
                        <strong>Scientific Heritage</strong>
                        <span>
                          Home to state-of-the-art research laboratories,
                          botanical collections, and academic chairs.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 03. Location & Directions */}
      <section id="directions" className="icrast-section icrast-section--muted">
        <div className="container">
          <Reveal>
            <div className="icrast-section-head">
              <span className="icrast-kicker">Location &amp; Travel</span>
              <h2 className="icrast-section-title">How to Reach the Venue</h2>
              <p className="icrast-section-sub">
                The University of Calicut is conveniently accessible via air,
                rail, and road corridors across Kerala.
              </p>
            </div>
          </Reveal>

          {/* 3 Transit Modes Grid */}
          <div className="icrast-transit-grid">
            {/* By Air */}
            <Reveal delay={30}>
              <div className="icrast-transit-card icrast-transit-card--red">
                <div className="icrast-transit-card__icon icrast-transit-card__icon--red">
                  <Plane size={24} />
                </div>
                <span className="icrast-transit-card__tag">By Air</span>
                <h3 className="icrast-transit-card__title">
                  Calicut International Airport (CCJ)
                </h3>
                <span className="icrast-transit-card__dist">
                  Approx. 12 km from Campus · 20–25 Mins
                </span>
                <p className="icrast-transit-card__text">
                  Karipur Airport is the closest airport to the university.
                  Pre-paid airport taxis and app cabs are available 24/7 directly
                  outside the arrival terminal to Thenhipalam campus.
                </p>
                <a
                  href="https://maps.google.com/?q=Calicut+International+Airport+to+University+of+Calicut"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icrast-transit-card__link"
                >
                  <span>View Airport Route</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </Reveal>

            {/* By Train */}
            <Reveal delay={60}>
              <div className="icrast-transit-card icrast-transit-card--amber">
                <div className="icrast-transit-card__icon icrast-transit-card__icon--amber">
                  <Train size={24} />
                </div>
                <span className="icrast-transit-card__tag">By Train</span>
                <h3 className="icrast-transit-card__title">
                  Kozhikode Railway Station (CLT)
                </h3>
                <span className="icrast-transit-card__dist">
                  Approx. 23 km from Campus · 40–50 Mins
                </span>
                <p className="icrast-transit-card__text">
                  Kozhikode (CLT) is a major Southern Railway junction connected
                  nationwide. Frequent KSRTC and private express buses run along
                  the NH 66 corridor directly to the university gate. Parappanangadi
                  (PGI) is also nearby (13 km).
                </p>
                <a
                  href="https://maps.google.com/?q=Kozhikode+Railway+Station+to+University+of+Calicut"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icrast-transit-card__link"
                >
                  <span>View Train Route</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </Reveal>

            {/* By Road */}
            <Reveal delay={90}>
              <div className="icrast-transit-card icrast-transit-card--sky">
                <div className="icrast-transit-card__icon icrast-transit-card__icon--sky">
                  <Car size={24} />
                </div>
                <span className="icrast-transit-card__tag">By Road</span>
                <h3 className="icrast-transit-card__title">
                  National Highway 66 (NH 66)
                </h3>
                <span className="icrast-transit-card__dist">
                  Direct Highway Stop at University Main Gate
                </span>
                <p className="icrast-transit-card__text">
                  Located in Thenhipalam, Malappuram district, directly on NH 66.
                  All express buses connecting Kozhikode with Malappuram,
                  Thrissur, and Ernakulam stop right at the University of
                  Calicut gate.
                </p>
                <a
                  href="https://maps.google.com/?q=University+of+Calicut,+Thenhipalam,+Kerala"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icrast-transit-card__link"
                >
                  <span>View Highway Route</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </Reveal>
          </div>

          {/* Embedded Google Map */}
          <Reveal delay={120}>
            <div className="icrast-map-wrapper">
              <div className="icrast-map-wrapper__bar">
                <div className="icrast-map-wrapper__info">
                  <MapPin size={16} />
                  <span>
                    University of Calicut, Thenhipalam, Malappuram, Kerala 673635
                  </span>
                </div>
                <a
                  href="https://maps.google.com/?q=University+of+Calicut,+Thenhipalam,+Kerala+673635"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icrast-map-wrapper__ext"
                >
                  <span>Open Full Screen in Google Maps</span>
                  <ExternalLink size={13} />
                </a>
              </div>
              <iframe
                title="University of Calicut Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.887858021884!2d75.88939227583693!3d11.121703652723687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba650304a5bf4d3%3A0x6bfe76e27a69fb04!2sUniversity%20of%20Calicut!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="390"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 04. Explore Nearby Attractions */}
      <section className="icrast-section">
        <div className="container">
          <Reveal>
            <div className="icrast-section-head">
              <span className="icrast-kicker">Regional Discovery</span>
              <h2 className="icrast-section-title">Discover the Region</h2>
              <p className="icrast-section-sub">
                Explore key botanical, ecological, and cultural landmarks during
                your visit to the University of Calicut:
              </p>
            </div>
          </Reveal>

          <div className="icrast-attractions-grid">
            {ATTRACTIONS.map((spot, idx) => (
              <Reveal key={spot.name} delay={idx * 30}>
                <div className="icrast-attraction-card">
                  <div className="icrast-attraction-card__media">
                    <img src={spot.image} alt={spot.name} loading="lazy" />
                    <span className="icrast-attraction-card__cat">
                      {spot.category}
                    </span>
                  </div>
                  <div className="icrast-attraction-card__body">
                    <span className="icrast-attraction-card__dist">
                      {spot.distance}
                    </span>
                    <h3 className="icrast-attraction-card__title">
                      {spot.name}
                    </h3>
                    <p className="icrast-attraction-card__desc">
                      {spot.description}
                    </p>
                    <a
                      href={spot.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icrast-attraction-card__link"
                    >
                      <span>Explore on Map</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Need Help Planning Your Visit? Contact & Actions */}
      <section className="icrast-section">
        <div className="container">
          <Reveal>
            <div className="icrast-venue-contact-box">
              <div
                className="icrast-venue-contact-box__accent"
                aria-hidden="true"
              />
              <div className="icrast-venue-contact-box__content">
                <span className="icrast-kicker">Visitor Secretariat</span>
                <h2 className="icrast-venue-contact-box__title">
                  Need Help Planning Your Visit?
                </h2>
                <p className="icrast-venue-contact-box__text">
                  For venue directions, special accessibility arrangements, or
                  conference-related travel questions, contact the ICRAST-26
                  organizing secretariat.
                </p>

                <div className="icrast-venue-contact-box__links">
                  <Link
                    to="/icrast/contact"
                    className="icrast-btn icrast-btn--red"
                  >
                    <span>Contact Us</span>
                    <ArrowRight size={16} />
                  </Link>
                  <a
                    href="mailto:info@scienceorbitforum.org"
                    className="icrast-btn icrast-btn--outline-navy"
                  >
                    <Mail size={16} />
                    <span>info@scienceorbitforum.org</span>
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
