import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Menu, ChevronDown, ArrowRight } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { MobileDrawer } from './MobileDrawer';

export interface HeaderDropdownItem {
  label: string;
  to?: string;
  href?: string;
}

export interface HeaderNavSection {
  label: string;
  match: string[];
  items: HeaderDropdownItem[];
}

export const HEADER_NAV: HeaderNavSection[] = [
  {
    label: 'About',
    match: ['/who-we-are', '/mission', '/vision', '/people'],
    items: [
      { label: 'Who We Are', to: '/who-we-are' },
      { label: 'Mission', to: '/mission' },
      { label: 'Vision', to: '/vision' },
      { label: 'People', to: '/people' },
    ],
  },
  {
    label: 'News',
    match: ['/updates', '/events'],
    items: [
      { label: 'Latest updates', to: '/updates' },
      { label: 'Events', to: '/events' },
    ],
  },
  {
    label: 'Membership',
    match: ['/join'],
    items: [
      { label: 'Join Science Orbit', to: '/join' },
      { label: 'Membership Categories', href: '/join#membership-categories' },
      { label: 'Benefits', href: '/join#membership-benefits' },
      { label: 'Membership Regulations', href: '/join#membership-regulations' },
    ],
  },
  {
    label: 'Support',
    match: ['/support', '/donate'],
    items: [
      { label: 'Funding & Support', to: '/support' },
      { label: 'Donate Now', to: '/donate' },
    ],
  },
];

/**
 * Floating Glassmorphic Header with Multi-level Dropdowns (Ash'ariyya capsule style)
 * Features:
 * - Floating glassmorphic capsule container
 * - Original Science Orbit Forum navigation structure (About, News, Membership, Support)
 * - Sleek glassmorphic flyout dropdown menus on desktop
 * - Full accordion disclosure in the mobile drawer
 */
export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  // Close dropdown on outside click or escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDropdown(null);
    };
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.floating-header__nav-item')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  const handleMouseEnter = (label: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpenDropdown(null);
    }, 180);
  };

  const isSectionActive = (section: HeaderNavSection) => {
    return section.match.some((path) => pathname === path || pathname.startsWith(path + '/'));
  };

  return (
    <>
      <header className="floating-header">
        <div className="floating-header__container">
          <div
            className={`floating-header__bar ${
              isScrolled ? 'floating-header__bar--scrolled' : 'floating-header__bar--unscrolled'
            }`}
          >
            {/* Brand Logo */}
            <Link to="/" className="floating-header__logo" aria-label="Science Orbit Forum Home">
              <Logo tone="dark" size={34} layout="horizontal" />
            </Link>

            {/* Desktop Navigation with Glassmorphic Dropdowns */}
            <nav className="floating-header__nav" aria-label="Main Navigation">
              {/* Home Link */}
              <div className="floating-header__nav-item">
                <Link
                  to="/"
                  className={`floating-header__link ${
                    pathname === '/' ? 'is-active' : ''
                  }`}
                >
                  <span>Home</span>
                  {pathname === '/' && (
                    <span className="floating-header__link-pill" />
                  )}
                </Link>
              </div>

              {HEADER_NAV.map((section) => {
                const active = isSectionActive(section);
                const isOpen = openDropdown === section.label;

                return (
                  <div
                    key={section.label}
                    className="floating-header__nav-item"
                    onMouseEnter={() => handleMouseEnter(section.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      type="button"
                      className={`floating-header__link floating-header__link--dropdown ${
                        active ? 'is-active' : ''
                      } ${isOpen ? 'is-open' : ''}`}
                      onClick={() => setOpenDropdown(isOpen ? null : section.label)}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                    >
                      <span>{section.label}</span>
                      <ChevronDown
                        size={14}
                        className={`floating-header__caret ${isOpen ? 'is-rotated' : ''}`}
                      />
                      {active && <span className="floating-header__link-pill" />}
                    </button>

                    {/* Flyout Glassmorphic Dropdown Panel */}
                    {isOpen && (
                      <div className="floating-header__dropdown" role="menu">
                        <div className="floating-header__dropdown-inner">
                          {section.items.map((item) => (
                            item.to ? (
                              <Link
                                key={item.label}
                                to={item.to}
                                className={`floating-header__dropdown-link ${
                                  pathname === item.to ? 'is-active' : ''
                                }`}
                                role="menuitem"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {item.label}
                              </Link>
                            ) : (
                              <a
                                key={item.label}
                                href={item.href}
                                className="floating-header__dropdown-link"
                                role="menuitem"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {item.label}
                              </a>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Action CTA & Mobile Menu Toggle */}
            <div className="floating-header__actions">
              <Link
                to="/donate"
                className="floating-header__btn"
              >
                <span>Donate</span>
                <ArrowRight size={14} />
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="floating-header__toggle"
                aria-label="Open Navigation Menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-in Mobile Drawer with Accordion Subsections */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};

export default Header;
