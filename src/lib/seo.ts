/**
 * Science Orbit Forum — Enterprise Search Engine Optimization (SEO) & Schema.org Engine.
 *
 * Provides dynamic meta tags, social graph tags (OG/Twitter), canonical links,
 * and JSON-LD structured data (Organization, WebSite, Event, NewsArticle, BreadcrumbList)
 * for top Google, Bing, and social search ranking.
 */

export interface PageSeoConfig {
  title: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'event';
  noindex?: boolean;
  structuredData?: Record<string, any> | Array<Record<string, any>>;
}

export const BASE_SITE_URL = 'https://scienceorbitforum.org';
export const DEFAULT_OG_IMAGE = `${BASE_SITE_URL}/og-image.png`;
export const DEFAULT_SITE_TITLE = 'Science Orbit Forum · Where Curiosity Meets Science';
export const DEFAULT_DESCRIPTION =
  'Science Orbit Forum brings together students, researchers, educators, and innovators through high-impact scientific conferences, research initiatives, and public outreach programmes.';
export const DEFAULT_KEYWORDS =
  'Science Orbit Forum, scientific research, ICRAST 2026, Science Orbit Festival, University of Calicut, biotechnology conference, student research, scientific innovation, Kerala, India';

/**
 * Global Organization schema for Science Orbit Forum
 */
export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_SITE_URL}/#organization`,
  name: 'Science Orbit Forum',
  alternateName: ['SOF', 'Science Orbit'],
  url: BASE_SITE_URL,
  logo: `${BASE_SITE_URL}/logo.png`,
  image: `${BASE_SITE_URL}/og-image.png`,
  description: DEFAULT_DESCRIPTION,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kozhikode',
    addressRegion: 'Kerala',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'info@scienceorbitforum.org',
    contactType: 'customer support',
    areaServed: 'Worldwide',
    availableLanguage: ['English', 'Malayalam'],
  },
  sameAs: [
    'https://www.linkedin.com/company/scienceorbitforum',
    'https://www.instagram.com/scienceorbitforum',
    'https://www.facebook.com/scienceorbitforum',
  ],
};

/**
 * Global WebSite schema
 */
export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_SITE_URL}/#website`,
  url: BASE_SITE_URL,
  name: 'Science Orbit Forum',
  description: DEFAULT_DESCRIPTION,
  publisher: {
    '@id': `${BASE_SITE_URL}/#organization`,
  },
};

/**
 * ICRAST-26 Conference structured data (Google Event Rich Snippet)
 */
export const ICRAST_EVENT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'EducationEvent',
  name: 'ICRAST-26: International Conference on Recent Advancements in Science and Technology 2026',
  alternateName: 'ICRAST-26',
  description:
    'International Conference on Recent Advancements in Science and Technology 2026 organised by Science Orbit Forum in collaboration with Prof. M.S. Swaminathan Chair for Science Popularisation and Research, University of Calicut. Theme: Advances in Biotechnology and Frontier Sciences for Human Well-Being.',
  startDate: '2026-11-21T09:00:00+05:30',
  endDate: '2026-11-21T17:00:00+05:30',
  eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
  eventStatus: 'https://schema.org/EventScheduled',
  location: [
    {
      '@type': 'Place',
      name: 'University of Calicut',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Malappuram / Thenhipalam',
        addressRegion: 'Kerala',
        postalCode: '673635',
        addressCountry: 'IN',
      },
    },
    {
      '@type': 'VirtualLocation',
      url: 'https://scienceorbitforum.org/icrast',
    },
  ],
  image: [`${BASE_SITE_URL}/images/icrast-biotech-globe.jpg`, `${BASE_SITE_URL}/og-image.png`],
  organizer: {
    '@type': 'Organization',
    name: 'Science Orbit Forum & Prof. M.S. Swaminathan Chair, University of Calicut',
    url: BASE_SITE_URL,
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
    url: 'https://scienceorbitforum.org/icrast/submit',
    validFrom: '2026-08-01',
  },
  isAccessibleForFree: true,
};

/**
 * Science Orbit Festival 2K26 structured data
 */
