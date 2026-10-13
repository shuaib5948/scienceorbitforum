import type { Person } from '../types';

/**
 * Science Orbit Forum — People (office bearers).
 */
export const people: Person[] = [
  {
    id: 'president-rasheed',
    name: 'M. Rasheed T. P.',
    role: 'President',
    title: 'President · Science Orbit Forum',
    institution: 'Jamia Madeenathunnoor',
    department: 'Science Orbit Forum',
    topics: ['STEM Education', 'Academic Coordination', 'Administration'],
    image: '/images/rasheed.jpg',
    bio: "M. Rasheed T. P. holds a Master's degree in Physics from the Central University of Uttarakhand, along with a Bachelor's degree in Physics from the University of Calicut and a Bachelor's degree in Education from Tamil Nadu Teachers Education University. With over five and a half years of experience in STEM education and administration, he has developed extensive expertise in educational initiatives, academic coordination, and organizational administration. His experience and commitment to advancing science and STEM education contribute to the organization's vision of fostering scientific learning, innovation, and collaboration.",
  },
  {
    id: 'secretary-shabeer',
    name: 'M. Shabeer U.',
    role: 'Secretary',
    title: 'Secretary · Science Orbit Forum',
    institution: 'National Institute of Technology Calicut',
    department: 'Materials Research Laboratory, Department of Chemistry',
    topics: ['Materials Chemistry', 'Scientific Research', 'Innovation'],
    image: '/images/shabeer.jpg',
    bio: "M Shabeer U holds a Bachelor's degree in Chemistry from the University of Calicut and a Master's degree in Chemistry from the National Institute of Technology Calicut. He is currently a Research Scholar at the Materials Research Laboratory, Department of Chemistry, National Institute of Technology Calicut, where he is engaged in research in the field of materials chemistry. With an academic and research-oriented background, he contributes to the organization's objectives of promoting scientific research, innovation, and meaningful engagement with science and technology.",
  },
];

export const personById = (id: string): Person | undefined =>
  people.find((p) => p.id === id);

