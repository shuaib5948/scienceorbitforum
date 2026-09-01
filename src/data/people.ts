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
    image: 'https://placehold.co/200x200/1261A0/FFFFFF?text=MR',
    bio: "M. Rasheed T. P. holds a Master's degree in Physics from the Central University of Uttarakhand, along with a Bachelor's degree in Physics from the University of Calicut and a Bachelor's degree in Education from Tamil Nadu Teachers Education University. With over five and a half years of experience in STEM education and administration, he has developed extensive expertise in educational initiatives, academic coordination, and organizational administration. His experience and commitment to advancing science and STEM education contribute to the organization's vision of fostering scientific learning, innovation, and collaboration.",
  },
  {
    id: 'secretary-shabeer',
    name: 'M. Shabeer U.',
    role: 'Secretary',
    title: 'Secretary · Science Orbit Forum',
    institution: 'Jamia Madeenathunnoor',
    department: 'Science Orbit Forum',
    topics: ['Administration', 'Programmes'],
    image: 'https://placehold.co/200x200/1261A0/FFFFFF?text=MS',
    bio: 'M. Shabeer U. serves as the Secretary of Science Orbit Forum, supporting its programmes, coordination and day-to-day functioning.',
  },
];

export const personById = (id: string): Person | undefined =>
  people.find((p) => p.id === id);

