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
    image: "/images/marie-curie-lab.jpg",
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
    eyebrow: "Annual Flagship Event",
    titlePrimary: "SCIENCE ORBIT FESTIVAL",
    subdescription: "A celebration of scientific exploration featuring exhibitions, interactive experiments, demonstrations and collaborative discoveries.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1920&q=75",
    primaryCta: {
      label: "Festival Highlights",
      to: "/events/science-festival-2026",
    },
    secondaryCta: {
      label: "Explore Events",
      to: "/events",
    },
  },
  {
    id: 'hero-slide-3',
    eyebrow: "Global Research Symposium",
    titlePrimary: "ICRAST 2026",
    subdescription: "International Conference on Recent Advancements in Science and Technology — uniting researchers, academicians and innovators.",
    image: "/images/icrast-biotech-globe.jpg",
    primaryCta: {
      label: "Explore ICRAST-26",
      to: "/icrast",
    },
    secondaryCta: {
      label: "Participate Now",
      to: "/icrast",
    },
  },
];
