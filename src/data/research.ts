import type { ResearchItem } from '../types';

/** Science Orbit Forum — Research programme directory (Phase 2 seed). */
export const research: ResearchItem[] = [
  {
    id: 'quantum-photonics',
    title: 'Quantum Photonics & Sensing',
    lab: 'Quantum Optics Laboratory',
    tag: 'Physics',
    excerpt: 'Developing room-temperature single-photon detectors for secure quantum communication.',
  },
  {
    id: 'enzymatic-synthesis',
    title: 'Enzymatic Synthesis for Green Chemistry',
    lab: 'Sustainable Materials Laboratory',
    tag: 'Chemistry',
    excerpt: 'Engineering biocatalysts that minimise waste in pharmaceutical manufacturing.',
  },
  {
    id: 'bioacoustics-monitoring',
    title: 'Bioacoustic Monitoring of Urban Biodiversity',
    lab: 'Ecology & Conservation Laboratory',
    tag: 'Biology',
    excerpt: 'Using acoustic sensors and open datasets to track species diversity across the campus.',
  },
];
