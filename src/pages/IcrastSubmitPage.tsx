import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Reveal } from '../components/ui/Reveal';
import { IcrastLayout, ICRAST_TEMPLATE_DOWNLOAD_URL } from '../components/icrast/IcrastLayout';
import { Analytics } from '../lib/analytics';
import {
  ArrowLeft,
  CheckCircle2,
  Send,
  Upload,
  FileCheck,
  AlertCircle,
  Loader2,
  FileText,
  User,
  Users,
  Layers,
  Award,
  Plus,
  Trash2,
  Download,
  Info,
  X,
  HelpCircle,
} from 'lucide-react';
import {
  DESIGNATION_OPTIONS,
  GENDER_OPTIONS,
  RESEARCH_TYPE_OPTIONS,
  RESEARCH_AREAS,
  PRESENTATION_CATEGORIES,
  PRESENTATION_MODES,
  ICRAST_SCRIPT_URL,
  type CoAuthor,
  type IcrastAbstractSubmissionPayload,
} from '../types/icrast';

interface FileUploadState {
  file: File | null;
  filename: string;
  mimeType: string;
  base64Data: string;
  fileSizeBytes: number;
  error?: string;
}

export default function IcrastSubmitPage() {
  // Section I — Author Information
  const [authorFullName, setAuthorFullName] = useState('');
  const [authorGender, setAuthorGender] = useState<string>(GENDER_OPTIONS[0]);
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorPhone, setAuthorPhone] = useState('');
  const [authorAffiliation, setAuthorAffiliation] = useState('');
  const [authorDepartment, setAuthorDepartment] = useState('');
  const [authorDesignation, setAuthorDesignation] = useState<string>(DESIGNATION_OPTIONS[0]);
  const [authorCountry, setAuthorCountry] = useState('India');
  const [authorState, setAuthorState] = useState('');
  const [authorCity, setAuthorCity] = useState('');

  // Section II — Co-Author Information
  const [coAuthors, setCoAuthors] = useState<CoAuthor[]>([]);

  // Section III — Abstract Information
  const [paperTitle, setPaperTitle] = useState('');
  const [abstractText, setAbstractText] = useState('');
  const [keywords, setKeywords] = useState('');
  const [researchArea, setResearchArea] = useState<string>(RESEARCH_AREAS[0]);
  const [subfield, setSubfield] = useState('');
  const [typeOfResearch, setTypeOfResearch] = useState<string>(RESEARCH_TYPE_OPTIONS[0]);

  // Section IV — Abstract File Upload
  const [editableDoc, setEditableDoc] = useState<FileUploadState>({
    file: null,
    filename: '',
    mimeType: '',
    base64Data: '',
    fileSizeBytes: 0,
  });
  const [pdfDoc, setPdfDoc] = useState<FileUploadState>({
    file: null,
    filename: '',
    mimeType: '',
    base64Data: '',
    fileSizeBytes: 0,
  });

  // Section V — Presentation Preference
  const [presentationCategory, setPresentationCategory] = useState<string>(PRESENTATION_CATEGORIES[0]);
  const [presentationMode, setPresentationMode] = useState<string>(PRESENTATION_MODES[0]);
  const [guidelineAgreement, setGuidelineAgreement] = useState(false);

  // Section VI — Research Ethics and Originality
  const [ethicsOriginality, setEthicsOriginality] = useState(false);
  const [ethicsPlagiarism, setEthicsPlagiarism] = useState(false);
  const [ethicsAuthorship, setEthicsAuthorship] = useState(false);
  const [ethicsCompliance, setEthicsCompliance] = useState(false);

  // Section VIII — Final Confirmation
  const [confirmAccurate, setConfirmAccurate] = useState(false);
  const [confirmNoGuarantee, setConfirmNoGuarantee] = useState(false);
  const [confirmSubjectToReview, setConfirmSubjectToReview] = useState(false);
  const [confirmFollowGuidelines, setConfirmFollowGuidelines] = useState(false);

  // UI state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    reference: string;
    timestamp: string;
    title: string;
    category: string;
    mode: string;
  } | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (submittedData) {
      document.title = 'Abstract Submitted Successfully · ICRAST-26';
    }
  }, [submittedData]);

  // Co-author handlers
  const addCoAuthor = () => {
    setCoAuthors((prev) => [
      ...prev,
      {
        fullName: '',
        gender: GENDER_OPTIONS[0],
        affiliation: '',
        department: '',
        email: '',
        designationStatus: DESIGNATION_OPTIONS[0],
      },
    ]);
  };

  const updateCoAuthor = (index: number, field: keyof CoAuthor, value: string) => {
    setCoAuthors((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index]!, [field]: value };
      return copy;
    });
  };

  const removeCoAuthor = (index: number) => {
    setCoAuthors((prev) => prev.filter((_, i) => i !== index));
  };

  // File upload processing
  const handleFileProcess = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<FileUploadState>>,
    allowedExtensions: string[]
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setter({
        file: null,
        filename: file.name,
        mimeType: file.type,
        base64Data: '',
        fileSizeBytes: file.size,
        error: 'File exceeds 15 MB limit.',
      });
      return;
    }

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setter({
        file: null,
        filename: file.name,
        mimeType: file.type,
        base64Data: '',
        fileSizeBytes: file.size,
        error: `Please select a valid file format (${allowedExtensions.join(', ')}).`,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setter({
        file,
        filename: file.name,
        mimeType: file.type || 'application/octet-stream',
        base64Data: reader.result as string,
        fileSizeBytes: file.size,
        error: undefined,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFormPreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    // Section IV Validation: File Upload (Mandatory)
    if (!editableDoc.file) {
      setSubmissionError('Please upload your abstract in editable Word document format (.docx or .doc) before submitting.');
      const fileInput = document.getElementById('editableDoc');
      if (fileInput) {
        fileInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Section V Validation
    if (!guidelineAgreement) {
      setSubmissionError('You must agree to comply with the ICRAST-26 presentation guidelines.');
      return;
    }

    // Section VI Validation
    if (!ethicsOriginality || !ethicsPlagiarism || !ethicsAuthorship) {
      setSubmissionError('Please confirm the Research Ethics, Originality, and Authorship declarations.');
      return;
    }

    // Section VIII Validation
    if (
      !confirmAccurate ||
      !confirmNoGuarantee ||
      !confirmSubjectToReview ||
      !confirmFollowGuidelines
    ) {
      setSubmissionError('All 4 Final Confirmation checkboxes must be acknowledged before submitting.');
      return;
    }

    // Open confirmation modal dialog
    setShowConfirmModal(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);

    const payload: IcrastAbstractSubmissionPayload = {
      formType: 'icrast_abstract',
      presentingAuthor: {
        fullName: authorFullName,
        gender: authorGender,
        email: authorEmail,
        phone: authorPhone,
        affiliation: authorAffiliation,
        department: authorDepartment,
        designationStatus: authorDesignation,
        country: authorCountry,
        state: authorState,
        city: authorCity,
      },
      coAuthors,
      abstractInfo: {
        paperTitle,
        abstractText,
        keywords,
        researchArea,
        subfield,
        typeOfResearch,
      },
      files: {
        editableDoc: editableDoc.base64Data
          ? {
              filename: editableDoc.filename,
              mimeType: editableDoc.mimeType,
              base64Data: editableDoc.base64Data,
              fileSizeBytes: editableDoc.fileSizeBytes,
            }
          : undefined,
        pdfDoc: pdfDoc.base64Data
          ? {
              filename: pdfDoc.filename,
              mimeType: pdfDoc.mimeType,
              base64Data: pdfDoc.base64Data,
              fileSizeBytes: pdfDoc.fileSizeBytes,
            }
          : undefined,
      },
      preferences: {
        presentationCategory,
        presentationMode,
        guidelineAgreement,
      },
      ethics: {
        originality: ethicsOriginality,
        plagiarism: ethicsPlagiarism,
        authorship: ethicsAuthorship,
        ethicsCompliance,
      },
      confirmation: {
        accurateInfo: confirmAccurate,
        noGuarantee: confirmNoGuarantee,
        subjectToConfirmation: confirmSubjectToReview,
        followInstructions: confirmFollowGuidelines,
      },
    };

    try {
      if (!ICRAST_SCRIPT_URL) {
        // Fallback simulation
        await new Promise((res) => setTimeout(res, 1400));
        setSubmittedData({
          reference: 'ICRAST-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
          timestamp: new Date().toLocaleString('en-IN'),
          title: paperTitle,
          category: presentationCategory,
          mode: presentationMode,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const response = await fetch(ICRAST_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.ok) {
        Analytics.trackIcrastSubmission('submitted');
        setSubmittedData({
          reference: result.reference,
          timestamp: result.timestamp,
          title: result.title || paperTitle,
          category: result.category || presentationCategory,
          mode: result.mode || presentationMode,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        Analytics.trackIcrastSubmission('failed');
        const errorMsg =
          result.details && result.details.length > 0
            ? `${result.error || 'Validation failed'}: ${result.details.join(' • ')}`
            : result.error || 'Submission could not be completed.';
        setSubmissionError(errorMsg);
      }
    } catch (err) {
      setSubmissionError('Network error while connecting to the submission service. Please check your internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IcrastLayout>
      <section className="container section icrast-submit-section" style={{ paddingTop: 'clamp(5.5rem, 9vh, 7rem)', paddingBottom: 'clamp(3.5rem, 6vh, 5rem)' }}>
        <div style={{ maxWidth: '860px', marginInline: 'auto' }}>
          {submittedData ? (
            <Reveal>
              <div className="membership-success-card">
                <div className="membership-success-icon" style={{ background: 'rgba(245, 22, 22, 0.1)', color: '#f51616' }}>
                  <CheckCircle2 size={42} />
                </div>
                <span className="membership-category-pill" style={{ background: 'rgba(245, 22, 22, 0.1)', color: '#f51616' }}>
                  ICRAST-26 · {submittedData.category} ({submittedData.mode})
                </span>
                <h2 style={{ color: '#0b1b33' }}>Abstract Submitted Successfully</h2>
                <p>
                  Thank you, <strong>{authorFullName}</strong>. Your research abstract titled <em>"{submittedData.title}"</em> has been received for peer review.
                </p>

                <div className="membership-reference-box" style={{ borderColor: 'rgba(245, 22, 22, 0.4)' }}>
                  <span className="membership-reference-label">Abstract Reference ID</span>
                  <strong className="membership-reference-id" style={{ color: '#f51616' }}>
                    {submittedData.reference}
                  </strong>
                  <span className="membership-reference-time">Recorded on: {submittedData.timestamp}</span>
                </div>

                <div className="membership-next-steps">
                  <h4>What happens next?</h4>
                  <ul>
                    <li>The Technical Committee will review your submission and communicate the acceptance decision to <strong>{authorEmail}</strong>.</li>
                    <li>Accepted presenters will receive presentation scheduling details for the hybrid sessions on <strong>21 November 2026</strong>.</li>
                    <li>Please quote Reference ID <strong>{submittedData.reference}</strong> in any future correspondence with the secretariat.</li>
                  </ul>
                </div>

                <div className="membership-success-actions">
                  <Link to="/icrast" className="icrast-btn icrast-btn--red icrast-btn--lg">
                    <span>Return to Conference Portal</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedData(null);
                      setPaperTitle('');
                      setAbstractText('');
                      setKeywords('');
                      setSubfield('');
                      setCoAuthors([]);
                      setEditableDoc({ file: null, filename: '', mimeType: '', base64Data: '', fileSizeBytes: 0 });
                      setPdfDoc({ file: null, filename: '', mimeType: '', base64Data: '', fileSizeBytes: 0 });
                      setGuidelineAgreement(false);
                      setEthicsOriginality(false);
                      setEthicsPlagiarism(false);
                      setEthicsAuthorship(false);
                      setEthicsCompliance(false);
                      setConfirmAccurate(false);
                      setConfirmNoGuarantee(false);
                      setConfirmSubjectToReview(false);
                      setConfirmFollowGuidelines(false);
                    }}
                    className="icrast-btn icrast-btn--outline-navy icrast-btn--lg"
                  >
                    <span>Submit Another Abstract</span>
                  </button>
                </div>
              </div>
            </Reveal>
          ) : (
            <form onSubmit={handleFormPreSubmit} className="membership-form-card">
                <div className="membership-form-card__header">
                  <span className="membership-category-pill" style={{ background: 'rgba(245, 22, 22, 0.1)', color: '#f51616' }}>
                    Application Form
                  </span>
                  <h2 className="membership-form-card__title" style={{ color: '#0b1b33' }}>
                    ICRAST-26 Abstract Submission Form
                  </h2>
                  <p className="membership-form-card__subtitle">
                    Theme: <em>“Biotechnology and Frontier Sciences for the Betterment of Human Life”</em>
                  </p>
                </div>

                {submissionError && (
                  <div className="membership-error-banner" role="alert">
                    <AlertCircle size={20} />
                    <div>
                      <strong>Submission Notice:</strong>
                      <p>{submissionError}</p>
                    </div>
                  </div>
                )}

                {/* Author Information */}
                <div className="membership-form-section">
                  <div className="membership-section-title">
                    <User size={18} style={{ color: '#f51616' }} />
                    <h3 style={{ color: '#0b1b33' }}>Author Information</h3>
                  </div>

                  <div className="membership-form-grid">
                    <div className="membership-field">
                      <label htmlFor="authorFullName">Full name of the presenting author *</label>
                      <input
                        type="text"
                        id="authorFullName"
                        value={authorFullName}
                        onChange={(e) => setAuthorFullName(e.target.value)}
                        required
                        placeholder="e.g. Dr. Jane Doe"
                      />
                    </div>

                    <div className="membership-field">
                      <label htmlFor="authorGender">Gender *</label>
                      <select
                        id="authorGender"
                        value={authorGender}
                        onChange={(e) => setAuthorGender(e.target.value)}
                        required
                      >
                        {GENDER_OPTIONS.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="membership-field">
                      <label htmlFor="authorEmail">Email address *</label>
                      <input
                        type="email"
                        id="authorEmail"
                        value={authorEmail}
                        onChange={(e) => setAuthorEmail(e.target.value)}
                        required
                        placeholder="presenter@domain.edu"
                      />
                    </div>

                    <div className="membership-field">
                      <label htmlFor="authorPhone">Contact number with country code *</label>
                      <input
                        type="tel"
                        id="authorPhone"
                        value={authorPhone}
                        onChange={(e) => setAuthorPhone(e.target.value)}
                        required
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div className="membership-field">
                      <label htmlFor="authorAffiliation">Institutional affiliation *</label>
                      <input
                        type="text"
                        id="authorAffiliation"
                        value={authorAffiliation}
                        onChange={(e) => setAuthorAffiliation(e.target.value)}
                        required
                        placeholder="University / Institute / Organisation"
                      />
                    </div>

                    <div className="membership-field">
                      <label htmlFor="authorDepartment">Department *</label>
                      <input
                        type="text"
                        id="authorDepartment"
                        value={authorDepartment}
                        onChange={(e) => setAuthorDepartment(e.target.value)}
                        required
                        placeholder="e.g. Dept. of Biotechnology"
                      />
                    </div>

                    <div className="membership-field">
                      <label htmlFor="authorDesignation">Designation/status dropdown *</label>
                      <select
                        id="authorDesignation"
                        value={authorDesignation}
                        onChange={(e) => setAuthorDesignation(e.target.value)}
                        required
                      >
                        {DESIGNATION_OPTIONS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="membership-field">
                      <label htmlFor="authorCountry">Country *</label>
                      <input
                        type="text"
                        id="authorCountry"
                        value={authorCountry}
                        onChange={(e) => setAuthorCountry(e.target.value)}
                        required
                        placeholder="e.g. India"
                      />
                    </div>

                    <div className="membership-field">
                      <label htmlFor="authorState">State *</label>
                      <input
                        type="text"
                        id="authorState"
                        value={authorState}
                        onChange={(e) => setAuthorState(e.target.value)}
                        required
                        placeholder="e.g. Kerala"
                      />
                    </div>

                    <div className="membership-field">
                      <label htmlFor="authorCity">City *</label>
                      <input
                        type="text"
                        id="authorCity"
                        value={authorCity}
                        onChange={(e) => setAuthorCity(e.target.value)}
                        required
                        placeholder="e.g. Kozhikode"
                      />
                    </div>
                  </div>
                </div>

                {/* Co-Author Information */}
                <div className="membership-form-section">
                  <div className="membership-section-title" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <Users size={18} style={{ color: '#f51616' }} />
                      <h3 style={{ color: '#0b1b33' }}>Co-Author Information</h3>
                    </div>
                    <button
                      type="button"
                      onClick={addCoAuthor}
                      className="icrast-btn icrast-btn--outline-navy"
                      style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      <Plus size={14} />
                      <span>Add Co-Author</span>
                    </button>
                  </div>
                  <p className="membership-section-note">
                    If this paper has multiple contributors, add each co-author below. Leave empty if you are a single author.
                  </p>

                  {coAuthors.length === 0 ? (
                    <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', textAlign: 'center', border: '1px dashed rgba(11,27,51,0.15)', fontSize: '0.85rem', color: '#64748b' }}>
                      No co-authors added yet. Click <strong>"Add Co-Author"</strong> to add contributors.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {coAuthors.map((ca, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '1.15rem',
                            borderRadius: '12px',
                            background: '#f8fafc',
                            border: '1px solid rgba(11,27,51,0.1)',
                            position: 'relative',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                            <strong style={{ fontSize: '0.88rem', color: '#0b1b33' }}>
                              Co-Author #{idx + 1}
                            </strong>
                            <button
                              type="button"
                              onClick={() => removeCoAuthor(idx)}
                              style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}
                            >
                              <Trash2 size={14} />
                              <span>Remove</span>
                            </button>
                          </div>

                          <div className="membership-form-grid">
                            <div className="membership-field">
                              <label>Full name *</label>
                              <input
                                type="text"
                                value={ca.fullName}
                                onChange={(e) => updateCoAuthor(idx, 'fullName', e.target.value)}
                                required
                                placeholder="Co-Author full name"
                              />
                            </div>

                            <div className="membership-field">
                              <label>Gender *</label>
                              <select
                                value={ca.gender}
                                onChange={(e) => updateCoAuthor(idx, 'gender', e.target.value)}
                                required
                              >
                                {GENDER_OPTIONS.map((g) => (
                                  <option key={g} value={g}>{g}</option>
                                ))}
                              </select>
                            </div>

                            <div className="membership-field">
                              <label>Institutional affiliation *</label>
                              <input
                                type="text"
                                value={ca.affiliation}
                                onChange={(e) => updateCoAuthor(idx, 'affiliation', e.target.value)}
                                required
                                placeholder="Institute / University"
                              />
                            </div>

                            <div className="membership-field">
                              <label>Department *</label>
                              <input
                                type="text"
                                value={ca.department}
                                onChange={(e) => updateCoAuthor(idx, 'department', e.target.value)}
                                required
                                placeholder="e.g. Dept. of Materials Science"
                              />
                            </div>

                            <div className="membership-field">
                              <label>Email address *</label>
                              <input
                                type="email"
                                value={ca.email}
                                onChange={(e) => updateCoAuthor(idx, 'email', e.target.value)}
                                required
                                placeholder="coauthor@domain.edu"
                              />
                            </div>

                            <div className="membership-field">
                              <label>Designation/status *</label>
                              <select
                                value={ca.designationStatus}
                                onChange={(e) => updateCoAuthor(idx, 'designationStatus', e.target.value)}
                                required
                              >
                                {DESIGNATION_OPTIONS.map((d) => (
                                  <option key={d} value={d}>{d}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Abstract Information */}
                <div className="membership-form-section">
                  <div className="membership-section-title">
                    <FileText size={18} style={{ color: '#f51616' }} />
                    <h3 style={{ color: '#0b1b33' }}>Abstract Information</h3>
                  </div>

                  <div className="membership-form-grid">
                    <div className="membership-field membership-field--full">
                      <label htmlFor="paperTitle">Title of the research paper *</label>
                      <input
                        type="text"
                        id="paperTitle"
                        value={paperTitle}
                        onChange={(e) => setPaperTitle(e.target.value)}
                        required
                        placeholder="Enter the complete title of your research paper"
                      />
                    </div>

                    <div className="membership-field membership-field--full">
                      <label htmlFor="abstractText">Abstract (250 – 300 Words) *</label>
                      <textarea
                        id="abstractText"
                        value={abstractText}
                        onChange={(e) => setAbstractText(e.target.value)}
                        required
                        rows={6}
                        placeholder="Summarise background, research objectives, methodology, key findings, and scientific impact..."
                      />
                    </div>

                    <div className="membership-field membership-field--full">
                      <label htmlFor="keywords">Keywords *</label>
                      <input
                        type="text"
                        id="keywords"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        required
                        placeholder="3 to 6 keywords separated by commas (e.g. Biotechnology, CRISPR, Soil Microbes)"
                      />
                    </div>

                    <div className="membership-field">
                      <label htmlFor="researchArea">Research area *</label>
                      <select
                        id="researchArea"
                        value={researchArea}
                        onChange={(e) => setResearchArea(e.target.value)}
                        required
                      >
                        {RESEARCH_AREAS.map((ra) => (
                          <option key={ra} value={ra}>{ra}</option>
                        ))}
                      </select>
                    </div>

                    <div className="membership-field">
                      <label htmlFor="subfield">Subfield or specialisation *</label>
                      <input
                        type="text"
                        id="subfield"
                        value={subfield}
                        onChange={(e) => setSubfield(e.target.value)}
                        required
                        placeholder="e.g. Plant Molecular Genetics / Polymer Chemistry"
                      />
                    </div>

                    <div className="membership-field membership-field--full">
                      <label htmlFor="typeOfResearch">Type of research *</label>
                      <select
                        id="typeOfResearch"
                        value={typeOfResearch}
                        onChange={(e) => setTypeOfResearch(e.target.value)}
                        required
                      >
                        {RESEARCH_TYPE_OPTIONS.map((tr) => (
                          <option key={tr} value={tr}>{tr}</option>
                        ))}
                      </select>
                      <span className="membership-doc-hint" style={{ marginTop: '0.2rem' }}>
                        This helps the review committee understand the nature of each submission.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Abstract File Upload */}
                <div className="membership-form-section">
                  <div className="membership-section-title">
                    <Upload size={18} style={{ color: '#f51616' }} />
                    <h3 style={{ color: '#0b1b33' }}>Abstract File Upload</h3>
                  </div>

                  {/* Template & Maximum size info strip */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      padding: '0.85rem 1.1rem',
                      background: '#f1f5f9',
                      borderRadius: '10px',
                      marginBottom: '1.25rem',
                      border: '1px solid rgba(11,27,51,0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', color: '#1e293b' }}>
                      <Info size={16} style={{ color: '#3355ff', flexShrink: 0 }} />
                      <span>
                        <strong>Maximum file size:</strong> 15 MB per file. Please review formatting before uploading.
                      </span>
                    </div>
                    <a
                      href={ICRAST_TEMPLATE_DOWNLOAD_URL}
                      download="ICRAST-26-Abstract-Template.pdf"
                      onClick={() => Analytics.trackDownload('ICRAST-26-Abstract-Template.pdf')}
                      className="icrast-btn icrast-btn--ghost"
                      style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      <Download size={14} />
                      <span>Download Guidelines &amp; Template</span>
                    </a>
                  </div>

                  <div className="membership-doc-upload-grid">
                    {/* Editable Document Format (DOC / DOCX) */}
                    <div className="membership-doc-card">
                      <label className="membership-doc-label" htmlFor="editableDoc">
                        Editable document format <span style={{ color: '#ef4444' }}>*</span>
                        <span className="membership-doc-hint">(Microsoft Word: .doc, .docx — Required)</span>
                      </label>
                      <div className="membership-file-box">
                        <input
                          type="file"
                          id="editableDoc"
                          required
                          accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={(e) => handleFileProcess(e, setEditableDoc, ['.doc', '.docx'])}
                          className="membership-file-input"
                        />
                        <div className="membership-file-label">
                          <Upload size={18} />
                          <span>{editableDoc.file ? 'Replace Word File' : 'Upload Word Document (.docx) *'}</span>
                        </div>
                      </div>

                      {editableDoc.file && (
                        <div className="membership-file-selected">
                          <FileCheck size={16} />
                          <span className="membership-file-name">{editableDoc.filename}</span>
                          <span className="membership-file-size">
                            ({(editableDoc.fileSizeBytes / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                      )}
                      {editableDoc.error && (
                        <span className="membership-file-error">{editableDoc.error}</span>
                      )}
                    </div>

                    {/* PDF Version */}
                    <div className="membership-doc-card">
                      <label className="membership-doc-label" htmlFor="pdfDoc">
                        PDF version
                        <span className="membership-doc-hint">(Formatted Portable Document: .pdf — Optional)</span>
                      </label>
                      <div className="membership-file-box">
                        <input
                          type="file"
                          id="pdfDoc"
                          accept=".pdf,application/pdf"
                          onChange={(e) => handleFileProcess(e, setPdfDoc, ['.pdf'])}
                          className="membership-file-input"
                        />
                        <div className="membership-file-label">
                          <Upload size={18} />
                          <span>{pdfDoc.file ? 'Replace PDF File' : 'Upload PDF Version (.pdf)'}</span>
                        </div>
                      </div>

                      {pdfDoc.file && (
                        <div className="membership-file-selected">
                          <FileCheck size={16} />
                          <span className="membership-file-name">{pdfDoc.filename}</span>
                          <span className="membership-file-size">
                            ({(pdfDoc.fileSizeBytes / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                      )}
                      {pdfDoc.error && (
                        <span className="membership-file-error">{pdfDoc.error}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Presentation Preference */}
                <div className="membership-form-section">
                  <div className="membership-section-title">
                    <Layers size={18} style={{ color: '#f51616' }} />
                    <h3 style={{ color: '#0b1b33' }}>Presentation Preference</h3>
                  </div>

                  <div className="membership-form-grid">
                    <div className="membership-field membership-field--full">
                      <label>Preferred presentation category *</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.35rem' }}>
                        {PRESENTATION_CATEGORIES.map((cat) => (
                          <label key={cat} className="membership-checkbox-item">
                            <input
                              type="radio"
                              name="presentationCategoryRadio"
                              checked={presentationCategory === cat}
                              onChange={() => setPresentationCategory(cat)}
                            />
                            <span>{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="membership-field membership-field--full">
                      <label>Preferred presentation mode *</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.35rem' }}>
                        {PRESENTATION_MODES.map((mode) => (
                          <label key={mode} className="membership-checkbox-item">
                            <input
                              type="radio"
                              name="presentationModeRadio"
                              checked={presentationMode === mode}
                              onChange={() => setPresentationMode(mode)}
                            />
                            <span>{mode}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="membership-field membership-field--full" style={{ marginTop: '0.5rem' }}>
                      <label className="membership-consent">
                        <input
                          type="checkbox"
                          checked={guidelineAgreement}
                          onChange={(e) => setGuidelineAgreement(e.target.checked)}
                          required
                        />
                        <span>
                          <strong>Agreement to follow the presentation guidelines:</strong> I agree to comply with the ICRAST-26 presentation guidelines, including the allotted presentation duration, Q&amp;A session, and instructions issued by the organising team.
                        </span>
                      </label>
                      <span className="membership-doc-hint" style={{ display: 'block', marginTop: '0.4rem', marginLeft: '1.8rem', color: '#dc2626' }}>
                        * Important: A requested presentation category should not be treated as confirmed until the committee communicates its decision.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Research Ethics and Originality */}
                <div className="membership-form-section">
                  <div className="membership-section-title">
                    <Award size={18} style={{ color: '#f51616' }} />
                    <h3 style={{ color: '#0b1b33' }}>Research Ethics and Originality</h3>
                  </div>
                  <p className="membership-section-note">
                    Since this is a scientific conference, please review and confirm the following ethical declarations.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <label className="membership-consent">
                      <input
                        type="checkbox"
                        checked={ethicsOriginality}
                        onChange={(e) => setEthicsOriginality(e.target.checked)}
                        required
                      />
                      <span>
                        I confirm that this submission represents original work or appropriately acknowledges the sources and contributions on which it is based.
                      </span>
                    </label>

                    <label className="membership-consent">
                      <input
                        type="checkbox"
                        checked={ethicsPlagiarism}
                        onChange={(e) => setEthicsPlagiarism(e.target.checked)}
                        required
                      />
                      <span>
                        I confirm that the submission does not knowingly contain plagiarised material, fabricated results, or misleading representations of research findings.
                      </span>
                    </label>

                    <label className="membership-consent">
                      <input
                        type="checkbox"
                        checked={ethicsAuthorship}
                        onChange={(e) => setEthicsAuthorship(e.target.checked)}
                        required
                      />
                      <span>
                        I confirm that the listed authors and affiliations are accurate and that the necessary consent has been obtained from all co-authors for this submission.
                      </span>
                    </label>

                    <label className="membership-consent">
                      <input
                        type="checkbox"
                        checked={ethicsCompliance}
                        onChange={(e) => setEthicsCompliance(e.target.checked)}
                      />
                      <span>
                        Where applicable, the research has been conducted in accordance with relevant ethical requirements, permissions, and institutional guidelines.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Final Confirmation */}
                <div className="membership-form-section">
                  <div className="membership-section-title">
                    <CheckCircle2 size={18} style={{ color: '#f51616' }} />
                    <h3 style={{ color: '#0b1b33' }}>Final Confirmation</h3>
                  </div>
                  <p className="membership-section-note">
                    Before the form can be submitted, require the presenting author to confirm each point:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <label className="membership-consent">
                      <input
                        type="checkbox"
                        checked={confirmAccurate}
                        onChange={(e) => setConfirmAccurate(e.target.checked)}
                        required
                      />
                      <span>
                        I confirm that the information supplied in this form is accurate to the best of my knowledge.
                      </span>
                    </label>

                    <label className="membership-consent">
                      <input
                        type="checkbox"
                        checked={confirmNoGuarantee}
                        onChange={(e) => setConfirmNoGuarantee(e.target.checked)}
                        required
                      />
                      <span>
                        I understand that submitting an abstract does not guarantee acceptance for presentation.
                      </span>
                    </label>

                    <label className="membership-consent">
                      <input
                        type="checkbox"
                        checked={confirmSubjectToReview}
                        onChange={(e) => setConfirmSubjectToReview(e.target.checked)}
                        required
                      />
                      <span>
                        I understand that the presentation category, schedule, and mode are subject to confirmation by the organising committee.
                      </span>
                    </label>

                    <label className="membership-consent">
                      <input
                        type="checkbox"
                        checked={confirmFollowGuidelines}
                        onChange={(e) => setConfirmFollowGuidelines(e.target.checked)}
                        required
                      />
                      <span>
                        I agree to follow the official ICRAST-26 presentation guidelines and instructions issued by the organisers.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Footer Submit Button */}
                <div className="membership-form-card__footer">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="icrast-btn icrast-btn--red icrast-btn--lg"
                    style={{ width: '100%', paddingBlock: '0.95rem' }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="membership-spinner" />
                        <span>Submitting Abstract to ICRAST-26...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Abstract for ICRAST-26</span>
                        <Send size={16} />
                      </>
                    )}
                  </button>
                  <p className="membership-form-note">
                    * All accepted submissions will receive official review notifications from the ICRAST-26 Organizing Secretariat.
                  </p>
                </div>
              </form>
          )}
        </div>
      </section>

      {/* Confirmation Modal Box */}
      {showConfirmModal && (
        <div
          className="news-modal-backdrop"
          onClick={() => setShowConfirmModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
        >
          <div
            className="news-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px', padding: '1.75rem', borderRadius: '16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'rgba(245, 22, 22, 0.1)',
                    color: '#f51616',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <HelpCircle size={22} />
                </div>
                <h3 id="confirm-modal-title" style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#0b1b33', fontWeight: 700 }}>
                  Confirm Abstract Submission
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.15rem', borderRadius: '12px', border: '1px solid rgba(11,27,51,0.08)', marginBottom: '1.25rem' }}>
              <div style={{ marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.76rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  Paper Title
                </span>
                <p style={{ margin: '0.2rem 0 0', fontWeight: 600, color: '#0b1b33', fontSize: '0.95rem' }}>
                  {paperTitle || 'Untitled Research'}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(11,27,51,0.06)' }}>
                <div>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>Presenting Author</span>
                  <strong style={{ fontSize: '0.86rem', color: '#0b1b33' }}>{authorFullName}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>Category &amp; Mode</span>
                  <strong style={{ fontSize: '0.86rem', color: '#0b1b33' }}>{presentationCategory} ({presentationMode})</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>Co-Authors</span>
                  <strong style={{ fontSize: '0.86rem', color: '#0b1b33' }}>{coAuthors.length > 0 ? `${coAuthors.length} co-author(s)` : 'Solo Author'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>Uploaded Documents</span>
                  <strong style={{ fontSize: '0.86rem', color: '#0b1b33' }}>
                    {editableDoc.file ? 'Word Document' : 'None'}
                    {pdfDoc.file ? ' + PDF' : ''}
                  </strong>
                </div>
              </div>
            </div>

            <p style={{ margin: '0 0 1.5rem', fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
              Are you sure you want to submit this research abstract to the <strong>ICRAST-26 Technical Committee</strong>? Once submitted, your submission will be assigned an official reference ID and queued for peer review.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="icrast-btn icrast-btn--ghost"
                style={{ padding: '0.6rem 1.15rem' }}
              >
                <span>Review &amp; Edit</span>
              </button>
              <button
                type="button"
                onClick={handleConfirmedSubmit}
                className="icrast-btn icrast-btn--red"
                style={{ padding: '0.6rem 1.35rem' }}
              >
                <span>Yes, Confirm &amp; Submit</span>
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </IcrastLayout>
  );
}
