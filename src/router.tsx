import { useEffect } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  useLocation,
} from '@tanstack/react-router';
import { setFavicon, type FaviconType } from './lib/usePageMeta';
import {
  updateSeoHead,
  ROUTE_SEO,
  BASE_SITE_URL,
  ICRAST_EVENT_SCHEMA,
  FESTIVAL_EVENT_SCHEMA,
  type PageSeoConfig,
} from './lib/seo';
import { initAnalytics, trackPageView } from './lib/analytics';
import { events } from './data/events';
import { updates } from './data/updates';
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
import DonatePage from './pages/DonatePage';
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
 * Science Orbit Forum — Dynamic Route Metadata & SEO Resolution.
 */
function getRouteMetadata(
  pathname: string,
  subdomain: 'icrast' | 'festival' | null
): PageSeoConfig & { favicon: FaviconType } {
  // 1. ICRAST Portal or Subdomain
  if (subdomain === 'icrast' || pathname.startsWith('/icrast')) {
    if (pathname === '/venue' || pathname === '/icrast/venue') {
      return {
        ...ROUTE_SEO['/icrast/venue'],
        favicon: 'icrast',
      };
    }
    if (pathname === '/contact' || pathname === '/icrast/contact') {
      return {
        ...ROUTE_SEO['/icrast/contact'],
        favicon: 'icrast',
      };
    }
    if (pathname === '/submit' || pathname === '/icrast/submit') {
      return {
        ...ROUTE_SEO['/icrast/submit'],
        favicon: 'icrast',
      };
    }
    return {
      ...ROUTE_SEO['/icrast'],
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
      ...ROUTE_SEO['/festival'],
      favicon: 'festival',
    };
  }

  // Standalone aliases without subdomain prefix
  if (pathname === '/venue') {
    return { ...ROUTE_SEO['/icrast/venue'], favicon: 'icrast' };
  }
  if (pathname === '/submit') {
    return { ...ROUTE_SEO['/icrast/submit'], favicon: 'icrast' };
  }

  // Dynamic route for /events/:eventSlug
  if (pathname.startsWith('/events/')) {
    const slug = pathname.replace('/events/', '');
    const item = events.find((e) => e.slug === slug);
    if (item) {
      const isIcrast = item.subdomain === 'icrast' || item.id === 'icrast-26';
      const isFest = item.subdomain === 'festival' || item.id === 'science-festival-2026';
      return {
        title: `${item.title} · Science Orbit Forum`,
        description: item.excerpt,
        keywords: `${item.title}, Science Orbit Forum, academic conference, scientific research, ${item.location}`,
        canonicalPath: `/events/${item.slug}`,
        ogImage: item.image?.startsWith('http') ? item.image : `${BASE_SITE_URL}${item.image || '/og-image.png'}`,
        ogType: 'event',
        structuredData: isIcrast ? ICRAST_EVENT_SCHEMA : isFest ? FESTIVAL_EVENT_SCHEMA : undefined,
        favicon: isIcrast ? 'icrast' : isFest ? 'festival' : 'main',
      };
    }
  }

  // Dynamic route for /updates/:updateSlug
  if (pathname.startsWith('/updates/')) {
    const slug = pathname.replace('/updates/', '');
    const item = updates.find((u) => u.slug === slug);
    if (item) {
      const coverUrl = item.cover?.startsWith('http')
        ? item.cover
        : `${BASE_SITE_URL}${item.cover || '/og-image.png'}`;
      return {
        title: `${item.title} · Science Orbit Forum`,
        description: item.excerpt,
        keywords: `${item.title}, Science Orbit Forum, official announcement, scientific research`,
        canonicalPath: `/updates/${item.slug}`,
        ogImage: coverUrl,
        ogType: 'article',
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: item.title,
          description: item.excerpt,
          image: [coverUrl],
          datePublished: item.date,
          author: {
            '@type': 'Organization',
            name: item.author || 'Science Orbit Forum Secretariat',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Science Orbit Forum',
            logo: {
              '@type': 'ImageObject',
              url: `${BASE_SITE_URL}/logo.png`,
            },
          },
        },
        favicon: 'main',
      };
    }
  }

  // Pre-configured route metadata
  const known = ROUTE_SEO[pathname];
  if (known) {
    return {
      ...known,
      favicon: 'main',
    };
  }

  // Fallback
  return {
    title: 'Science Orbit Forum · Where Curiosity Meets Science',
    description:
      'Science Orbit Forum brings together students, researchers, innovators and educators through high-impact scientific conferences and outreach programmes.',
    canonicalPath: pathname,
    favicon: 'main',
  };
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

  // Initialize analytics once on mount
  useEffect(() => {
    initAnalytics();
  }, []);

  // Update dynamic SEO tags, canonical URL, structured data, and send virtual SPA pageviews
  useEffect(() => {
    const meta = getRouteMetadata(pathname, subdomain);
    updateSeoHead(meta);
    setFavicon(meta.favicon);
    trackPageView(pathname, meta.title);
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

const updateDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/updates/$updateSlug',
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
  component: DonatePage,
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
  updateDetailRoute,
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
