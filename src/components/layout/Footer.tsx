import { Link } from '@tanstack/react-router';
import { Logo } from '../ui/Logo';
import { SocialIcon, type SocialName } from '../ui/Links';
import { Mail, MapPin } from 'lucide-react';

const ABOUT_LINKS = [
  { label: 'Who We Are', to: '/who-we-are' },
  { label: 'Our Mission', to: '/mission' },
  { label: 'Our Vision', to: '/vision' },
  { label: 'Leadership', to: '/people' },
];

const PROGRAMME_LINKS = [
  { label: 'All Events', to: '/events' },
  { label: 'Latest Updates', to: '/updates' },
  { label: 'ICRAST-26 Portal', to: '/icrast' },
  { label: 'Science Festival', to: '/festival' },
];

const SOCIALS: Array<{ name: SocialName; label: string; href: string }> = [
  { name: 'instagram', label: 'Instagram', href: '#' },
  { name: 'linkedin', label: 'LinkedIn', href: '#' },
  { name: 'facebook', label: 'Facebook', href: '#' },
  { name: 'youtube', label: 'YouTube', href: '#' },
];

const CONTACT_EMAIL = 'info@scienceorbitforum.org';

/**
 * Footer — Standard, well-organized 4-column institutional layout:
 * 1. Brand, tagline & social links
 * 2. About navigation
 * 3. Programmes & News navigation
 * 4. Contact details & Join link
 * Followed by a clean copyright & legal bar.
 */
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__grid">
          {/* Column 1: Brand & Socials */}
          <div className="footer__brand">
            <Logo tone="dark" size={34} layout="horizontal" />
            <p className="footer__tagline">
              Science Forum for Curious Minds — advancing scientific inquiry,
              research collaboration, and public science engagement.
            </p>
            <div className="footer__social">
              {SOCIALS.map((s) => (
                <SocialIcon key={s.name} name={s.name} href={s.href} label={s.label} />
              ))}
            </div>
          </div>

          {/* Column 2: About */}
          <nav className="footer__col" aria-label="About">
            <span className="footer__heading">About</span>
            <div className="footer__list">
              {ABOUT_LINKS.map((item) => (
                <Link key={item.to} to={item.to} className="footer__link">
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Column 3: Programmes */}
          <nav className="footer__col" aria-label="Programmes">
            <span className="footer__heading">Programmes</span>
            <div className="footer__list">
              {PROGRAMME_LINKS.map((item) => (
                <Link key={item.to} to={item.to} className="footer__link">
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Column 4: Contact */}
          <div className="footer__col">
            <span className="footer__heading">Contact</span>
            <div className="footer__list">
              <a className="footer__link footer__contact" href={`mailto:${CONTACT_EMAIL}`}>
                <Mail size={15} />
                <span>{CONTACT_EMAIL}</span>
              </a>
              <span className="footer__link footer__contact">
                <MapPin size={15} />
                <span>Kozhikode, Kerala, India</span>
              </span>
              <Link to="/join" className="footer__cta-link">
                Join Science Orbit Forum →
              </Link>
            </div>
          </div>
        </div>

        <div className="footer__bar">
          <span className="footer__note">
            © {new Date().getFullYear()} Science Orbit Forum. All rights reserved.
          </span>
          <div className="footer__legal">
            <Link to="/privacy" className="footer__legal-link">
              Privacy Policy
            </Link>
            <span className="footer__legal-sep" aria-hidden="true">·</span>
            <Link to="/terms" className="footer__legal-link">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