export const FESTIVAL_EVENT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Festival',
  name: 'Science Orbit Festival 2K26 (SOF-26)',
  description:
    'Flagship science celebration under the theme "From Atoms to Ecosystems: The Continuum of Life." Featuring conferences, research workshops, exhibitions, and student competitions culminating in Kozhikode (Calicut), Kerala.',
  startDate: '2026-10-01T09:00:00+05:30',
  endDate: '2026-12-31T18:00:00+05:30',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  eventStatus: 'https://schema.org/EventScheduled',
  location: {
    '@type': 'Place',
    name: 'Kozhikode (Calicut)',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kozhikode',
      addressRegion: 'Kerala',
      addressCountry: 'IN',
    },
  },
  image: [`${BASE_SITE_URL}/images/science-orbit-festival.jpg`, `${BASE_SITE_URL}/og-image.png`],
  organizer: {
    '@type': 'Organization',
    name: 'Science Orbit Forum',
    url: BASE_SITE_URL,
  },
};

/**
 * Route-based metadata directory for precise SEO ranking.
 */
export const ROUTE_SEO: Record<string, PageSeoConfig> = {
  '/': {
    title: 'Science Orbit Forum · Where Curiosity Meets Science',
    description:
      'Official portal of Science Orbit Forum. Discover academic conferences, student research programmes, Science Orbit Festival 2K26, and ICRAST-26 at University of Calicut.',
    keywords:
      'Science Orbit Forum, scientific research, science festival 2026, ICRAST 2026, University of Calicut, Kerala science organisation, academic papers',
    canonicalPath: '/',
    structuredData: [ORGANIZATION_SCHEMA, WEBSITE_SCHEMA],
  },
  '/who-we-are': {
    title: 'Who We Are · Science Orbit Forum | About Our Vision & Community',
    description:
      'Learn about Science Orbit Forum, a premier collaborative platform bringing together curious students, passionate researchers, innovators and educators across sciences.',
    keywords: 'about Science Orbit Forum, scientific community Kerala, research network, science education India',
    canonicalPath: '/who-we-are',
  },
  '/mission': {
    title: 'Our Mission · Science Orbit Forum | Fostering Curiosity & Inquiry',
    description:
      'Our mission is to democratise scientific discovery, nurture academic inquiry among youth, and bridge students with frontier research institutes and global mentors.',
    keywords: 'science mission, research popularisation, STEM education, student science research India',
    canonicalPath: '/mission',
  },
  '/vision': {
    title: 'Our Vision · Science Orbit Forum | The Continuum of Life & Science',
    description:
      'Exploring the vision of Science Orbit Forum: creating an inclusive scientific ecosystem where frontier sciences and biotechnology solve real-world challenges.',
    keywords: 'science vision, research continuum, scientific future, biotechnology impact',
    canonicalPath: '/vision',
  },
  '/events': {
    title: 'Programmes & Events Catalogue · Science Orbit Forum',
    description:
      'Explore upcoming and featured events by Science Orbit Forum, including the ICRAST-26 International Conference and Science Orbit Festival 2K26.',
    keywords: 'science events 2026, academic conferences Kerala, ICRAST 2026, science workshops, student competitions',
    canonicalPath: '/events',
  },
  '/events/icrast-26': {
    title: 'ICRAST-26 International Conference · Science Orbit Forum & University of Calicut',
    description:
      'International Conference on Recent Advancements in Science and Technology 2026. Free registration, hybrid mode, 11 scientific themes. Organised at University of Calicut.',
    keywords: 'ICRAST 2026, University of Calicut conference, biotechnology conference, call for papers, frontier science',
    canonicalPath: '/events/icrast-26',
    ogImage: `${BASE_SITE_URL}/images/icrast-biotech-globe.jpg`,
    ogType: 'event',
    structuredData: ICRAST_EVENT_SCHEMA,
  },
  '/events/science-festival-2026': {
    title: 'Science Orbit Festival 2K26 (SOF-26) · Science Orbit Forum',
    description:
      'Science Orbit Festival 2K26 under the theme "From Atoms to Ecosystems: The Continuum of Life". Explore lectures, exhibitions, research showcases and competitions.',
    keywords: 'Science Orbit Festival, SOF-26, science fest Kozhikode, student science exhibition, Calicut events',
    canonicalPath: '/events/science-festival-2026',
    ogImage: `${BASE_SITE_URL}/images/science-orbit-festival.jpg`,
    ogType: 'event',
    structuredData: FESTIVAL_EVENT_SCHEMA,
  },
  '/icrast': {
    title: 'ICRAST-26 · International Conference on Recent Advances in Science & Technology',
    description:
      'Official ICRAST-26 Portal. Free hybrid conference on Nov 21, 2026 at University of Calicut. Theme: Advances in Biotechnology and Frontier Sciences for Human Well-Being.',
    keywords:
      'ICRAST-26, biotechnology conference 2026, University of Calicut, Prof MS Swaminathan Chair, paper submission, free registration conference',
    canonicalPath: '/icrast',
    ogImage: `${BASE_SITE_URL}/images/icrast-biotech-globe.jpg`,
    ogType: 'event',
    structuredData: ICRAST_EVENT_SCHEMA,
  },
  '/icrast/venue': {
    title: 'Venue & Travel Guide · ICRAST-26 | University of Calicut Campus',
    description:
      'Complete venue, accommodation and travel directions for ICRAST-26 at University of Calicut, Thenhipalam, Kerala, India.',
    keywords: 'ICRAST venue, University of Calicut campus, Calicut airport to university, accommodation Thenhipalam',
    canonicalPath: '/icrast/venue',
  },
  '/icrast/submit': {
    title: 'Call for Abstracts & Submissions · ICRAST-26 Conference',
    description:
      'Submit your research abstract for ICRAST-26. 11 thematic tracks spanning biotechnology, genetic engineering, nanotechnology, and precision agriculture.',
    keywords: 'ICRAST submit abstract, call for papers biotechnology, research submission deadline, journal publication',
    canonicalPath: '/icrast/submit',
  },
  '/icrast/contact': {
    title: 'Organizing Secretariat & Contact · ICRAST-26 Conference',
    description:
      'Contact the ICRAST-26 organizing committee, convenors, and secretariats at Science Orbit Forum and University of Calicut.',
    keywords: 'ICRAST contact, conference convenor, university of calicut science desk',
    canonicalPath: '/icrast/contact',
  },
  '/festival': {
    title: 'Science Orbit Festival 2K26 (SOF-26) · Flagship Science Celebration',
    description:
      'Join Science Orbit Festival 2K26: From Atoms to Ecosystems. A multi-month celebration of scientific curiosity, workshops, competitions and seminars across Kerala.',
    keywords: 'Science Orbit Festival 2K26, SOF-26, science festival Calicut, student research competitions',
    canonicalPath: '/festival',
    ogImage: `${BASE_SITE_URL}/images/science-orbit-festival.jpg`,
    ogType: 'event',
    structuredData: FESTIVAL_EVENT_SCHEMA,
  },
  '/updates': {
    title: 'News & Official Announcements · Science Orbit Forum',
    description:
      'Read official news, announcements, press releases and research breakthroughs from the Science Orbit Forum secretariat.',
    keywords: 'Science Orbit news, science forum announcements, conference notifications, research updates',
    canonicalPath: '/updates',
  },
  '/people': {
    title: 'Leadership & Academic Council · Science Orbit Forum',
    description:
      'Meet the scientists, researchers, faculty mentors, and student leaders steering Science Orbit Forum initiatives and collaborations.',
    keywords: 'Science Orbit Forum leadership, scientific advisors, research directors, academic mentors',
    canonicalPath: '/people',
  },
  '/join': {
    title: 'Join Science Orbit Forum · Membership Categories & Benefits',
    description:
      'Become a member of Science Orbit Forum. Gain exclusive access to research grants, conference registrations, mentoring, and academic publishing support.',
    keywords: 'science forum membership, research community membership, student scientist association, academic networking',
    canonicalPath: '/join',
  },
  '/join/apply': {
    title: 'Apply for Membership · Science Orbit Forum',
    description:
      'Complete your official membership application for Science Orbit Forum. Open to students, researchers, faculty, and science enthusiasts.',
    keywords: 'membership application, join science orbit, science registration form',
    canonicalPath: '/join/apply',
  },
  '/support': {
    title: 'Funding & Strategic Support · Science Orbit Forum',
    description:
      'Support open science, student research initiatives, and public outreach programmes by partnering with Science Orbit Forum.',
    keywords: 'support science, research grants, STEM sponsorships, science forum donations',
    canonicalPath: '/support',
  },
  '/donate': {
    title: 'Donate & Support Scientific Research · Science Orbit Forum',
    description:
      'Make a contribution to support emerging young researchers, student science equipment, and community science literacy programmes.',
    keywords: 'donate to science, research fund contribution, science charity Kerala',
    canonicalPath: '/donate',
  },
  '/privacy': {
    title: 'Privacy Policy · Science Orbit Forum',
    description:
      'Privacy policy explaining data protection, user privacy, and compliance practices for Science Orbit Forum members and visitors.',
    canonicalPath: '/privacy',
  },
  '/terms': {
    title: 'Terms & Conditions · Science Orbit Forum',
    description:
      'Terms and conditions governing use of the Science Orbit Forum website, portals, memberships, and event registrations.',
    canonicalPath: '/terms',
  },
};

