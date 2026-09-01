import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { Atom, Microscope, BookOpen, Lightbulb, Users, Globe } from 'lucide-react';

/**
 * WhatWeDo — Thin-line icon grid separated by whitespace only (no card
 * borders or shadows). Icons shift navy → cyan on hover; nothing else moves.
 */
export function WhatWeDo() {
  const areas = [
    {
      icon: Atom,
      title: 'Scientific Exploration',
      description: 'Encouraging people to ask questions, investigate ideas and understand the world through science.',
    },
    {
      icon: Microscope,
      title: 'Research & Projects',
      description: 'Creating opportunities for research, experimentation and project-based learning.',
    },
    {
      icon: BookOpen,
      title: 'Science Programmes',
      description: 'Organising academic programmes, workshops, talks and scientific gatherings.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Encouraging creative problem-solving, technology and innovative thinking.',
    },
    {
      icon: Users,
      title: 'Science Communication',
      description: 'Promoting scientific awareness, discussion and exchange of ideas.',
    },
    {
      icon: Globe,
      title: 'Community & Participation',
      description: 'Bringing together students, researchers, educators and science enthusiasts.',
    },
  ];

  return (
    <section className="section" style={{ background: 'var(--color-surface-muted)' }}>
      <div className="container">
        <SectionHeading
          eyebrow="What We Do"
          title="Creating opportunities to explore, question, learn, connect and contribute."
        />
        <div className="what-we-do">
          {areas.map((area) => (
            <Reveal key={area.title} as="div">
              <div className="what-we-do__item">
                <span className="what-we-do__icon">
                  <area.icon size={26} strokeWidth={1.6} />
                </span>
                <h3 className="what-we-do__title">{area.title}</h3>
                <p className="what-we-do__desc">{area.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

