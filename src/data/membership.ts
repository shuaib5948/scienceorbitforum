export interface MembershipCategory {
  id: string;
  group: 'For individuals' | 'For institutions';
  title: string;
  cost: string;
  eligibility?: string[];
  comingSoon?: boolean;
}

export interface MembershipBenefit {
  id: string;
  title: string;
  description: string;
}

export interface RegulationClause {
  code?: string;
  text: string;
  bullets?: string[];
}

export interface MembershipRegulationSection {
  number: string;
  title: string;
  clauses: RegulationClause[];
}

export const MEMBERSHIP_CATEGORIES: MembershipCategory[] = [
  {
    id: 'platinum',
    group: 'For individuals',
    title: 'Platinum',
    cost: '₹10,000 / year',
    eligibility: ['Scientists', 'Faculties'],
  },
  {
    id: 'gold',
    group: 'For individuals',
    title: 'Gold',
    cost: '₹5,000 / year',
    eligibility: ['Graduates', 'PhDs', 'Postdocs', 'Industry Personnel'],
  },
  {
    id: 'silver',
    group: 'For individuals',
    title: 'Silver',
    cost: '₹1,000 / year',
    eligibility: ['School Students', 'Under Graduates', 'Others'],
  },
  {
    id: 'institutional',
    group: 'For institutions',
    title: 'Institutions',
    cost: 'Coming soon',
    comingSoon: true,
  },
];

export const MEMBERSHIP_BENEFITS: MembershipBenefit[] = [
  {
    id: 'community',
    title: 'Community and Networking',
    description:
      'Collaboration and knowledge-sharing are at the heart of the SOF membership community. We provide networks for you to connect, engage, and grow within the scientific community.',
  },
  {
    id: 'development',
    title: 'Professional Development and Support',
    description:
      'Our support is there for you at every stage of your career, offering tailored resources and expert guidance to help you succeed.',
  },
  {
    id: 'funding',
    title: 'Funding and Grants',
    description:
      'We provide funding and grants to help advance your career, support research, and remove financial barriers.',
  },
];

