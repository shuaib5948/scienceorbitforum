import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Reveal } from '../components/ui/Reveal';
import { MEMBERSHIP_CATEGORIES } from '../data/membership';
import {
  ArrowLeft,
  CheckCircle2,
  Send,
  Sparkles,
  Upload,
  FileCheck,
  AlertCircle,
  HelpCircle,
  Loader2,
  Calendar,
  User,
  MapPin,
  BookOpen,
  Award,
  Layers,
  FileText,
} from 'lucide-react';
import {
  CATEGORY_DETAILS,
  PARTICIPATION_INTEREST_OPTIONS,
  ALLOWED_DOCUMENT_EXTENSIONS,
  ALLOWED_DOCUMENT_MIME_TYPES,
  MAX_DOCUMENT_FILE_SIZE,
  MEMBERSHIP_SCRIPT_URL,
  type SubmissionResponse,
} from '../types/membership';

interface FileState {
  file: File | null;
  filename: string;
  mimeType: string;
  base64Data: string;
  fileSizeBytes: number;
  error?: string;
}

export default function MembershipApplyPage() {
  // Category selection
  const [selectedCategory, setSelectedCategory] = useState<'platinum' | 'gold' | 'silver'>('platinum');
  
  // Section A: Applicant Details
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [postalAddress, setPostalAddress] = useState('');
  const [cityDistrictState, setCityDistrictState] = useState('');
  const [country, setCountry] = useState('India');
  const [preferredCommunication, setPreferredCommunication] = useState<'Email' | 'Mobile / WhatsApp' | 'Both'>('Email');
  const [institution, setInstitution] = useState('');
  const [designationCourse, setDesignationCourse] = useState('');
  const [qualificationStatus, setQualificationStatus] = useState('');
  const [scientificInterests, setScientificInterests] = useState('');

  // Section B: Category & Dates
  const [requestedStartDate, setRequestedStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [memberStatus, setMemberStatus] = useState<'new' | 'renewal'>('new');

  // Section C: Interests & Participation
  const [participationInterests, setParticipationInterests] = useState<string[]>([]);
  const [otherInterestText, setOtherInterestText] = useState('');
  const [contributionStatement, setContributionStatement] = useState('');

  // Section D: Supporting Documents
  const [proofOfIdentity, setProofOfIdentity] = useState<FileState>({
    file: null,
    filename: '',
    mimeType: '',
    base64Data: '',
    fileSizeBytes: 0,
  });
  const [institutionalId, setInstitutionalId] = useState<FileState>({
    file: null,
    filename: '',
    mimeType: '',
    base64Data: '',
    fileSizeBytes: 0,
  });

  // Section E: Declaration
  const [consent, setConsent] = useState(false);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    reference: string;
    timestamp: string;
    categoryTitle: string;
    annualFee: string;
  } | null>(null);

  // Initialize category from URL query parameter if present
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const requested = params.get('category');
      if (requested && (requested === 'platinum' || requested === 'gold' || requested === 'silver')) {
        setSelectedCategory(requested);
      }
    }
  }, []);

  const currentCategoryInfo = CATEGORY_DETAILS[selectedCategory];

  const handleCategorySelect = (catKey: 'platinum' | 'gold' | 'silver') => {
    setSelectedCategory(catKey);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('category', catKey);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleInterestToggle = (interest: string) => {
    setParticipationInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  // Convert File to Base64
  const processFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<FileState>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB max)
    if (file.size > MAX_DOCUMENT_FILE_SIZE) {
      setter({
        file: null,
        filename: file.name,
        mimeType: file.type,
        base64Data: '',
        fileSizeBytes: file.size,
        error: `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 5 MB maximum limit.`,
      });
      return;
    }

    // Validate MIME type & extension
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidMime = ALLOWED_DOCUMENT_MIME_TYPES.includes(file.type);
    const isValidExt = ALLOWED_DOCUMENT_EXTENSIONS.includes(ext);

    if (!isValidMime && !isValidExt) {
      setter({
        file: null,
        filename: file.name,
        mimeType: file.type,
        base64Data: '',
        fileSizeBytes: file.size,
        error: 'Invalid file type. Please upload a PDF, JPG, or PNG document.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setter({
        file: file,
        filename: file.name,
        mimeType: file.type || 'application/octet-stream',
        base64Data: reader.result as string,
        fileSizeBytes: file.size,
        error: undefined,
      });
    };
    reader.onerror = () => {
      setter({
        file: null,
        filename: file.name,
        mimeType: file.type,
        base64Data: '',
        fileSizeBytes: file.size,
        error: 'Failed to read the file. Please try again.',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    // Validation checks
    if (!proofOfIdentity.base64Data || proofOfIdentity.error) {
      setSubmissionError('Please select a valid Proof of Identity document (under 5 MB).');
      return;
    }
    if (!institutionalId.base64Data || institutionalId.error) {
      setSubmissionError('Please select a valid Student / Institutional ID document (under 5 MB).');
      return;
    }
    if (participationInterests.length === 0) {
      setSubmissionError('Please select at least one area of interest and participation.');
      return;
    }
    if (!consent) {
      setSubmissionError('You must review and agree to the Declaration and Consent.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      fullName,
      dob,
      email,
      phone,
      postalAddress,
      cityDistrictState,
      country,
      preferredCommunication,
      institution,
      designationCourse,
      qualificationStatus,
      scientificInterests,
      category: selectedCategory,
      requestedStartDate,
      memberStatus,
      participationInterests,
      otherInterestText: participationInterests.includes('Other') ? otherInterestText : '',
      contributionStatement,
      proofOfIdentity: {
        filename: proofOfIdentity.filename,
        mimeType: proofOfIdentity.mimeType,
        base64Data: proofOfIdentity.base64Data,
        fileSizeBytes: proofOfIdentity.fileSizeBytes,
      },
      institutionalId: {
        filename: institutionalId.filename,
        mimeType: institutionalId.mimeType,
        base64Data: institutionalId.base64Data,
        fileSizeBytes: institutionalId.fileSizeBytes,
      },
      consent,
    };

    try {
      // If endpoint is not yet configured, provide a clear simulated development response
      if (!MEMBERSHIP_SCRIPT_URL) {
        // Fallback simulation for local development / testing without live Google script
        await new Promise((resolve) => setTimeout(resolve, 1400));
        const simRef = 'SOF-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        setSubmittedData({
          reference: simRef,
          timestamp: new Date().toLocaleString('en-IN'),
          categoryTitle: currentCategoryInfo.title,
          annualFee: currentCategoryInfo.costText,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Live Google Apps Script Web App Submission
      const response = await fetch(MEMBERSHIP_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // Plain text avoids CORS preflight blockage in Apps Script
        },
        body: JSON.stringify(payload),
      });

      const result: SubmissionResponse = await response.json();

      if (result.ok) {
        setSubmittedData({
          reference: result.reference,
          timestamp: result.timestamp,
          categoryTitle: result.categoryTitle,
          annualFee: result.annualFee,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const errorMsg =
          result.details && result.details.length > 0
            ? `${result.error || 'Validation failed'}: ${result.details.join(' • ')}`
            : result.error || 'Submission rejected by the server. Please check your data.';
        setSubmissionError(errorMsg);
      }
    } catch (err: any) {
      setSubmissionError(
        'Unable to connect to the Science Orbit submission service. Please check your internet connection or try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="container section membership-apply-section">
        <div className="membership-apply-shell">
          <div className="membership-apply-topbar">
            <Link to="/join" className="membership-back-link">
              <ArrowLeft size={16} />
              <span>Back to Membership Categories</span>
            </Link>
          </div>

          {submittedData ? (
            <Reveal>
              <div className="membership-success-card">
                <div className="membership-success-icon">
                  <CheckCircle2 size={42} />
                </div>
                <span className="membership-category-pill">
                  {submittedData.categoryTitle} · {submittedData.annualFee}
                </span>
                <h2>Application Submitted Successfully</h2>
                <p>
                  Thank you, <strong>{fullName}</strong>. Your individual membership application for{' '}
                  <strong>Science Orbit Forum</strong> has been recorded.
                </p>

                <div className="membership-reference-box">
                  <span className="membership-reference-label">Your Application Reference</span>
                  <strong className="membership-reference-id">{submittedData.reference}</strong>
                  <span className="membership-reference-time">Recorded on: {submittedData.timestamp}</span>
                </div>

                <div className="membership-next-steps">
                  <h4>What happens next?</h4>
                  <ul>
                    <li>Our Membership Committee will review your academic qualifications and verification documents.</li>
                    <li>Official confirmation and membership payment instructions will be sent to <strong>{email}</strong>.</li>
                    <li>Please quote your reference ID <strong>{submittedData.reference}</strong> in any correspondence.</li>
                  </ul>
                </div>

                <div className="membership-success-actions">
                  <Link to="/join" className="subdomain-btn subdomain-btn--primary">
                    <span>Return to Membership Hub</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedData(null);
                      setProofOfIdentity({ file: null, filename: '', mimeType: '', base64Data: '', fileSizeBytes: 0 });
                      setInstitutionalId({ file: null, filename: '', mimeType: '', base64Data: '', fileSizeBytes: 0 });
                      setConsent(false);
                      setParticipationInterests([]);
                    }}
                    className="subdomain-btn subdomain-btn--ghost"
                  >
                    <span>Submit Another Application</span>
                  </button>
                </div>
              </div>
            </Reveal>
          ) : (
            <Reveal>
              {/* Main Application Form */}
              <form onSubmit={handleSubmit} className="membership-form-card" noValidate={false}>
                <div className="membership-form-card__header">
                  <span className="membership-category-pill">
                    {currentCategoryInfo.title} ({currentCategoryInfo.costText})
                  </span>
                  <h2 className="membership-form-card__title">Individual Membership Application</h2>
                  <p className="membership-form-card__subtitle">
                    <strong>Category Scope:</strong> {currentCategoryInfo.description}
                  </p>
                </div>

                {submissionError && (
                  <div className="membership-error-banner" role="alert">
                    <AlertCircle size={20} />
                    <div>
                      <strong>Application Error:</strong>
                      <p>{submissionError}</p>
                    </div>
                  </div>
                )}

                {/* Section A: Applicant Details */}
                <div className="membership-form-section">
                  <div className="membership-section-title">
                    <User size={18} />
                    <h3>A. Applicant Details</h3>
                  </div>

                  <div className="membership-form-grid">
                    <div className="membership-field">
                      <label htmlFor="fullName">Full Name *</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder="e.g., Dr. Jane Doe / John Smith"
                      />
                    </div>

                    <div className="membership-field">
                      <label htmlFor="dob">Date of Birth *</label>
                      <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        required
                      />
                    </div>

                    <div className="membership-field">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="yourname@domain.edu / yourname@domain.com"
                      />
                    </div>

                    <div className="membership-field">
                      <label htmlFor="phone">Mobile / WhatsApp Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div className="membership-field membership-field--full">
                      <label htmlFor="postalAddress">Postal Address *</label>
                      <textarea
                        id="postalAddress"
                        name="postalAddress"
                        value={postalAddress}
                        onChange={(e) => setPostalAddress(e.target.value)}
                        required
                        rows={2}
                        placeholder="Street address, residential / office building, pincode"
                      />
                    </div>

                    <div className="membership-field">
                      <label htmlFor="cityDistrictState">City / District / State *</label>
                      <input
                        type="text"
                        id="cityDistrictState"
                        name="cityDistrictState"
                        value={cityDistrictState}
                        onChange={(e) => setCityDistrictState(e.target.value)}
                        required
                        placeholder="e.g., Kozhikode, Kerala"
                      />
                    </div>

                    <div className="membership-field">
                      <label htmlFor="country">Country *</label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        placeholder="e.g., India"
                      />
                    </div>

                    <div className="membership-field">
                      <label htmlFor="preferredCommunication">Preferred Communication Method *</label>
                      <select
                        id="preferredCommunication"
                        name="preferredCommunication"
                        value={preferredCommunication}
                        onChange={(e) => setPreferredCommunication(e.target.value as any)}
                        required
                      >
                        <option value="Email">Email</option>
                        <option value="Mobile / WhatsApp">Mobile / WhatsApp</option>
                        <option value="Both">Both Email and Mobile</option>
                      </select>
                    </div>

                    <div className="membership-field">
                      <label htmlFor="institution">Current Institution / Organisation</label>
                      <input
                        type="text"
                        id="institution"
                        name="institution"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="University, College, Institute or Company"
                      />
                    </div>

                    <div className="membership-field">
                      <label htmlFor="designationCourse">Designation / Course / Occupation</label>
                      <input
                        type="text"
                        id="designationCourse"
                        name="designationCourse"
                        value={designationCourse}
                        onChange={(e) => setDesignationCourse(e.target.value)}
                        placeholder="e.g., Professor / PhD Scholar / B.Sc Physics Student"
                      />
                    </div>

                    <div className="membership-field">
                      <label htmlFor="qualificationStatus">Academic Qualification / Professional Status *</label>
                      <input
                        type="text"
                        id="qualificationStatus"
                        name="qualificationStatus"
                        value={qualificationStatus}
                        onChange={(e) => setQualificationStatus(e.target.value)}
                        required
                        placeholder="e.g., Ph.D. in Chemistry / M.Sc / High School"
                      />
                    </div>

                    <div className="membership-field membership-field--full">
                      <label htmlFor="scientificInterests">Area(s) of Scientific Interest *</label>
                      <input
                        type="text"
                        id="scientificInterests"
                        name="scientificInterests"
                        value={scientificInterests}
                        onChange={(e) => setScientificInterests(e.target.value)}
                        required
                        placeholder="e.g., Astrophysics, Quantum Computing, Material Sciences, Molecular Biology"
                      />
                    </div>
                  </div>
                </div>

                {/* Section B: Membership Category */}
                <div className="membership-form-section">
                  <div className="membership-section-title">
                    <Award size={18} />
                    <h3>B. Membership Category &amp; Timeline</h3>
                  </div>

                  <div className="membership-tier-cards">
                    {(['platinum', 'gold', 'silver'] as const).map((tierKey) => {
                      const item = CATEGORY_DETAILS[tierKey];
                      const isSelected = selectedCategory === tierKey;
                      return (
                        <div
                          key={tierKey}
                          onClick={() => handleCategorySelect(tierKey)}
                          className={`membership-tier-card ${isSelected ? 'is-selected' : ''}`}
                          role="radio"
                          aria-checked={isSelected}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                              handleCategorySelect(tierKey);
                            }
                          }}
                        >
                          <div className="membership-tier-card__header">
                            <input
                              type="radio"
                              name="membershipCategoryRadio"
                              checked={isSelected}
                              onChange={() => handleCategorySelect(tierKey)}
                            />
                            <strong>{item.title}</strong>
                          </div>
                          <span className="membership-tier-card__cost">{item.costText}</span>
                          <p className="membership-tier-card__desc">{item.description}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="membership-form-grid" style={{ marginTop: '1.25rem' }}>
                    <div className="membership-field">
                      <label htmlFor="requestedStartDate">Requested Membership Start Date *</label>
                      <input
                        type="date"
                        id="requestedStartDate"
                        name="requestedStartDate"
                        value={requestedStartDate}
                        onChange={(e) => setRequestedStartDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="membership-field">
                      <label htmlFor="memberStatus">Member Status *</label>
                      <select
                        id="memberStatus"
                        name="memberStatus"
                        value={memberStatus}
                        onChange={(e) => setMemberStatus(e.target.value as any)}
                        required
                      >
                        <option value="new">New Membership Application</option>
                        <option value="renewal">Renewal / Existing Member</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section C: Interests and Participation */}
                <div className="membership-form-section">
                  <div className="membership-section-title">
                    <Layers size={18} />
                    <h3>C. Interests and Participation</h3>
                  </div>

                  <label className="membership-group-label">
                    Select the activities and initiatives you wish to engage in: *
                  </label>

                  <div className="membership-checkbox-grid">
                    {PARTICIPATION_INTEREST_OPTIONS.map((interest) => {
                      const isChecked = participationInterests.includes(interest);
                      return (
                        <label key={interest} className="membership-checkbox-item">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleInterestToggle(interest)}
                          />
                          <span>{interest}</span>
                        </label>
                      );
                    })}
                  </div>

                  {participationInterests.includes('Other') && (
                    <div className="membership-field membership-field--full" style={{ marginTop: '0.85rem' }}>
                      <label htmlFor="otherInterestText">Please specify your other interest:</label>
                      <input
                        type="text"
                        id="otherInterestText"
                        value={otherInterestText}
                        onChange={(e) => setOtherInterestText(e.target.value)}
                        placeholder="Describe your specific area of involvement"
                      />
                    </div>
                  )}

                  <div className="membership-field membership-field--full" style={{ marginTop: '1.25rem' }}>
                    <label htmlFor="contributionStatement">
                      Statement of Interest &amp; Contribution *
                    </label>
                    <textarea
                      id="contributionStatement"
                      name="contributionStatement"
                      value={contributionStatement}
                      onChange={(e) => setContributionStatement(e.target.value)}
                      required
                      rows={3}
                      placeholder="Describe how you would like to contribute to the Science Orbit community, programmes, or scientific initiatives..."
                    />
                  </div>
                </div>

                {/* Section D: Supporting Documents */}
                <div className="membership-form-section">
                  <div className="membership-section-title">
                    <FileText size={18} />
                    <h3>D. Supporting Documents</h3>
                  </div>
                  <p className="membership-section-note">
                    Accepted formats: PDF, JPG, JPEG, PNG. Maximum size: 5 MB per file. Uploaded documents are stored confidentially in our secure Google Drive vault.
                  </p>

                  <div className="membership-doc-upload-grid">
                    {/* Document 1: Proof of Identity */}
                    <div className="membership-doc-card">
                      <label className="membership-doc-label">
                        1. Proof of Identity *
                        <span className="membership-doc-hint">(Passport, National ID, Aadhaar, Driving Licence)</span>
                      </label>
                      <div className="membership-file-box">
                        <input
                          type="file"
                          id="proofOfIdentity"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => processFileUpload(e, setProofOfIdentity)}
                          className="membership-file-input"
                        />
                        <div className="membership-file-label">
                          <Upload size={20} />
                          <span>{proofOfIdentity.file ? 'Change file' : 'Choose Document'}</span>
                        </div>
                      </div>

                      {proofOfIdentity.file && (
                        <div className="membership-file-selected">
                          <FileCheck size={16} />
                          <span className="membership-file-name">{proofOfIdentity.filename}</span>
                          <span className="membership-file-size">
                            ({(proofOfIdentity.fileSizeBytes / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                      )}

                      {proofOfIdentity.error && (
                        <span className="membership-file-error">{proofOfIdentity.error}</span>
                      )}
                    </div>

                    {/* Document 2: Student / Institutional ID */}
                    <div className="membership-doc-card">
                      <label className="membership-doc-label">
                        2. Student / Institutional ID *
                        <span className="membership-doc-hint">(College ID, Employee Card, Department letter)</span>
                      </label>
                      <div className="membership-file-box">
                        <input
                          type="file"
                          id="institutionalId"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => processFileUpload(e, setInstitutionalId)}
                          className="membership-file-input"
                        />
                        <div className="membership-file-label">
                          <Upload size={20} />
                          <span>{institutionalId.file ? 'Change file' : 'Choose Document'}</span>
                        </div>
                      </div>

                      {institutionalId.file && (
                        <div className="membership-file-selected">
                          <FileCheck size={16} />
                          <span className="membership-file-name">{institutionalId.filename}</span>
                          <span className="membership-file-size">
                            ({(institutionalId.fileSizeBytes / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                      )}

                      {institutionalId.error && (
                        <span className="membership-file-error">{institutionalId.error}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section E: Declaration and Consent */}
                <div className="membership-form-section">
                  <div className="membership-section-title">
                    <CheckCircle2 size={18} />
                    <h3>E. Declaration and Consent</h3>
                  </div>

                  <label className="membership-consent">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      required
                    />
                    <span>
                      “I declare that the information provided in this application is accurate and complete to the best of my knowledge. I agree to abide by the applicable Membership Regulations, Terms and Conditions, code of conduct, and other policies of Science Orbit Forum (SOF), as amended from time to time. I understand that submission of this form does not automatically guarantee admission and that membership benefits are subject to the selected category, applicable rules, and availability. I consent to SOF using my application information for membership administration and related official communications in accordance with applicable law and its privacy practices.”
                    </span>
                  </label>
                </div>

                <div className="membership-form-card__footer">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`membership-submit-btn ${isSubmitting ? 'is-loading' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="membership-spinner" />
                        <span>Submitting Application to Science Orbit...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          Submit {currentCategoryInfo.title} Application ({currentCategoryInfo.costText})
                        </span>
                        <Send size={16} />
                      </>
                    )}
                  </button>
                  <p className="membership-form-note">
                    * Submission records will be verified by the SOF Membership Committee. Fee payment will be requested upon application verification.
                  </p>
                </div>
              </form>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
