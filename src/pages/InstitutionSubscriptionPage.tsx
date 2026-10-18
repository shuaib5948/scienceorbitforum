import { PageHero } from '../components/site/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ButtonLink } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { Building2, Calendar, Users, Sparkles, Mail, CheckCircle2 } from 'lucide-react';

const INSTITUTIONAL_PILLARS = [
  {
    icon: Building2,
    title: 'Academic Institutions & Colleges',
    desc: 'Structured partnership pathways for universities, colleges, and schools seeking long-term scientific collaboration.',
  },
  {
    icon: Calendar,
    title: 'Flagship Event Access',
    desc: 'Guaranteed delegation access to SOF academic conferences, summits, research workshops, and public exhibitions.',
  },
  {
    icon: Users,
    title: 'Student & Faculty Ecosystem',
    desc: 'Direct channels connecting students, young innovators, and faculty members with leading scientists and laboratories.',
  },
  {
    icon: Sparkles,
    title: 'Collaborative Science Culture',
    desc: 'Joint initiatives, campus science drives, and mentorship opportunities that foster open scientific inquiry.',
  },
];

export default function InstitutionSubscriptionPage() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Institution Subscription"
        lede="Institution subscription provides schools, colleges and universities with a sustained pathway to participate in Science Orbit Forum’s learning and research community."
        roomy
      />

      <section className="container section">
        <SectionHeading
          eyebrow="For institutions"
          title="A platform for academic collaboration and science engagement"
          lede="This membership model is designed for institutions that want to connect their communities with meaningful science learning, exploration and public engagement."
          align="center"
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '1.5rem',
          maxWidth: 960,
          margin: 'var(--space-6) auto 0',
        }}>
          {INSTITUTIONAL_PILLARS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={idx * 50}>
                <div
                  className="card"
                  style={{
                    height: '100%',
                    padding: '1.5rem',
                    borderRadius: '18px',
                    border: '1px solid rgba(11, 27, 51, 0.1)',
                    background: '#ffffff',
                    boxShadow: '0 4px 18px rgba(11, 27, 51, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                  }}
                >
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: 'rgba(30, 79, 216, 0.08)',
                    color: 'var(--color-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={22} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
                    {item.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.65 }}>
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div style={{ marginTop: 'var(--space-7)', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '1.75rem 2rem',
            borderRadius: '20px',
            background: 'var(--color-surface-muted)',
            border: '1px solid rgba(11, 27, 51, 0.08)',
            maxWidth: 580,
            width: '100%',
          }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Interested in subscribing your institution or exploring a formal academic partnership?
            </span>
            <ButtonLink href="mailto:info@scienceorbitforum.org" variant="primary" withArrow>
              Contact Institutional Secretariat
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