export const MEMBERSHIP_REGULATIONS: MembershipRegulationSection[] = [
  {
    number: '01',
    title: 'Application and Admission',
    clauses: [
      {
        code: '1.1.',
        text: 'Applicants must submit the prescribed membership application form and provide accurate and complete information.',
      },
      {
        code: '1.2.',
        text: "SOF may request supporting documents to verify an applicant's identity, academic status, professional qualifications, or eligibility.",
      },
      {
        code: '1.3.',
        text: 'Membership shall be granted only after the application has been reviewed and approved by the authorised representative or committee of SOF.',
      },
      {
        code: '1.4.',
        text: 'Submission of an application or payment of the membership fee does not automatically guarantee admission.',
      },
      {
        code: '1.5.',
        text: 'Applicants must notify SOF of any material changes to the information provided in their application.',
      },
    ],
  },
  {
    number: '02',
    title: 'Membership Fees and Renewal',
    clauses: [
      {
        code: '2.1.',
        text: 'Membership fees shall be payable annually according to the selected membership category.',
      },
      {
        code: '2.2.',
        text: 'Membership shall ordinarily remain valid for one year from the effective date of admission, unless otherwise specified by SOF.',
      },
      {
        code: '2.3.',
        text: 'Members are responsible for renewing their membership before its expiry to maintain continuous membership status and associated benefits.',
      },
      {
        code: '2.4.',
        text: 'Membership fees, once paid, shall generally be non-refundable, except where SOF approves a refund or where applicable law requires otherwise.',
      },
      {
        code: '2.5.',
        text: 'Any changes to the membership fee structure shall be communicated through official SOF channels.',
      },
    ],
  },
  {
    number: '03',
    title: 'Responsibilities and Code of Conduct',
    clauses: [
      {
        code: '3.1.',
        text: 'Members shall uphold the objectives, values, reputation, and professional standards of SOF.',
      },
      {
        code: '3.2.',
        text: 'Members shall engage respectfully with fellow members, organisers, partners, institutions, and the wider scientific community.',
      },
      {
        code: '3.3.',
        text: 'Members must not engage in plagiarism, research misconduct, fraud, harassment, discrimination, misrepresentation, or other inappropriate conduct in connection with SOF activities.',
      },
      {
        code: '3.4.',
        text: 'Members must not use the name, logo, identity, or resources of SOF for unauthorised commercial, personal, or misleading purposes.',
      },
      {
        code: '3.5.',
        text: 'Members must respect intellectual property rights, confidentiality obligations, and applicable data protection requirements.',
      },
      {
        code: '3.6.',
        text: 'Members participating in SOF events, committees, projects, or funding programmes must comply with the relevant programme-specific rules.',
      },
    ],
  },
  {
    number: '04',
    title: 'Membership Suspension and Termination',
    clauses: [
      {
        code: '4.1.',
        text: 'SOF may suspend or terminate membership in cases involving:',
        bullets: [
          'Violation of these regulations or applicable organisational policies.',
          'Submission of false or misleading information.',
          'Serious misconduct or behaviour that harms the organisation or its members.',
          "Unauthorised use of SOF's name, logo, funds, or resources.",
          'Non-renewal or non-payment of applicable membership fees.',
        ],
      },
      {
        code: '4.2.',
        text: 'Where appropriate, the member shall be informed of the grounds for the proposed action and given a reasonable opportunity to respond before a final decision is made.',
      },
      {
        code: '4.3.',
        text: "SOF may take immediate temporary action where necessary to protect members, activities, assets, or the organisation's interests.",
      },
      {
        code: '4.4.',
        text: 'Termination of membership shall not automatically entitle a member to a refund of fees, subject to applicable law and any approved refund policy.',
      },
    ],
  },
  {
    number: '05',
    title: 'Resignation and Rejoining',
    clauses: [
      {
        code: '5.1.',
        text: 'Members may voluntarily resign by submitting written notice through the official communication channels of SOF.',
      },
      {
        code: '5.2.',
        text: 'Resignation shall take effect upon acknowledgement by SOF or on another date specified in the applicable membership procedure.',
      },
      {
        code: '5.3.',
        text: 'Former members may apply to rejoin SOF, subject to the membership rules and approval procedures in force at the time of reapplication.',
      },
    ],
  },
  {
    number: '06',
    title: 'Grants, Awards, and Financial Assistance',
    clauses: [
      {
        code: '6.1.',
        text: 'Grants, awards, and financial assistance shall be governed by separate guidelines issued by SOF.',
      },
      {
        code: '6.2.',
        text: 'Applicants must provide accurate information and any supporting documents required for assessment.',
      },
      {
        code: '6.3.',
        text: 'The availability and amount of financial assistance shall depend on the approved budget, eligibility criteria, and selection process.',
      },
      {
        code: '6.4.',
        text: 'SOF reserves the right to verify applications and withdraw an award obtained through false information or a breach of applicable grant conditions, subject to the relevant procedure.',
      },
    ],
  },
  {
    number: '07',
    title: 'Privacy and Information Management',
    clauses: [
      {
        code: '7.1.',
        text: 'SOF shall collect and use membership information for legitimate organisational purposes, including administration, communication, event management, and delivery of member benefits.',
      },
      {
        code: '7.2.',
        text: "Personal information shall be handled in accordance with applicable laws and the organisation's privacy policy.",
      },
      {
        code: '7.3.',
        text: 'Members shall provide accurate contact information and promptly report changes where necessary.',
      },
      {
        code: '7.4.',
        text: 'Member information shall not be disclosed to third parties except where authorised, necessary for legitimate organisational purposes, or required by applicable law.',
      },
    ],
  },
  {
    number: '08',
    title: 'Amendments and Interpretation',
    clauses: [
      {
        code: '8.1.',
        text: 'SOF may amend these regulations, membership fees, eligibility criteria, and benefit structures through its authorised decision-making process.',
      },
      {
        code: '8.2.',
        text: 'Members shall be informed of material changes through appropriate official communication channels.',
      },
      {
        code: '8.3.',
        text: "Any matter not expressly addressed in these regulations shall be considered by the authorised governing body of SOF in accordance with the organisation's governing documents and applicable law.",
      },
      {
        code: '8.4.',
        text: 'If any provision of these regulations is found to be invalid or unenforceable, the remaining provisions shall continue to apply to the extent permitted by law.',
      },
    ],
  },
  {
    number: '09',
    title: 'Acceptance of Terms',
    clauses: [
      {
        text: 'By submitting a membership application and accepting admission to Science Orbit Forum, the applicant acknowledges that they have read, understood, and agreed to these Membership Regulations, Terms and Conditions, together with any applicable policies issued by SOF.',
      },
    ],
  },
];
