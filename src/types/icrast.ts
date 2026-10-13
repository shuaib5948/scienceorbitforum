/**
 * ICRAST-26 Conference Abstract Submission — Data Types & Options
 */

export interface CoAuthor {
  fullName: string;
  gender: string;
  affiliation: string;
  department: string;
  email: string;
  designationStatus: string;
}

export interface IcrastAbstractSubmissionPayload {
  formType: 'icrast_abstract';

  // Section I — Author Information
  presentingAuthor: {
    fullName: string;
    gender: string;
    email: string;
    phone: string;
    affiliation: string;
    department: string;
    designationStatus: string;
    country: string;
    state: string;
    city: string;
  };

  // Section II — Co-Author Information
  coAuthors: CoAuthor[];

  // Section III — Abstract Information
  abstractInfo: {
    paperTitle: string;
    abstractText: string;
    keywords: string;
    researchArea: string;
    subfield: string;
    typeOfResearch: string;
  };

  // Section IV — File Uploads
  files: {
    editableDoc?: {
      filename: string;
      mimeType: string;
      base64Data: string;
      fileSizeBytes: number;
    };
    pdfDoc?: {
      filename: string;
      mimeType: string;
      base64Data: string;
      fileSizeBytes: number;
    };
  };

  // Section V — Presentation Preference
  preferences: {
    presentationCategory: string;
    presentationMode: string;
    guidelineAgreement: boolean;
  };

  // Section VI — Research Ethics and Originality
  ethics: {
    originality: boolean;
    plagiarism: boolean;
    authorship: boolean;
    ethicsCompliance: boolean;
  };

  // Section VIII — Final Confirmation
  confirmation: {
    accurateInfo: boolean;
    noGuarantee: boolean;
    subjectToConfirmation: boolean;
    followInstructions: boolean;
  };
}

export const DESIGNATION_OPTIONS = [
  'Undergraduate student',
  'Postgraduate student',
  'PhD scholar',
  'Postdoctoral researcher',
  'Faculty member',
  'Research scientist',
  'Industry professional',
  'Independent researcher',
  'Other',
] as const;

export const GENDER_OPTIONS = [
  'Male',
  'Female',
  'Non-binary',
  'Prefer not to say',
] as const;

export const RESEARCH_TYPE_OPTIONS = [
  'Original experimental research',
  'Theoretical research',
  'Computational or simulation-based research',
  'Review study',
  'Methodology or technical development',
  'Other',
] as const;

export const RESEARCH_AREAS = [
  'Molecular Biology and Genetic Engineering',
  'Advanced Functional Materials and Biomaterials',
  'Tissue Engineering and Regenerative Medicine',
  'Biosensors and Diagnostic Technologies',
  'Marine Science and Marine Biotechnology',
  'Space Science and Space Biotechnology',
  'Agricultural Science and Precision Agriculture',
  'Environmental Science and Environmental Engineering',
  'Renewable Energy and Storage Technologies',
  'Chemical Engineering and Process Engineering',
  'Nanoscience and Nanotechnology',
  'Other Frontier Interdisciplinary Area',
] as const;

export const PRESENTATION_CATEGORIES = [
  'Oral Presentation',
  'Poster Presentation',
  'No preference — the organising committee may assign a category.',
] as const;

export const PRESENTATION_MODES = [
  'On-site presentation',
  'Live online presentation',
] as const;
