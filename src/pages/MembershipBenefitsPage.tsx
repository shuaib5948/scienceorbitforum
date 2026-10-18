import { PageHero } from '../components/site/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ButtonLink } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { Users, Briefcase, Award, Coins, Sparkles, CheckCircle2 } from 'lucide-react';

interface BenefitGroup {
  category: string;
  icon: typeof Users;
  color: string;
  items: Array<{ title: string; desc: string }>;
}

const BENEFIT_GROUPS: BenefitGroup[] = [
  {
    category: 'Community & Scientific Networks',
    icon: Users,
    color: '#1e4fd8',
    items: [
      {
        title: 'Community and Networking',
        desc: 'Connect, collaborate, and share knowledge across interdisciplinary scientific networks and student forums.',
      },
      {
        title: 'Specialized Interest Groups',
        desc: 'Join focused working groups exploring physical sciences, chemical technologies, biosciences, and mathematics.',
      },
      {
        title: 'Local Chapters & Public Lectures',
        desc: 'Engage with fellow members through regional seminars, community outreach, school programmes, and science discussions.',
      },
      {
        title: 'Subject Communities',
        desc: 'Advance shared research goals with academic peers and professionals working in your specific field.',
      },
    ],
  },
  {
    category: 'Professional Growth & Mentorship',
    icon: Briefcase,
    color: '#0284c7',
    items: [
      {
        title: 'One-to-One Career Guidance',
        desc: 'Confidential consultations to discuss your academic trajectory, research plans, and career progression.',
      },
      {
        title: 'Academic & Industry Mentoring',
        desc: 'Learn directly from experienced scientists and research leaders, or mentor the next generation of students.',
      },
      {
        title: 'Professional Profiles & Skills',
        desc: 'Resources and training to refine your research documentation, profile, and presentation skills.',
      },
      {
        title: 'Approved Workshops & Short Courses',
        desc: 'Peer-reviewed learning opportunities and masterclasses discounted exclusively for SOF members.',
      },
    ],
  },
  {
    category: 'Conferences, Outreach & Recognition',
    icon: Award,
    color: '#7c3aed',
    items: [
      {
        title: 'Discounted Conference Access',
        desc: 'Preferential registration and delegate fees for SOF international conferences, symposia, and workshops.',
      },
      {
        title: 'Volunteering & Leadership',
        desc: 'Participate in organizing committees, STEM education drives, public outreach, and scientific working groups.',
      },
      {
        title: 'Designatory Membership Title',
        desc: 'Demonstrate your active commitment to science popularisation, research integrity, and community advancement.',
      },
      {
        title: 'Professional Development Awards',
        desc: 'Recognition and certificates reflecting milestones across early-career, graduate, and faculty leadership levels.',
      },
    ],
  },
  {
    category: 'Grants, Allowances & Support',
    icon: Coins,
    color: '#16a34a',
    items: [
      {
        title: 'Research & Development Grants',
        desc: 'Support for early-career researchers and students to initiate high-potential projects and prototypes.',
      },
      {
        title: 'Conference Attendance Allowance',
        desc: 'Travel and delegate assistance for deserving students presenting papers at academic summits.',
      },
      {
        title: 'Brain Innovation Grants',
        desc: 'Dedicated seed funding for students pursuing novel, creative scientific experiments and solutions.',
      },
      {
        title: 'Accessibility & Participation Grants',
        desc: 'Assistance for participants requiring logistical or financial support to take part in events.',
      },
    ],
  },
];

export default function MembershipBenefitsPage() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Membership Benefits"
        lede="Membership gives you a place in a growing ecosystem of learners, thinkers and research communities."
        roomy
      />

      <section className="container section">
        <SectionHeading
          eyebrow="Why join"
          title="A community designed for learning and engagement"
          lede="Members help shape a forum where science becomes approachable, collaborative and relevant."
          align="center"
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '1.5rem',
          marginTop: 'var(--space-6)',
        }}>
          {BENEFIT_GROUPS.map((group) => {
            const Icon = group.icon;
            return (
              <Reveal key={group.category} as="article">
                <div
                  className="card"
                  style={{
                    height: '100%',
                    padding: '1.5rem',
                    borderRadius: '18px',
                    border: '1px solid rgba(11, 27, 51, 0.1)',
                    background: '#ffffff',
                    boxShadow: '0 4px 20px rgba(11, 27, 51, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.15rem' }}>
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: `${group.color}14`,
                      color: group.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={20} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.08rem', fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
                      {group.category}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', flex: 1 }}>
                    {group.items.map((item) => (
                      <div key={item.title} style={{ display: 'flex', gap: '0.55rem', alignItems: 'flex-start' }}>
                        <CheckCircle2 size={16} style={{ color: group.color, flexShrink: 0, marginTop: '0.2rem' }} />
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.9rem', color: '#0b1b33', lineHeight: 1.35 }}>
                            {item.title}
                          </strong>
                          <span style={{ display: 'block', fontSize: '0.82rem', color: '#475569', lineHeight: 1.55, marginTop: '0.2rem' }}>
                            {item.desc}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div style={{ marginTop: 'var(--space-7)', textAlign: 'center' }}>
          <ButtonLink href="/join" variant="primary" withArrow>
            Explore Membership Categories &amp; Apply
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
