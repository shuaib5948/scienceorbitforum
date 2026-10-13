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
    title: 'Science Orbit Festival 2026',
    slug: 'science-festival-2026',
    date: '2026-03-15T09:00:00+00:00',
    endDate: '2026-03-17T17:00:00+00:00',
    location: 'Kozhikode, Kerala',
    tag: 'Flagship Festival',
    image: '/images/science-orbit-festival.jpg',
    excerpt: 'Our signature annual three-day science celebration uniting students, innovators and educators across live science exhibitions, interactive physics & chemistry labs, robotics demonstrations, hackathons and public science talks.',
    featured: false,
    subdomain: 'festival',
  },
];
