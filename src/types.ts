/**
 * Science Orbit Forum — Phase 2 shared domain types.
 *
 * These describe the content model that the routed pages consume via loaders.
 * They are pure declarations: no styling, no runtime deps — reused across
 * data files, route loaders and presentational components.
 */
export type Role = 'President' | 'Secretary' | 'Student' | 'Faculty' | 'Researcher' | 'Alumni';

export interface Person {
  id: string;
  name: string;
  role: Role;
  title: string;
  institution: string;
  department?: string;
  topics: string[];
  image: string;
  bio: string;
  profileUrl?: string;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  endDate?: string;
  location: string;
  tag: string;
  image: string;
  excerpt: string;
  featured?: boolean;
}

export interface Update {
  slug: string;
  title: string;
  date: string;
  author: string;
  tag: string;
  excerpt: string;
  cover?: string;
}

export interface ResearchItem {
  id: string;
  title: string;
  lab: string;
  tag: string;
  excerpt: string;
}

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  institution: string;
  nav: NavItem[];
}

// A single canonical list of primary navigation sections for the site IA.
// Deliberately minimal and non-membership oriented — About · Events · Updates · People.
export const NAVIGATION: NavItem[] = [
  { label: 'Who We Are', href: '/who-we-are' },
  { label: 'Mission', href: '/mission' },
  { label: 'Vision', href: '/vision' },
  { label: 'Events', href: '/events' },
  { label: 'Updates', href: '/updates' },
  { label: 'People', href: '/about/people' },
];
