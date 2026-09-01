/**
 * Science Orbit Forum — institutional identity & primary site config.
 * The IA lives here so the router, header and footer share one definition.
 */
import type { SiteConfig } from '../types';
import { NAVIGATION } from '../types';

export const SITE: SiteConfig = {
  name: 'Science Orbit Forum',
  tagline: 'Where scientific curiosity orbits into research, innovation and impact.',
  institution: 'Department of Science & Technology, Jamia Madeenathunnoor',
  nav: NAVIGATION,
};

export const NAV = NAVIGATION;