/**
 * Updates or creates a <meta> element in <head>.
 */
function setMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string) {
  if (typeof document === 'undefined') return;

  let el = document.querySelector<HTMLMetaElement>(`meta[${attributeName}="${attributeValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attributeName, attributeValue);
    document.head.appendChild(el);
  }
  el.content = content;
}

/**
 * Updates or creates a <link rel="..."> element in <head>.
 */
function setLinkTag(rel: string, href: string, id?: string) {
  if (typeof document === 'undefined') return;

  const selector = id ? `link#${id}` : `link[rel="${rel}"]`;
  let el = document.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    if (id) el.id = id;
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * Injects or updates Schema.org JSON-LD structured data.
 */
function setStructuredData(data: Record<string, any> | Array<Record<string, any>> | undefined) {
  if (typeof document === 'undefined') return;

  const scriptId = 'sof-structured-data';
  let el = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (!data) {
    // Fall back to Organization + WebSite
    data = [ORGANIZATION_SCHEMA, WEBSITE_SCHEMA];
  }

  if (!el) {
    el = document.createElement('script');
    el.id = scriptId;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }

  try {
    el.textContent = JSON.stringify(data);
  } catch (err) {
    console.error('[SEO] Failed to serialize structured data:', err);
  }
}

/**
 * Master function to update all SEO tags, Open Graph, Twitter Cards, and Structured Data.
 */
export function updateSeoHead(config: PageSeoConfig) {
  if (typeof document === 'undefined') return;

  const title = config.title || DEFAULT_SITE_TITLE;
  const description = config.description || DEFAULT_DESCRIPTION;
  const keywords = config.keywords || DEFAULT_KEYWORDS;
  const canonicalUrl = `${BASE_SITE_URL}${config.canonicalPath || window.location.pathname}`;
  const ogImage = config.ogImage || DEFAULT_OG_IMAGE;
  const ogType = config.ogType || 'website';
  const robots = config.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  // 1. Basic Meta
  document.title = title;
  setMetaTag('name', 'description', description);
  setMetaTag('name', 'keywords', keywords);
  setMetaTag('name', 'robots', robots);
  setMetaTag('name', 'author', 'Science Orbit Forum');

  // 2. Canonical
  setLinkTag('canonical', canonicalUrl, 'canonical-url');

  // 3. Open Graph
  setMetaTag('property', 'og:site_name', 'Science Orbit Forum');
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:image', ogImage);
  setMetaTag('property', 'og:type', ogType);

  // 4. Twitter Cards
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);
  setMetaTag('name', 'twitter:image', ogImage);

  // 5. Structured Data JSON-LD
  setStructuredData(config.structuredData);
}
