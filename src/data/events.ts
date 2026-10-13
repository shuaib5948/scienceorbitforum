import type { EventItem } from '../types';

/**
 * Science Orbit Forum — Events catalogue (Phase 2 content-model seed).
 * Mirrors `public/data/events.json` for the fetch-with-fallback loader.
 */
export const events: EventItem[] = [
  {
    id: 'icrast-26',
    title: 'ICRAST-26 International Conference',
    slug: 'icrast-26',
    date: '2026-11-21T09:00:00+00:00',
    endDate: '2026-11-21T17:00:00+00:00',
    location: 'University of Calicut',
    tag: 'International Conference',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=40',
    excerpt: 'International Conference on Recent Advancements in Science and Technology 2026 in collaboration with Prof. M.S. Swaminathan Chair for Science Popularisation and Research, University of Calicut. Theme: Advances in Biotechnology and Frontier Sciences for Human Well-Being. Free registration · Hybrid mode.',
    featured: true,
    subdomain: 'icrast',
  },
  {
    id: 'science-festival-2026',
    title: 'Science Orbit Festival 2K26 (SOF-26)',
    slug: 'science-festival-2026',
    date: '2026-10-01T09:00:00+00:00',
    endDate: '2026-12-31T18:00:00+00:00',
    location: 'Kozhikode (Calicut), Kerala',
    tag: 'Flagship Festival',
    image: '/images/science-orbit-festival.jpg',
    excerpt: 'Science Orbit Festival 2K26 (SOF-26) launched under the theme "From Atoms to Ecosystems: The Continuum of Life." Featuring conferences, workshops, exhibitions, and student competitions culminating in December 2026 in Kozhikode.',
    featured: false,
    subdomain: 'festival',
  },
];
