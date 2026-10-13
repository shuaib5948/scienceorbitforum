import { useEffect } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  useLocation,
} from '@tanstack/react-router';
import { setDocumentTitle, setFavicon, type FaviconType } from './lib/usePageMeta';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SkipLink } from './components/site/SkipLink';
import { ErrorBoundary } from './components/site/ErrorBoundary';
import { NotFound } from './components/site/NotFound';
import HomePage from './pages/HomePage';
import WhoWeArePage from './pages/WhoWeArePage';
import MissionPage from './pages/MissionPage';
import VisionPage from './pages/VisionPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import UpdatesPage from './pages/UpdatesPage';
import PeoplePage from './pages/PeoplePage';
import JoinPage from './pages/JoinPage';
import MembershipApplyPage from './pages/MembershipApplyPage';
import SupportPage from './pages/SupportPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import IcrastPortalPage from './pages/IcrastPortalPage';
import IcrastContactPage from './pages/IcrastContactPage';
import IcrastVenuePage from './pages/IcrastVenuePage';
import IcrastSubmitPage from './pages/IcrastSubmitPage';
import FestivalPortalPage from './pages/FestivalPortalPage';
import { DesignSystem } from './showcase/DesignSystem';

function getActiveSubdomain(): 'icrast' | 'festival' | null {
  if (typeof window === 'undefined') return null;
  const host = window.location.hostname.toLowerCase().replace(/^www\./, '');
  if (host.startsWith('icrast.')) return 'icrast';
  if (host.startsWith('festival.')) return 'festival';
  return null;
}

function RootIndexComponent() {
  const subdomain = getActiveSubdomain();
  if (subdomain === 'icrast') return <IcrastPortalPage />;
  if (subdomain === 'festival') return <FestivalPortalPage />;
  return <HomePage />;
}

/**
 * Science Orbit Forum — Phase 2 route graph (code-first TanStack Router).
 *
 * URL structure (clean, no unnecessary nesting):
 *   /                Home (or ICRAST / Festival portal when accessed via subdomain)
 *   /icrast          ICRAST-26 Conference Portal
 *   /festival        Science Orbit Festival 2026 Portal
 *   /who-we-are      Who We Are
 *   /mission         Mission
 *   /vision          Vision
 *   /events          Events
 *   /events/[slug]   Event detail
 *   /updates         Updates
 *   /updates/[slug]  Update detail
 *   /people          People
 *   /join            Membership Hub (Categories, Benefits, Regulations)
 *   /join/apply      Membership Application Form
 *   /privacy         Privacy
 *   /terms           Terms
 *   /design-system   Phase 1 showcase (preserved for reference)
 */
function getRouteMetadata(
  pathname: string,
  subdomain: 'icrast' | 'festival' | null
): { title: string; favicon: FaviconType } {
  // 1. ICRAST Portal or Subdomain
  if (subdomain === 'icrast' || pathname.startsWith('/icrast')) {
    if (pathname === '/venue' || pathname === '/icrast/venue') {
      return { title: 'Venue & Travel Guide · ICRAST-26', favicon: 'icrast' };
    }
    if (pathname === '/contact' || pathname === '/icrast/contact') {
      return { title: 'Contact & Secretariat · ICRAST-26', favicon: 'icrast' };
    }
    if (pathname === '/submit' || pathname === '/icrast/submit') {
      return { title: 'Abstract Submission · ICRAST-26', favicon: 'icrast' };
    }
    return {
      title: 'ICRAST-26 · International Conference on Recent Advances in Science & Technology',
      favicon: 'icrast',
    };
  }

  // 2. Festival Portal or Subdomain
  if (
    subdomain === 'festival' ||
    pathname.startsWith('/festival') ||
    pathname === '/events/science-festival-2026'
  ) {
    return {
      title: 'Science Orbit Festival 2K26 (SOF-26) · Science Orbit Forum',
      favicon: 'festival',
    };
  }

  // Standalone aliases without subdomain prefix
  if (pathname === '/venue') {
    return { title: 'Venue & Travel Guide · ICRAST-26', favicon: 'icrast' };
  }
  if (pathname === '/submit') {
    return { title: 'Abstract Submission · ICRAST-26', favicon: 'icrast' };
  }

  // 3. Main Science Orbit Forum domain pages
  switch (pathname) {
    case '/':
      return {
        title: 'Science Orbit Forum · Where Curiosity Meets Science',
        favicon: 'main',
      };
    case '/who-we-are':
      return { title: 'Who We Are · Science Orbit Forum', favicon: 'main' };
    case '/mission':
      return { title: 'Our Mission · Science Orbit Forum', favicon: 'main' };
    case '/vision':
      return { title: 'Our Vision · Science Orbit Forum', favicon: 'main' };
    case '/events':
      return {
        title: 'Programmes & Events · Science Orbit Forum',
        favicon: 'main',
      };
    case '/updates':
      return { title: 'Latest Updates · Science Orbit Forum', favicon: 'main' };
    case '/people':
      return {
        title: 'People & Leadership · Science Orbit Forum',
        favicon: 'main',
      };
    case '/join':
      return {
        title: 'Join Science Orbit · Membership Categories & Benefits',
        favicon: 'main',
      };
    case '/join/apply':
      return {
        title: 'Individual Membership Application · Science Orbit Forum',
        favicon: 'main',
      };
    case '/support':
      return { title: 'Funding & Support · Science Orbit Forum', favicon: 'main' };
    case '/privacy':
      return { title: 'Privacy Policy · Science Orbit Forum', favicon: 'main' };
    case '/terms':
      return { title: 'Terms & Conditions · Science Orbit Forum', favicon: 'main' };
    case '/contact':
      return { title: 'Who We Are · Science Orbit Forum', favicon: 'main' };
    case '/design-system':
      return { title: 'Design System Showcase · Science Orbit Forum', favicon: 'main' };
    default:
      if (pathname.startsWith('/events/')) {
        return { title: 'Event Details · Science Orbit Forum', favicon: 'main' };
      }
      if (pathname.startsWith('/updates/')) {
        return { title: 'News & Updates · Science Orbit Forum', favicon: 'main' };
      }
      return {
        title: 'Science Orbit Forum · Where Curiosity Meets Science',
        favicon: 'main',
      };
  }
}

