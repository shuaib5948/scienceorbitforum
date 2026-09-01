import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { ChevronDown } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { ButtonLink } from '../ui/Button';

/** One entry inside a header dropdown: either a real route (`to`) or a
 *  placeholder target (`href`) for a section that gets its own page later. */
export interface HeaderDropdownItem {
  label: string;
  to?: string;
  href?: string;
}

/** A top-level dropdown section in the primary navigation. */
export interface HeaderNavSection {
  label: string;
  /** Paths that should mark this section (and its underline) as active. */
  match: string[];
  items: HeaderDropdownItem[];
}

/**
 * Primary navigation — About · News · Membership · Support, each a disclosure
 * dropdown;the Donate CTA stays standalone(never inside a dropdown).
 * Links to pages that already exist use router `Link`s; others carry
 * fragment placeholders that later phases wire up.


 */
export const HEADER_NAV: HeaderNavSection[] = [
  {
    label:'About',
    match: ['/who-we-are', '/mission', '/vision', '/people'],
    items: [
      { label:'Who We Are',to:'/who-we-are' },
      { label:'Mission',to:'/mission' },
      { label:'Vision',to:'/vision' },
      { label:'People',to:'/people' },
    ],
  },
  {
    label:'News',
    match: ['/updates', '/events'],
    items: [
      { label:'Latest updates',to:'/updates' },
      { label:'Events',to:'/events' },
    ],
  },
  {
    label:'Membership',
    match: ['/join'],
    items: [
      { label:'Join Science Orbit',to:'/join' },
      { label:'Membership Categories', href:'#membership-categories' },
      { label:'Benefits', href:'#membership-benefits' },
      { label:'Membership Regulations',href:'#membership-regulations' },
    ],
  },
  {
    label:'Support',
    match: [],
    items: [
      { label:'Funding & Support',href:'#funding-and-support' },
      { label:'Partnerships', href:'#partnerships' },
      { label:'Sponsorship', href:'#sponsorship' },
      { label:'Support Our Programmes',href:'#support-our-programmes' },
    ],
  },
];

/** Standalone Donate CTA — kept out of the dropdowns; wired in a later phase. */
const DONATE_HREF = '#donate';

/**
 * Sticky site header: brand mark + primary nav + CTA.
 * Nav renders via TanStack Router `Link`s so active state is route-aware.
 * Primary nav is intentionally minimal: About · Events · Updates · People.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Lock body scroll while the drawer is open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  /* Drawer: focus close on open; Escape closes and returns focus */
  useEffect(() => {
    if (open) {
      closeBtnRef.current?.focus();
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpen(false);
          toggleRef.current?.focus();
        }
      };
      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
    }
  }, [open]);

  /* Desktop dropdowns: close on outside click or Escape */
  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openMenu]);

  /* Close dropdowns on route change */
  useEffect(() => {
    setOpenMenu(null);
  }, [pathname]);

  const close = () => setOpen(false);


  const isSectionActive = (match: string[]) =>
    match.some((m) => pathname === m || pathname.startsWith(`${m}/`));

  return (
    <>
      <header
        className={[
          'header',
          scrolled ? 'header--scrolled' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="container header__inner">
          <Link to="/" aria-label="Science Orbit — home">
            <Logo size={40} tone="light" />
          </Link>

          <nav className="nav" aria-label="Primary" ref={navRef}>
            <ul className="nav__list">
              {HEADER_NAV.map((section, idx) => {
                const isOpen = openMenu === section.label;
                const isActive = isSectionActive(section.match);
                return (
                  <li
                    key={section.label}
                    className={`nav__item${isOpen ? ' nav__item--open' : ''}`}
                    data-active={isActive || undefined}
                  >
                    <button
                      type="button"
                      className="nav__trigger"
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      aria-controls={`nav-menu-${idx}`}
                      onClick={() => setOpenMenu(isOpen ? null : section.label)}
                    >
                      {section.label}
                      <ChevronDown size={14} strokeWidth={2} className="nav__caret" aria-hidden />
                    </button>

                    <ul id={`nav-menu-${idx}`} className="nav__dropdown">
                      {section.items.map((item) => (
                        <li key={item.label}>
                          {item.to ? (
                            <Link
                              to={item.to}
                              className="nav__dropdown-link"
                              activeProps={{ 'data-active': 'true' }}
                              onClick={() => setOpenMenu(null)}
                            >
                              {item.label}
                            </Link>
                          ) : (
                            <a
                              href={item.href}
                              className="nav__dropdown-link"
                              onClick={() => setOpenMenu(null)}
                            >
                              {item.label}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>

            <span className="nav__donate">
              <ButtonLink href={DONATE_HREF} size="sm" variant="primary">
                Donate
              </ButtonLink>
            </span>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="header__toggle"
            aria-expanded={open}
            aria-label="Toggle navigation"
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
            </svg>
          </button>
        </div>
      </header>

      {open && (
        <div className="drawer" role="dialog" aria-modal="true" aria-label="Navigation">
          <button className="drawer__backdrop" aria-label="Close navigation" onClick={close} />
          <nav id="mobile-nav" className="drawer__panel" aria-label="Mobile navigation">
            <div className="drawer__head">
              <span className="drawer__title">SCIENCE ORBIT</span>
              <button
                ref={closeBtnRef}
                type="button"
                className="drawer__close"
                onClick={close}
                aria-label="Close navigation"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="drawer__groups">
              {HEADER_NAV.map((section) => {
                const isExpanded = expanded === section.label;
                return (
                  <div key={section.label} className="drawer__group">
                    <button
                      type="button"
                      className="drawer__section"
                      aria-expanded={isExpanded}
                      onClick={() => setExpanded(isExpanded ? null : section.label)}
                    >
                      {section.label}
                      <ChevronDown
                        size={16}
                        className={`drawer__caret${isExpanded ? ' drawer__caret--open' : ''}`}
                        aria-hidden
                      />
                    </button>

                    {isExpanded && (
                      <ul className="drawer__sub">
                        {section.items.map((item) => (
                          <li key={item.label}>
                            {item.to ? (
                              <Link
                                to={item.to}
                                className="drawer__link"
                                activeProps={{ 'data-active': 'true' }}
                                onClick={close}
                              >
                                {item.label}
                              </Link>
                            ) : (
                              <a href={item.href} className="drawer__link" onClick={close}>
                                {item.label}
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="drawer__actions">
              <ButtonLink href={DONATE_HREF} variant="primary" className="btn--block">
                Donate
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
