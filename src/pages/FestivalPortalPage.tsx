import { ArrowLeft } from 'lucide-react';

function getMainSiteUrl(): string {
  if (typeof window === 'undefined') return 'https://scienceorbitforum.org';
  const { protocol, hostname, port } = window.location;
  const baseHost = hostname.replace(/^(icrast|festival|www)\./i, '');
  const portSuffix = port ? `:${port}` : '';
  if (baseHost === 'scienceorbitforum.org') {
    return 'https://scienceorbitforum.org';
  }
  if (baseHost === 'localhost' || baseHost === '127.0.0.1') {
    return `${protocol}//${baseHost}${portSuffix}`;
  }
  if (baseHost !== hostname) {
    return `${protocol}//${baseHost}${portSuffix}`;
  }
  return '/';
}

export default function FestivalPortalPage() {
  const mainSiteUrl = getMainSiteUrl();

  return (
    <div className="festival-hero-screen">
      {/* Ambient background glow of the 5 festival colors */}
      <div className="festival-aura" aria-hidden="true">
        <div className="festival-aura__orb festival-aura__orb--yellow" />
        <div className="festival-aura__orb festival-aura__orb--vivid-blue" />
        <div className="festival-aura__orb festival-aura__orb--bright-red" />
        <div className="festival-aura__orb festival-aura__orb--cobalt-blue" />
        <div className="festival-aura__orb festival-aura__orb--coral-red" />
        <div className="festival-aura__grid-mesh" />
      </div>

      {/* Centered Large Rounded Card Box */}
      <div className="festival-card-box festival-card-box--minimal">
        {/* Top return link */}
        <div className="festival-card-box__top">
          <a href={mainSiteUrl} className="festival-card-box__back">
            <ArrowLeft size={15} />
            <span>Science Orbit Forum</span>
          </a>
        </div>

        {/* Core Content */}
        <div className="festival-card-box__minimal-body">
          {/* Festival Emblem with Soft Glowing Multi-Color Ring */}
          <div className="festival-minimal-logo-frame">
            <div className="festival-minimal-logo-frame__ring" aria-hidden="true" />
            <img
              src="/images/science-festival-logo.png"
              alt="Science Orbit Festival 2K26"
              className="festival-minimal-logo-img"
            />
          </div>

          {/* Event Title */}
          <h1 className="festival-minimal-title">
            Science Orbit Festival 2K26
          </h1>

          {/* Theme Quote */}
          <p className="festival-minimal-quote">
            “From Atoms to Ecosystems: The Continuum of Life”
          </p>

          {/* Date & Location */}
          <div className="festival-minimal-meta">
            <span>December 2026</span>
            <span className="festival-minimal-meta-dot" aria-hidden="true">•</span>
            <span>Kozhikode, Kerala</span>
          </div>

          {/* 3px Multi-Color Gradient Loading Bar */}
          <div className="festival-minimal-loader" role="progressbar" aria-label="Coming soon loading bar">
            <div className="festival-minimal-loader__bar" />
          </div>

          {/* Minimal Status Indicator */}
          <div className="festival-minimal-status">
            <span className="festival-minimal-status__dot" />
            <span>COMING SOON</span>
          </div>
        </div>
      </div>
    </div>
  );
}
