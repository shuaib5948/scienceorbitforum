import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Reveal } from '../components/ui/Reveal';
import { IcrastLayout } from '../components/icrast/IcrastLayout';
import { trackPageView, trackEvent } from '../lib/analytics';
import {
  CheckCircle2,
  Send,
  AlertCircle,
  Loader2,
  Upload,
  FileCheck,
  FileText,
  User,
  ExternalLink,
  Search,
  RotateCcw,
} from 'lucide-react';
import {
  ICRAST_FULL_PAPER_SCRIPT_URL,
  type CandidateVerificationResult,
} from '../types/icrast';

interface FileUploadState {
  file: File | null;
  filename: string;
  mimeType: string;
  base64Data: string;
  fileSizeBytes: number;
  error?: string;
}

export default function IcrastFullPaperPage() {
  // Verification states
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [candidate, setCandidate] = useState<CandidateVerificationResult | null>(null);
  const [verifyError, setVerifyError] = useState('');

  // Upload states
  const [pdfDoc, setPdfDoc] = useState<FileUploadState>({
    file: null,
    filename: '',
    mimeType: '',
    base64Data: '',
    fileSizeBytes: 0,
  });
  const [confirmFinal, setConfirmFinal] = useState(false);
  const [confirmCoAuthors, setConfirmCoAuthors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [uploadTimestamp, setUploadTimestamp] = useState('');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackPageView('/icrast/full-paper', 'ICRAST-26 Full Paper Submission');
  }, []);

  useEffect(() => {
    if (uploadSuccess) {
      document.title = 'Full Paper Submitted · ICRAST-26';
    } else if (candidate?.paperTitle) {
      document.title = `${candidate.paperTitle} · Full Paper · ICRAST-26`;
    }
  }, [uploadSuccess, candidate]);

  // Stage 1: Verify Candidate
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError('');

    if (!email.trim()) {
      setVerifyError('Please enter your registered author email address.');
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch(ICRAST_FULL_PAPER_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'verify',
          email: email.trim(),
        }),
      });

      const result: CandidateVerificationResult = await response.json();

      if (result.ok) {
        setCandidate(result);
        if (result.hasUploaded && result.existingPdfLink) {
          setUploadedUrl(result.existingPdfLink);
          setUploadTimestamp(result.uploadTime || '');
        }
        trackEvent('icrast_full_paper_portal', 'verification', 'success');
      } else {
        setVerifyError(
          result.message ||
            'No accepted paper found with this email. Please verify your registered email or contact the secretariat.'
        );
        trackEvent('icrast_full_paper_portal', 'verification', 'failed');
      }
    } catch (err) {
      console.error('Verification failed:', err);
      setVerifyError(
        'Unable to connect to verification service. Please check your connection and try again.'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // Stage 2: File upload processing
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setPdfDoc({
        file: null,
        filename: file.name,
        mimeType: file.type,
        base64Data: '',
        fileSizeBytes: file.size,
        error: 'File size exceeds 20 MB limit.',
      });
      return;
    }

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (ext !== '.pdf') {
      setPdfDoc({
        file: null,
        filename: file.name,
        mimeType: file.type,
        base64Data: '',
        fileSizeBytes: file.size,
        error: 'Only PDF format (.pdf) is accepted.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      const base64Data = resultStr.includes(',')
        ? resultStr.split(',')[1] || ''
        : resultStr;

      setPdfDoc({
        file,
        filename: file.name,
        mimeType: file.type || 'application/pdf',
        base64Data,
        fileSizeBytes: file.size,
      });
    };
    reader.onerror = () => {
      setPdfDoc({
        file: null,
        filename: file.name,
        mimeType: file.type,
        base64Data: '',
        fileSizeBytes: file.size,
        error: 'Failed to read file. Please select again.',
      });
    };
    reader.readAsDataURL(file);
  };

  // Stage 3: Submit Full Paper
  const handleSubmitFullPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');

    if (!pdfDoc.file || !pdfDoc.base64Data) {
      setUploadError('Please select your Full Paper PDF file.');
      return;
    }

    if (!confirmFinal || !confirmCoAuthors) {
      setUploadError('Please confirm the author declarations below.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(ICRAST_FULL_PAPER_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'upload_full_paper',
          email: email.trim(),
          referenceId: candidate?.referenceId || '',
          file: {
            filename: pdfDoc.filename,
            base64Data: pdfDoc.base64Data,
            mimeType: pdfDoc.mimeType,
            fileSizeBytes: pdfDoc.fileSizeBytes,
          },
        }),
      });

      const result = await response.json();

      if (result.ok) {
        setUploadSuccess(true);
        setUploadedUrl(result.fileUrl || '');
        setUploadTimestamp(result.timestamp || new Date().toISOString());
        trackEvent('icrast_full_paper_submission', 'conversion', 'submitted');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setUploadError(result.message || 'Submission could not be completed. Please try again.');
      }
    } catch (err) {
      console.error('Full paper upload failed:', err);
      setUploadError(
        'A network error occurred while uploading. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetVerification = () => {
    setCandidate(null);
    setEmail('');
    setVerifyError('');
    setUploadSuccess(false);
    setPdfDoc({ file: null, filename: '', mimeType: '', base64Data: '', fileSizeBytes: 0 });
    setConfirmFinal(false);
    setConfirmCoAuthors(false);
    setUploadError('');
  };

  return (
    <IcrastLayout>
      <section
        className="container section icrast-submit-section"
        style={{
          paddingTop: 'clamp(5.5rem, 9vh, 7rem)',
          paddingBottom: 'clamp(3.5rem, 6vh, 5rem)',
        }}
      >
        <div style={{ maxWidth: '820px', marginInline: 'auto' }}>
          {/* ========================================================= */}
          {/* STATE 3: SUCCESS SCREEN                                   */}
          {/* ========================================================= */}
          {uploadSuccess ? (
            <Reveal>
              <div className="membership-success-card">
                <div
                  className="membership-success-icon"
                  style={{ background: 'rgba(51, 85, 255, 0.1)', color: '#3355ff' }}
                >
                  <CheckCircle2 size={42} />
                </div>
                <span
                  className="membership-category-pill"
                  style={{ background: 'rgba(51, 85, 255, 0.1)', color: '#3355ff' }}
                >
                  Submitted · {candidate?.referenceId}
                </span>
                <h2 style={{ color: '#0b1b33', marginTop: '0.85rem', fontSize: '1.45rem', lineHeight: 1.35 }}>
                  {candidate?.paperTitle}
                </h2>
                <p style={{ color: '#475569', fontSize: '0.92rem', marginTop: '0.4rem' }}>
                  Your paper has been successfully submitted and cataloged for ICRAST-26.
                </p>

                <div
                  className="membership-reference-box"
                  style={{ borderColor: 'rgba(51, 85, 255, 0.35)', marginTop: '1.25rem' }}
                >
                  <span className="membership-reference-label">Presenting Author</span>
                  <strong className="membership-reference-id" style={{ color: '#3355ff' }}>
                    {candidate?.authorName}
                  </strong>
                  <span className="membership-reference-time">
                    Recorded on: {uploadTimestamp ? new Date(uploadTimestamp).toLocaleString() : new Date().toLocaleString()}
                  </span>
                </div>

                {uploadedUrl && (
                  <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                    <a
                      href={uploadedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icrast-btn icrast-btn--outline-navy"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}
                    >
                      <FileCheck size={16} />
                      <span>View File in Google Drive</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}

                <div className="membership-success-actions" style={{ marginTop: '2rem' }}>
                  <Link to="/icrast" className="icrast-btn icrast-btn--red icrast-btn--lg">
                    <span>Return to Conference Home</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleResetVerification}
                    className="icrast-btn icrast-btn--outline-navy icrast-btn--lg"
                  >
                    <span>Verify Another Paper</span>
                  </button>
                </div>
              </div>
            </Reveal>
          ) : candidate ? (
            /* ========================================================= */
            /* STATE 2: VERIFIED AUTHOR VIEW — PAPER TITLE AS MAIN TITLE */
            /* ========================================================= */
            <Reveal>
              <div className="membership-form-card">
                {/* Header with Paper Title as Primary Focus */}
                <div className="membership-form-card__header">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.65rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {candidate.referenceId && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.22rem 0.65rem',
                            borderRadius: '999px',
                            background: 'rgba(11, 27, 51, 0.06)',
                            color: '#0b1b33',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            fontFamily: 'monospace',
                          }}
                        >
                          {candidate.referenceId}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleResetVerification}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.2rem 0.45rem',
                      }}
                      title="Switch to another paper"
                    >
                      <RotateCcw size={13} />
                      <span>Switch</span>
                    </button>
                  </div>

                  {/* PROPER HERO PAPER TITLE */}
                  <h1
                    style={{
                      color: '#0b1b33',
                      fontSize: 'clamp(1.25rem, 2.5vw, 1.65rem)',
                      lineHeight: 1.35,
                      fontWeight: 800,
                      margin: '0 0 0.85rem',
                    }}
                  >
                    {candidate.paperTitle}
                  </h1>

                  {/* Metadata Row: Presenting Author, Category, Presentation Mode */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.85rem',
                      fontSize: '0.86rem',
                      color: '#475569',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontWeight: 600,
                        color: '#0b1b33',
                      }}
                    >
                      <User size={15} style={{ color: '#3355ff' }} />
                      {candidate.authorName}
                    </span>
                    {candidate.category && (
                      <>
                        <span style={{ color: '#cbd5e1' }}>•</span>
                        <span style={{ fontWeight: 500, color: '#334155' }}>{candidate.category}</span>
                      </>
                    )}
                    {candidate.mode && (
                      <>
                        <span style={{ color: '#cbd5e1' }}>•</span>
                        <span style={{ color: '#475569' }}>{candidate.mode}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Existing File Notice if Previously Uploaded */}
                {candidate.hasUploaded && uploadedUrl && (
                  <div
                    style={{
                      background: 'rgba(22, 163, 74, 0.08)',
                      border: '1px solid rgba(22, 163, 74, 0.25)',
                      borderRadius: '12px',
                      padding: '0.95rem 1.25rem',
                      marginBottom: '1.75rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.65rem',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: '0.86rem',
                          color: '#16a34a',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                        }}
                      >
                        <CheckCircle2 size={16} />
                        Full Paper on File
                      </span>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#475569' }}>
                        Recorded on {uploadTimestamp ? new Date(uploadTimestamp).toLocaleDateString() : 'file'}. You can replace it with a new file below.
                      </p>
                    </div>
                    <a
                      href={uploadedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icrast-btn icrast-btn--outline-navy"
                      style={{
                        padding: '0.4rem 0.9rem',
                        fontSize: '0.8rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <ExternalLink size={13} />
                      <span>View File</span>
                    </a>
                  </div>
                )}

                {/* Error Banner */}
                {uploadError && (
                  <div className="membership-error-banner" role="alert" style={{ marginBottom: '1.25rem' }}>
                    <AlertCircle size={18} />
                    <div>
                      <p>{uploadError}</p>
                    </div>
                  </div>
                )}

                {/* File Upload Form */}
                <form onSubmit={handleSubmitFullPaper}>
                  <div className="membership-form-section">
                    <div className="membership-section-title">
                      <FileText size={18} style={{ color: '#f51616' }} />
                      <h3 style={{ color: '#0b1b33' }}>Upload Paper (PDF)</h3>
                    </div>

                    <div className="membership-doc-card">
                      <label className="membership-doc-label" htmlFor="fullPaperPdf">
                        Full Paper PDF *
                        <span className="membership-doc-hint">(PDF only — Max 2000 words · Max 20 MB)</span>
                      </label>
                      <div className="membership-file-box">
                        <input
                          type="file"
                          id="fullPaperPdf"
                          accept=".pdf,application/pdf"
                          onChange={handleFileChange}
                          required={!candidate.hasUploaded}
                          className="membership-file-input"
                        />
                        <div className="membership-file-label">
                          <Upload size={18} />
                          <span>{pdfDoc.file ? 'Replace PDF File' : 'Select Full Paper PDF (.pdf)'}</span>
                        </div>
                      </div>

                      {pdfDoc.file && (
                        <div className="membership-file-selected" style={{ marginTop: '0.75rem' }}>
                          <FileCheck size={16} />
                          <span className="membership-file-name">{pdfDoc.filename}</span>
                          <span className="membership-file-size">
                            ({(pdfDoc.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB)
                          </span>
                        </div>
                      )}

                      {pdfDoc.error && (
                        <span
                          className="membership-file-error"
                          style={{ display: 'block', marginTop: '0.4rem', color: '#dc2626' }}
                        >
                          {pdfDoc.error}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Confirmation Declarations */}
                  <div className="membership-form-section">
                    <div className="membership-section-title">
                      <CheckCircle2 size={18} style={{ color: '#f51616' }} />
                      <h3 style={{ color: '#0b1b33' }}>Confirmation</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <label className="membership-consent">
                        <input
                          type="checkbox"
                          checked={confirmFinal}
                          onChange={(e) => setConfirmFinal(e.target.checked)}
                          required
                        />
                        <span>
                          I confirm that this is our final paper submission (max 2,000 words).
                        </span>
                      </label>

                      <label className="membership-consent">
                        <input
                          type="checkbox"
                          checked={confirmCoAuthors}
                          onChange={(e) => setConfirmCoAuthors(e.target.checked)}
                          required
                        />
                        <span>
                          All listed co-authors have approved this submission.
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="membership-form-card__footer">
                    <button
                      type="submit"
                      disabled={isSubmitting || !pdfDoc.file}
                      className="icrast-btn icrast-btn--red icrast-btn--lg"
                      style={{ width: '100%', paddingBlock: '0.95rem' }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="membership-spinner" />
                          <span>Uploading Paper...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Paper</span>
                          <Send size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </Reveal>
          ) : (
            /* ========================================================= */
            /* STATE 1: EMAIL VERIFICATION                               */
            /* ========================================================= */
            <Reveal>
              <div className="membership-form-card">
                <div className="membership-form-card__header">
                  <span
                    className="membership-category-pill"
                    style={{ background: 'rgba(51, 85, 255, 0.1)', color: '#3355ff' }}
                  >
                    Accepted Candidates
                  </span>
                  <h2 className="membership-form-card__title" style={{ color: '#0b1b33' }}>
                    Full Paper Submission Portal
                  </h2>
                  <p className="membership-form-card__subtitle">
                    ICRAST-26
                  </p>
                </div>

                {/* Error Banner */}
                {verifyError && (
                  <div className="membership-error-banner" role="alert" style={{ marginBottom: '1.25rem' }}>
                    <AlertCircle size={18} />
                    <div>
                      <p>{verifyError}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleVerify}>
                  <div className="membership-form-section">
                    <div className="membership-section-title">
                      <User size={18} style={{ color: '#f51616' }} />
                      <h3 style={{ color: '#0b1b33' }}>Author Verification</h3>
                    </div>

                    <div className="membership-form-grid">
                      <div className="membership-field membership-field--full">
                        <label htmlFor="authEmail">Registered Author Email *</label>
                        <input
                          type="email"
                          id="authEmail"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="name@example.com"
                          autoFocus
                        />
                      </div>
                    </div>
                  </div>

                  <div className="membership-form-card__footer">
                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="icrast-btn icrast-btn--red icrast-btn--lg"
                      style={{ width: '100%', paddingBlock: '0.95rem' }}
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 size={18} className="membership-spinner" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify &amp; Continue</span>
                          <Search size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </IcrastLayout>
  );
}
