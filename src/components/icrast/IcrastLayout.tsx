import type { ReactNode } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';

/**
 * Direct Google Forms links for Submit Abstract and Register Free.
 * Replace these placeholder Google Form URLs with your live form links when ready.
 */
export const ICRAST_PARTICIPATE_URL = '/icrast/submit';
export const ICRAST_SUBMIT_ABSTRACT_URL = '/icrast/submit';
export const ICRAST_REGISTER_FREE_URL = '/icrast/submit';
export const ICRAST_GUIDELINES_DOWNLOAD_URL =
  '/docs/ICRAST-26-Presentation-Guidelines.pdf';

function getMainSiteUrl(): string {
  if (typeof window === 'undefined') return '/';
  const { protocol, hostname, port } = window.location;
  const baseHost = hostname.replace(/^(icrast|festival)\./i, '');
  const portSuffix = port ? `:${port}` : '';
  if (baseHost !== hostname) {
    return `${protocol}//${baseHost}${portSuffix}`;
  }
  return '/';
}

interface IcrastLayoutProps {
  children: ReactNode;
}

export function IcrastLayout({ children }: IcrastLayoutProps) {
  const { pathname } = useLocation();
  const mainSiteUrl = getMainSiteUrl();
  const isContactPage = pathname.endsWith('/contact');
  const isVenuePage = pathname.endsWith('/venue');
  const isHomePage = !isContactPage && !isVenuePage;

  return (
    <div className="icrast-portal">
      {/* Top 5-Color ICRAST Logo Spectrum Line */}
      <div className="icrast-spectrum-bar" aria-hidden="true" />

      {/* Minimal Academic Conference Header */}
      <header className="icrast-topbar">
        <div className="container icrast-topbar__inner">
          {/* Brand: ICRAST-26 | Science Orbit Forum */}
          <Link to="/icrast" className="icrast-topbar__brand">
            <img
              src="/images/icrast-logo-mark.png"
              alt="ICRAST-26 Logo"
              className="icrast-topbar__logo"
            />
            <div className="icrast-topbar__titles">
              <span className="icrast-topbar__title">ICRAST-26</span>
              <span className="icrast-topbar__subtitle">
                Science Orbit Forum
              </span>
            </div>
          </Link>

          {/* 6 Main Navigation Items: Home · About · Themes · Important Dates · Venue · Contact */}
          <nav className="icrast-topbar__nav" aria-label="ICRAST-26 Navigation">
            <Link
              to="/icrast"
              className={`icrast-topbar__link ${isHomePage ? 'is-active' : ''}`}
            >
              Home
            </Link>
            <a href="/icrast#about" className="icrast-topbar__link">
              About
            </a>
            <a href="/icrast#themes" className="icrast-topbar__link">
              Themes
            </a>
            <a href="/icrast#dates" className="icrast-topbar__link">
              Important Dates
            </a>
            <Link
              to="/icrast/venue"
              className={`icrast-topbar__link ${isVenuePage ? 'is-active' : ''}`}
            >
              Venue
            </Link>
            <Link
              to="/icrast/contact"
              className={`icrast-topbar__link ${
                isContactPage ? 'is-active' : ''
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Primary Action Button: Link to dedicated Abstract Submission Form */}
          <div className="icrast-topbar__actions">
            <Link
              to="/icrast/submit"
              className="icrast-btn icrast-btn--primary"
            >
              <span>Participate Now</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="icrast-portal__body">{children}</div>

      {/* 06. Standard Streamlined Conference Footer */}
      <footer className="icrast-site-footer">
        <div className="container">
          <div className="icrast-site-footer__main">
            <div className="icrast-site-footer__brand-wrap">
              <div className="icrast-site-footer__brand">
                <img
                  src="/images/icrast-logo-mark.png"
                  alt="ICRAST-26 Logo"
                  className="icrast-site-footer__logo"
                />
                <div>
                  <strong className="icrast-site-footer__name">
                    ICRAST-26
                  </strong>
                  <span className="icrast-site-footer__org">
                    Science Orbit Forum &amp; Prof. M.S. Swaminathan Chair
                  </span>
                </div>
              </div>
            </div>

            <nav className="icrast-site-footer__nav" aria-label="Footer Navigation">
              <Link to="/icrast">Home</Link>
              <a href="/icrast#about">About</a>
              <a href="/icrast#themes">Themes</a>
              <a href="/icrast#dates">Dates</a>
              <Link to="/icrast/venue">Venue</Link>
              <a
                href={ICRAST_GUIDELINES_DOWNLOAD_URL}
                download="ICRAST-26-Presentation-Guidelines.pdf"
              >
                Guidelines
              </a>
              <Link to="/icrast/contact">Contact</Link>
            </nav>

            <div className="icrast-site-footer__contacts">
              <a href="mailto:info@scienceorbitforum.org">
                <Mail size={14} />
                <span>info@scienceorbitforum.org</span>
              </a>
              <a href="tel:+918111805948">
                <Phone size={14} />
                <span>+91 81118 05948</span>
              </a>
            </div>
          </div>

          <div className="icrast-site-footer__bottom">
            <span>
              © {new Date().getFullYear()} ICRAST-26 · Science Orbit Forum. All
              rights reserved.
            </span>
            <a href={mainSiteUrl} className="icrast-site-footer__return">
              Science Orbit Forum
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
