/**
 * Science Orbit Forum (SOF) Membership Application — Frontend Configuration & Types
 */

export interface MembershipSubmissionPayload {
  // A. Applicant Details
  fullName: string;
  dob: string;
  email: string;
  phone: string;
  postalAddress: string;
  cityDistrictState: string;
  country: string;
  preferredCommunication: 'Email' | 'Mobile / WhatsApp' | 'Both';
  institution?: string;
  designationCourse?: string;
  qualificationStatus: string;
  scientificInterests: string;

  // B. Membership Category
  category: 'platinum' | 'gold' | 'silver';
  requestedStartDate: string;
  memberStatus: 'new' | 'renewal';

  // C. Interests & Participation
  participationInterests: string[];
  otherInterestText?: string;
  contributionStatement: string;

  // D. Supporting Documents (Base64 encoded)
  proofOfIdentity: {
    filename: string;
    mimeType: string;
    base64Data: string;
    fileSizeBytes: number;
  };
  institutionalId: {
    filename: string;
    mimeType: string;
    base64Data: string;
    fileSizeBytes: number;
  };

  // E. Declaration
  consent: boolean;
}

export interface SubmissionSuccessResponse {
  ok: true;
  reference: string;
  timestamp: string;
  categoryTitle: string;
  annualFee: string;
  message: string;
}

export interface SubmissionErrorResponse {
  ok: false;
  error: string;
  details?: string[];
}

export type SubmissionResponse = SubmissionSuccessResponse | SubmissionErrorResponse;

// Endpoint configuration: Can be supplied via VITE_MEMBERSHIP_SCRIPT_URL or fallback
export const MEMBERSHIP_SCRIPT_URL =
  import.meta.env.VITE_MEMBERSHIP_SCRIPT_URL || '';

export const ALLOWED_DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
];

export const ALLOWED_DOCUMENT_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];

export const MAX_DOCUMENT_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

export const PARTICIPATION_INTEREST_OPTIONS = [
  'Research and innovation',
  'Science communication and outreach',
  'Conferences and workshops',
  'Mentoring and career development',
  'Volunteering and committees',
  'Student activities and competitions',
  'Interest groups / subject communities',
  'Other',
] as const;

export const CATEGORY_DETAILS: Record<
  'platinum' | 'gold' | 'silver',
  { title: string; costText: string; feeNumber: number; description: string }
> = {
  platinum: {
    title: 'Platinum',
    costText: '₹10,000 / year',
    feeNumber: 10000,
    description: 'Scientists and faculty members',
  },
  gold: {
    title: 'Gold',
    costText: '₹5,000 / year',
    feeNumber: 5000,
    description: 'Graduates, PhD holders/candidates, postdoctoral researchers and industry personnel',
  },
  silver: {
    title: 'Silver',
    costText: '₹1,000 / year',
    feeNumber: 1000,
    description: 'School students, undergraduate students and other eligible applicants',
  },
};
