import { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Reveal } from '../components/ui/Reveal';
import {
  IcrastLayout,
  ICRAST_PARTICIPATE_URL,
} from '../components/icrast/IcrastLayout';
import {
  Mail,
  Building2,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  PhoneCall,
  Calendar,
  Globe,
  ArrowUpRight,
  Compass,
} from 'lucide-react';

export default function IcrastContactPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <IcrastLayout>
      {/* 01. Contact Hero */}
      <section className="icrast-contact-hero">
        <div className="container">
          <Reveal>
            <div className="icrast-contact-hero__content">
              <span className="icrast-kicker">Conference Secretariat</span>
              <h1 className="icrast-contact-hero__title">Get in Touch</h1>
              <p className="icrast-contact-hero__lede">
                Reach out directly to the official secretariat desk, organizing
                chairs, and venue coordinators for assistance with abstract
                submissions, presentations, and conference participation.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 02. Institutional Contact Cards */}
      <section className="icrast-section">
        <div className="container">
          <Reveal>
            <div className="icrast-contact-grid">
              {/* Card 1: Email Desk */}
              <div className="icrast-contact-card icrast-contact-card--blue">
                <div className="icrast-contact-card__top">
                  <div className="icrast-contact-card__icon icrast-contact-card__icon--blue">
                    <Mail size={22} />
                  </div>
                  <span className="icrast-contact-card__tag">Email Inquiries</span>
                </div>
                <span className="icrast-contact-card__label">
                  Official Secretariat Email
                </span>
                <h2 className="icrast-contact-card__title">
                  info@scienceorbitforum.org
                </h2>
                <p className="icrast-contact-card__text">
                  For abstract submissions, acceptance notices, presentation
                  guidelines, and official conference communication.
                </p>
                <div className="icrast-contact-card__actions-list">
                  <a
                    href="mailto:info@scienceorbitforum.org"
                    className="icrast-contact-card__primary-link"
                  >
                    <Mail size={16} />
                    <span>Send Email Message</span>
                  </a>
                </div>
                <div className="icrast-contact-card__footer-info">
                  <Clock size={14} />
                  <span>Mon – Fri · 09:30 AM – 05:30 PM IST</span>
                </div>
              </div>

              {/* Card 2: Phone Helpline */}
              <div className="icrast-contact-card icrast-contact-card--red">
                <div className="icrast-contact-card__top">
                  <div className="icrast-contact-card__icon icrast-contact-card__icon--red">
                    <PhoneCall size={22} />
                  </div>
                  <span className="icrast-contact-card__tag">Phone Support</span>
                </div>
                <span className="icrast-contact-card__label">
                  Helpline / Secretariat Desk
                </span>
                <h2 className="icrast-contact-card__title">
                  +91 81118 05948
                </h2>
                <p className="icrast-contact-card__text">
                  Reach out directly by phone or WhatsApp for urgent delegate
                  queries, submission assistance, or event schedule questions.
                </p>
                <div className="icrast-contact-card__actions-list">
                  <a
                    href="tel:+918111805948"
                    className="icrast-contact-card__primary-link icrast-contact-card__primary-link--phone"
                  >
                    <PhoneCall size={16} />
                    <span>Call +91 81118 05948</span>
                  </a>
                </div>
                <div className="icrast-contact-card__footer-info">
                  <Clock size={14} />
                  <span>Direct delegate assistance helpline</span>
                </div>
              </div>

              {/* Card 3: Conference Location */}
              <div className="icrast-contact-card icrast-contact-card--amber">
                <div className="icrast-contact-card__top">
                  <div className="icrast-contact-card__icon icrast-contact-card__icon--amber">
                    <MapPin size={22} />
                  </div>
                  <span className="icrast-contact-card__tag">Venue Location</span>
                </div>
                <span className="icrast-contact-card__label">
                  Physical Conference Venue
                </span>
                <h2 className="icrast-contact-card__title">
                  University of Calicut
                </h2>
                <p className="icrast-contact-card__text">
                  Prof. M.S. Swaminathan Chair for Science Popularisation and
                  Research, University of Calicut, Thenhipalam, Malappuram
                  District, Kerala 673635, India.
                </p>
                <div className="icrast-contact-card__meta-links">
                  <a
                    href="https://maps.google.com/?q=University+of+Calicut,+Thenhipalam,+Kerala+673635"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icrast-contact-card__sublink"
                  >
                    <MapPin size={14} />
                    <span>Open in Google Maps</span>
                    <ExternalLink size={12} />
                  </a>
                  <Link
                    to="/icrast/venue"
                    className="icrast-contact-card__sublink"
                  >
                    <Compass size={14} />
                    <span>Venue &amp; Travel Guide →</span>
                  </Link>
                </div>
                <div className="icrast-contact-card__footer-info">
                  <MapPin size={14} />
                  <span>Thenhipalam, Malappuram, Kerala</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* 04. Quick Help & Next Step CTA Card */}
          <Reveal delay={100}>
            <div className="icrast-contact-cta-box">
              <div className="icrast-contact-cta-box__accent" />
              <div className="icrast-contact-cta-box__body">
                <div className="icrast-contact-cta-box__content">
                  <span className="icrast-kicker" style={{ color: '#93c5fd' }}>
                    Author &amp; Delegate Assistance
                  </span>
                  <h3 className="icrast-contact-cta-box__title">
                    Ready to participate in ICRAST-26?
                  </h3>
                  <p className="icrast-contact-cta-box__text">
                    Abstract submission is currently open with zero registration
                    fees. Review presentation formats or submit your work
                    before <strong>30 October 2026</strong>.
                  </p>
                </div>
                <div className="icrast-contact-cta-box__actions">
                  <Link
                    to="/icrast/submit"
                    className="icrast-btn icrast-btn--red icrast-btn--lg"
                  >
                    <span>Participate Now</span>
                    <ArrowUpRight size={15} />
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

