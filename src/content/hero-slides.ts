export interface HeroSlide {
  id: string;
  eyebrow?: string;
  titlePrimary?: string;
  quote?: {
    text: string;
    author: string;
  };
  subdescription?: string;
  image: string;
  primaryCta: {
    label: string;
    to: string;
  };
  secondaryCta: {
    label: string;
    to: string;
  };
}

export const heroSlidesData: HeroSlide[] = [
  {
    id: 'hero-slide-1',
    quote: {
      text: "“Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.”",
      author: "Marie Curie",
    },
    image: "/images/marie-curie-lab.png",
    primaryCta: {
      label: "Join Science Orbit",
      to: "/join",
    },
    secondaryCta: {
      label: "Explore Events",
      to: "/events",
    },
  },
  {
    id: 'hero-slide-2',
    eyebrow: "Global Research Symposium",
    titlePrimary: "ICRAST-26",
    subdescription: "International Conference on Recent Advances in Science & Technology — uniting researchers, academicians and innovators at Aryabhata Hall, University of Calicut on 21 November 2026.",
    image: "/images/icrast-biotech-globe.jpg",
    primaryCta: {
      label: "Explore ICRAST-26",
      to: "/icrast",
    },
    secondaryCta: {
      label: "Submit Abstract",
      to: "/icrast/submit",
    },
  },
  {
    id: 'hero-slide-3',
    eyebrow: "Annual Flagship Event",
    titlePrimary: "SCIENCE ORBIT FESTIVAL 2K26",
    subdescription: "“From Atoms to Ecosystems: The Continuum of Life” — our signature science celebration uniting students, innovators and educators across live science exhibitions, workshops and interactive labs.",
    image: "/images/science-orbit-festival.jpg",
    primaryCta: {
      label: "Festival Highlights",
      to: "/festival",
    },
    secondaryCta: {
      label: "Explore Events",
      to: "/events",
    },
  },
];
