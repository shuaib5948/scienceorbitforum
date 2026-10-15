import React, { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { X, ChevronDown, ArrowRight, Heart } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { HEADER_NAV } from './Header';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { pathname } = useLocation();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    About: true,
    News: true,
    Membership: false,
    Support: false,
  });

  if (!isOpen) return null;

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isSectionActive = (match: string[]) => {
    return match.some((path) => pathname === path || pathname.startsWith(path + '/'));
  };

  return (
    <div className="mobile-drawer-overlay" aria-modal="true" role="dialog">
      {/* Dimmed backdrop */}
      <div className="mobile-drawer-backdrop" onClick={onClose} />

      {/* Slide-out Drawer Panel */}
      <div className="mobile-drawer-panel">
        <div>
          {/* Header */}
          <div className="mobile-drawer-head">
            <Link to="/" onClick={onClose} className="mobile-drawer-logo">
              <Logo tone="dark" size={32} layout="horizontal" />
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="mobile-drawer-close"
              aria-label="Close navigation menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* Navigation Accordion Sections */}
          <nav className="mobile-drawer-nav" aria-label="Mobile Navigation">
            <Link
              to="/"
              onClick={onClose}
              className={`mobile-drawer-link ${pathname === '/' ? 'is-active' : ''}`}
            >
              <span>Home</span>
              {pathname === '/' && <span className="mobile-drawer-link-badge" />}
            </Link>

            {HEADER_NAV.map((section) => {
              const active = isSectionActive(section.match);
              const isExpanded = !!expandedSections[section.label];

              return (
                <div key={section.label} className="mobile-drawer-section">
                  <button
                    type="button"
                    onClick={() => toggleSection(section.label)}
                    className={`mobile-drawer-section-toggle ${active ? 'is-active' : ''}`}
                    aria-expanded={isExpanded}
                  >
                    <span>{section.label}</span>
                    <ChevronDown
                      size={16}
                      className={`mobile-drawer-caret ${isExpanded ? 'is-rotated' : ''}`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mobile-drawer-sublinks">
                      {section.items.map((item) => (
                        item.to ? (
                          <Link
                            key={item.label}
                            to={item.to}
                            onClick={onClose}
                            className={`mobile-drawer-sublink ${pathname === item.to ? 'is-active' : ''}`}
                          >
                            <span>{item.label}</span>
                            {pathname === item.to && <span className="mobile-drawer-link-badge" />}
                          </Link>
                        ) : (
                          <a
                            key={item.label}
                            href={item.href}
                            onClick={onClose}
                            className="mobile-drawer-sublink"
                          >
                            <span>{item.label}</span>
                          </a>
                        )
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom CTA */}
        <div className="mobile-drawer-footer">
          <Link
            to="/donate"
            onClick={onClose}
            className="mobile-drawer-btn"
          >
            <Heart size={16} />
            <span>Donate to Science Orbit</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
