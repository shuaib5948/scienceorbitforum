import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  useLocation,
} from '@tanstack/react-router';
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
  const host = window.location.hostname.toLowerCase();
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
const rootRoute = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorBoundary,
});

function RootComponent() {
  const { pathname } = useLocation();
  const subdomain = getActiveSubdomain();
  const isStandaloneIcrast =
    pathname.startsWith('/icrast') || subdomain === 'icrast';

  return (
    <>
      <SkipLink />
      {!isStandaloneIcrast && <Header />}
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      {!isStandaloneIcrast && <Footer />}
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

const icrastVenueRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/icrast/venue',
  component: IcrastVenuePage,
});

const icrastSubmitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/icrast/submit',
  component: IcrastSubmitPage,
});

const festivalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/festival',
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
  icrastVenueRoute,
  icrastSubmitRoute,
  festivalRoute,
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
  privacyRoute,
  termsRoute,
  designSystemRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
});
