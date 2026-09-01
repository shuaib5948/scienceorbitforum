import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
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
import UpdateDetailPage from './pages/UpdateDetailPage';
import PeoplePage from './pages/PeoplePage';
import JoinPage from './pages/JoinPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import { DesignSystem } from './showcase/DesignSystem';

/**
 * Science Orbit Forum — Phase 2 route graph (code-first TanStack Router).
 *
 * URL structure (clean, no unnecessary nesting):
 *   /                Home             (gateway to all sections)
 *   /who-we-are      Who We Are
 *   /mission         Mission
 *   /vision          Vision
 *   /events          Events
 *   /events/[slug]   Event detail
 *   /updates         Updates
 *   /updates/[slug]  Update detail
 *   /people          People
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
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
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

const updateDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/updates/$updateSlug',
  component: UpdateDetailPage,
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
  whoWeAreRoute,
  missionRoute,
  visionRoute,
  eventsRoute,
  eventDetailRoute,
  updatesRoute,
  updateDetailRoute,
  peopleRoute,
  joinRoute,
  privacyRoute,
  termsRoute,
  designSystemRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
});