const rootRoute = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorBoundary,
});

function RootComponent() {
  const { pathname } = useLocation();
  const subdomain = getActiveSubdomain();
  const isStandalone =
    pathname.startsWith('/icrast') ||
    pathname === '/venue' ||
    pathname === '/submit' ||
    (pathname === '/contact' && subdomain === 'icrast') ||
    subdomain === 'icrast' ||
    pathname.startsWith('/festival') ||
    subdomain === 'festival' ||
    pathname === '/events/science-festival-2026';

  useEffect(() => {
    const meta = getRouteMetadata(pathname, subdomain);
    setDocumentTitle(meta.title);
    setFavicon(meta.favicon);
  }, [pathname, subdomain]);

  return (
    <>
      <SkipLink />
      {!isStandalone && <Header />}
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      {!isStandalone && <Footer />}
    </>
  );
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: RootIndexComponent,
});

const icrastRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/icrast',
  component: IcrastPortalPage,
});

const icrastContactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/icrast/contact',
  component: IcrastContactPage,
});

const icrastContactSubdomainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: () => {
    const subdomain = getActiveSubdomain();
    if (subdomain === 'icrast') return <IcrastContactPage />;
    return <WhoWeArePage />;
  },
});

const icrastVenueRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/icrast/venue',
  component: IcrastVenuePage,
});

const icrastVenueSubdomainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/venue',
  component: IcrastVenuePage,
});

const icrastSubmitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/icrast/submit',
  component: IcrastSubmitPage,
});

const icrastSubmitSubdomainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/submit',
  component: IcrastSubmitPage,
});

const festivalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/festival',
  component: FestivalPortalPage,
});

const scienceFestivalAliasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events/science-festival-2026',
  component: FestivalPortalPage,
});

const whoWeAreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/who-we-are',
  component: WhoWeArePage,
});

const missionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mission',
  component: MissionPage,
});

const visionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vision',
  component: VisionPage,
});

const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events',
  component: EventsPage,
});

const eventDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events/$eventSlug',
  component: EventDetailPage,
});

const updatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/updates',
  component: UpdatesPage,
});

const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/people',
  component: PeoplePage,
});

const joinRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/join',
  component: JoinPage,
});

const joinApplyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/join/apply',
  component: MembershipApplyPage,
});

const supportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/support',
  component: SupportPage,
});

const donateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/donate',
  component: SupportPage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: PrivacyPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsPage,
});

const designSystemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/design-system',
  component: DesignSystem,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  icrastRoute,
  icrastContactRoute,
  icrastContactSubdomainRoute,
  icrastVenueRoute,
  icrastVenueSubdomainRoute,
  icrastSubmitRoute,
  icrastSubmitSubdomainRoute,
  festivalRoute,
  scienceFestivalAliasRoute,
  whoWeAreRoute,
  missionRoute,
  visionRoute,
  eventsRoute,
  eventDetailRoute,
  updatesRoute,
  peopleRoute,
  joinRoute,
  joinApplyRoute,
  supportRoute,
  donateRoute,
  privacyRoute,
  termsRoute,
  designSystemRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
});
