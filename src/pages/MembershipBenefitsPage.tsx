import { PageHero } from '../components/site/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';

const benefits = [
  'Community and networking: Collaboration and knowledge-sharing are at the heart of the SOF membership community. We provide networks for you to connect, engage, and grow within the chemical sciences community.',
  'Interest groups: Join over 70 scientific networks focused on a specific area or application of the chemical sciences.',
  'Local sections: Network with members in your area through events such as scientific lectures, public lectures, schools activities and social events.',
  'Subject communities: Our subject communities bring together members with similar scientific and professional interests, including from across our interest groups, to advance their subject areas.',
  'Consultants’ directory: Free registration for members, providing exposure to potential clients and collaborators helping to advance a wide range of chemistry and chemical technology disciplines.',
  'Discounted access to RSC events: Enjoy lower rates for conferences, workshops, and networking sessions.',
  'Volunteering opportunities: Contribute to the RSC by joining committees, engaging in education and outreach, and shaping policy discussions.',
  'Policy and advocacy: Participate in thought leadership initiatives covering sustainability, diversity, education and beyond.',
  'Professional development and support: Our support is there for you at every stage of your career, offering tailored resources and expert guidance to help you succeed.',
  'One-to-one career support: Confidential consultations to discuss your professional situation and give you the confidence to take the next step in your career.',
  'Mentoring: Benefit from expert guidance through mentoring programmes, whether you are seeking support to navigate career challenges or looking to give back by becoming a mentor.',
  'Online career support: Utilise it to build and improve your professional profile and interview technique, as well as assess your strengths.',
  'Designatory letters: Demonstrate your professional status and expertise.',
  'Professional development awards: Demonstrate your experience and ongoing commitment to continuous professional development with a range of awards that reflect a wide range of career stages and specialisms.',
  'Approved training courses: Peer-reviewed learning opportunities across various disciplines discounted to support SOF members development.',
  'Pay and reward survey report: A valuable benchmarking resource for salary and career progression.',
  'Funding and grants: We provide funding and grants to help advance your career, support research, and remove financial barriers.',
  'Research and development grant: For early-career scientists in academia and industry.',
  'Conference allowance: Grants for members with limited access to funding to attend conferences.',
  'Brain grant: Support for students with novel ideas.',
  'Accessibility and carer grants: Financial assistance for members needing additional support to attend professional events.',
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

        <div style={{ maxWidth: 760, margin: 'var(--space-6) auto 0' }}>
          <ul style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, paddingLeft: 'var(--space-5)' }}>
            {benefits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
