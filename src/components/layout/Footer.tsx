import { Link } from '@tanstack/react-router';
import { Logo } from '../ui/Logo';
import { SocialIcon, type SocialName } from '../ui/Links';
import { Mail, MapPin } from 'lucide-react';

const EXPLORE = [
  { label: 'Who We Are', to: '/who-we-are' },
  { label: 'Mission', to: '/mission' },
  { label: 'Vision', to: '/vision' },
  { label: 'Events', to: '/events' },
  { label: 'Updates', to: '/updates' },
  { label: 'People', to: '/people' },
  { label: 'Join Science Orbit Forum', to: '/join' },
];

const SOCIALS: Array<{ name: SocialName; label: string; href: string }> = [
  { name: 'instagram', label: 'Instagram', href: '#' },
  { name: 'linkedin', label: 'LinkedIn', href: '#' },
  { name: 'facebook', label: 'Facebook', href: '#' },
  { name: 'youtube', label: 'YouTube', href: '#' },
];

const CONTACT_EMAIL = 'info@scienceorbitforum.org';

/**
 * Footer — Navy surface with a thin cyan top border. Four columns:
 * brand + tagline · explore links · contact info · social icons.
 * Stacks to a single column on mobile; copyright bar below a thin rule.
 */
export function Footer() {
  return (
    <footer className="footer">
      <div className="container section" style={{ paddingBottom: 0 }}>
        <div className="footer__grid">
          <div className="footer__brand">
            <Logo tone="dark" size={38} layout="horizontal" />
            <p className="footer__tagline">
              Science Forum for Curious Minds — where scientific curiosity orbits
              into research, innovation and impact.
            </p>
          </div>

          <nav className="footer__col" aria-label="Explore">
            <span className="footer__heading">Explore</span>
            {EXPLORE.map((item) => (
              <Link key={item.to} to={item.to} className="footer__link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="footer__col">
            <span className="footer__heading">Contact</span>
            <a className="footer__link footer__contact" href={`mailto:${CONTACT_EMAIL}`}>
              <Mail size={16} /> {CONTACT_EMAIL}
            </a>
            <span className="footer__link footer__contact">
              <MapPin size={16} /> Science Building, Room 302
            </span>
          </div>

          <div className="footer__col">
            <span className="footer__heading">Follow</span>
            <div className="footer__social">
              {SOCIALS.map((s) => (
                <SocialIcon key={s.name} name={s.name} href={s.href} label={s.label} />
              ))}
            </div>
          </div>
        </div>

        <div className="footer__bar">
          <span className="footer__note">
            © {new Date().getFullYear()} Science Orbit Forum — All rights reserved.
          </span>
          <span className="footer__note">Privacy Policy · Terms</span>
        </div>
      </div>
    </footer>
  );
}
