export interface SupportAvenue {
  id: string;
  number: string;
  title: string;
  description: string;
}

export const SUPPORT_INTRO = {
  eyebrow: 'Support Science Orbit Forum',
  title: 'Funding and Support',
  lede: 'Supporting science, innovation, and public engagement through partnerships with individuals, institutions, industries, and funding agencies.',
};

export const SUPPORT_AVENUES: SupportAvenue[] = [
  {
    id: 'individual-donations',
    number: '01',
    title: 'Individual Donations and Philanthropic Contributions',
    description:
      'Individuals, philanthropists, and well-wishers can support our initiatives through voluntary financial contributions towards scientific education, research outreach, student development, workshops, conferences, and public engagement programmes.',
  },
  {
    id: 'csr-support',
    number: '02',
    title: 'Corporate Social Responsibility (CSR) Support',
    description:
      'We welcome opportunities to collaborate with eligible companies on CSR initiatives aligned with scientific education, research, innovation, environmental sustainability, skill development, and community welfare, subject to applicable CSR regulations and eligibility requirements.',
  },
  {
    id: 'research-grants',
    number: '03',
    title: 'Research Grants and Institutional Funding',
    description:
      'SOF seeks to identify and apply for grants, project funding, and institutional support offered by government departments, research organisations, academic institutions, foundations, and other eligible funding agencies for projects aligned with our objectives.',
  },
  {
    id: 'corporate-sponsorships',
    number: '04',
    title: 'Corporate Sponsorships and Industry Partnerships',
    description:
      'Businesses and industries can support our conferences, science festivals, exhibitions, competitions, workshops, and educational programmes through financial sponsorships, technical assistance, equipment, and other mutually agreed forms of collaboration.',
  },
  {
    id: 'academic-collaborations',
    number: '05',
    title: 'Academic and Institutional Collaborations',
    description:
      'Universities, colleges, schools, laboratories, research centres, and scientific organisations can partner with SOF to organise academic events, facilitate knowledge exchange, support research activities, and develop collaborative educational initiatives.',
  },
  {
    id: 'membership-contributions',
    number: '06',
    title: 'Membership and Programme Contributions',
    description:
      "Membership fees and applicable programme-related receipts can contribute to the development and delivery of SOF's activities, including scientific events, professional development initiatives, educational outreach, and community-building programmes.",
  },
  {
    id: 'in-kind-volunteer',
    number: '07',
    title: 'In-Kind Contributions and Volunteer Support',
    description:
      'We welcome non-monetary contributions, including scientific equipment, laboratory resources, educational materials, venues, technical services, professional expertise, and volunteer assistance that can strengthen our programmes and initiatives.',
  },
  {
    id: 'student-grants',
    number: '08',
    title: 'Grants for Students and Early-Career Researchers',
    description:
      'Through eligible funding partnerships and available resources, SOF aims to develop support initiatives for students and early-career researchers, including research grants, conference attendance assistance, innovative project support, and other opportunities that encourage scientific exploration.',
  },
];

export const SUPPORT_TRANSPARENCY = {
  heading: 'Transparency and Responsible Use of Funds',
  paragraphs: [
    "All funds and contributions received by Science Orbit Forum will be managed responsibly and applied towards the company's approved objectives in accordance with applicable laws, regulatory requirements, and internal financial procedures. Contributions and funding arrangements will be accepted subject to the relevant eligibility, documentation, reporting, and compliance requirements.",
    'We invite individuals, institutions, companies, and organisations that share our vision to collaborate with us in building a scientifically informed, innovative, and research-driven society.',
  ],
  tagline: 'Partner with us. Support science. Inspire discovery.',
  contactNote:
    'For funding proposals, institutional partnerships, sponsorship opportunities, or other forms of support, please contact us through our official communication channels.',
};

export interface UpiConfig {
  vpa: string;
  payeeName: string;
  note: string;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
    branch: string;
  };
}

export const UPI_CONFIG: UpiConfig = {
  vpa: 'scienceorbitforum@upi',
  payeeName: 'Science Orbit Forum',
  note: 'Contribution to Science Orbit Forum',
  bankDetails: {
    accountName: 'Science Orbit Forum',
    accountNumber: 'Official account details provided upon receipt request',
    ifsc: 'SBIN0000000',
    bankName: 'State Bank of India',
    branch: 'Calicut (Kozhikode), Kerala',
  },
};
