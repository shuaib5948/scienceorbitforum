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
  User,
  Building,
  Radio,
} from 'lucide-react';
import {
  ATTENDEE_DESIGNATION_OPTIONS,
  PARTICIPATION_MODES,
  PARTICIPATION_AREAS_OF_INTEREST,
  ICRAST_REGISTER_SCRIPT_URL,
  type IcrastAttendeeRegistrationPayload,
} from '../types/icrast';

export default function IcrastRegisterPage() {
  // 1. Personal Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('India');

  // 2. Academic / Professional Details
  const [institution, setInstitution] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState<string>(ATTENDEE_DESIGNATION_OPTIONS[0]);

  // 3. Conference Participation
  const [participationMode, setParticipationMode] = useState<string>(PARTICIPATION_MODES[0]);
  const [areaOfInterest, setAreaOfInterest] = useState<string>(PARTICIPATION_AREAS_OF_INTEREST[0]);

  // 4. Confirmation
  const [confirmAccurate, setConfirmAccurate] = useState(false);
  const [agreeUpdates, setAgreeUpdates] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackPageView('/icrast/register', 'ICRAST-26 Attendee Registration');
  }, []);

  useEffect(() => {
    if (submitSuccess) {
      document.title = 'Registration Successful · ICRAST-26';
    }
  }, [submitSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !country.trim() ||
      !institution.trim() ||
      !department.trim()
    ) {
      setErrorMessage('Please fill in all mandatory fields marked with an asterisk (*).');
      return;
    }

    if (!confirmAccurate || !agreeUpdates) {
      setErrorMessage('Please confirm all required declarations before submitting.');
      return;
    }

    const payload: IcrastAttendeeRegistrationPayload = {
      formType: 'icrast_attendee_registration',
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      country: country.trim(),
      institution: institution.trim(),
      department: department.trim(),
      designation,
      participationMode,
      areaOfInterest,
      accurateConfirmed: confirmAccurate,
      updatesAgreed: agreeUpdates,
    };

    setIsSubmitting(true);

    try {
      if (ICRAST_REGISTER_SCRIPT_URL) {
        await fetch(ICRAST_REGISTER_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Fallback local simulate
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setSubmitSuccess(true);
      trackEvent('icrast_attendee_registration', 'conversion', 'submitted');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Registration failed:', err);
      setErrorMessage(
        'A network error occurred while submitting your registration. Please verify your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
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
        <div style={{ maxWidth: '860px', marginInline: 'auto' }}>
          {/* Success State */}
          {submitSuccess ? (
            <Reveal>
              <div className="membership-success-card">
                <div
                  className="membership-success-icon"
                  style={{ background: 'rgba(245, 22, 22, 0.1)', color: '#f51616' }}
                >
                  <CheckCircle2 size={42} />
                </div>
                <span
                  className="membership-category-pill"
                  style={{ background: 'rgba(245, 22, 22, 0.1)', color: '#f51616' }}
                >
                  Registration Confirmed · {participationMode}
                </span>
                <h2 style={{ color: '#0b1b33' }}>
                  Your registration has been submitted successfully.
                </h2>
                <p>
                  Thank you for registering for ICRAST-26. Further conference details will be communicated to your registered email address (<strong>{email}</strong>).
                </p>

                <div
                  className="membership-reference-box"
                  style={{ borderColor: 'rgba(245, 22, 22, 0.4)' }}
                >
                  <span className="membership-reference-label">Participant Name</span>
                  <strong className="membership-reference-id" style={{ color: '#f51616' }}>
                    {fullName}
                  </strong>
                  <span className="membership-reference-time">
                    {designation} • {institution} ({country})
                  </span>
                </div>

                <div className="membership-success-actions">
                  <Link to="/icrast" className="icrast-btn icrast-btn--red icrast-btn--lg">
                    <span>Return to Conference Portal</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitSuccess(false);
                      setFullName('');
                      setEmail('');
                      setPhone('');
                      setCountry('India');
                      setInstitution('');
                      setDepartment('');
                      setDesignation(ATTENDEE_DESIGNATION_OPTIONS[0]);
                      setParticipationMode(PARTICIPATION_MODES[0]);
                      setAreaOfInterest(PARTICIPATION_AREAS_OF_INTEREST[0]);
                      setConfirmAccurate(false);
                      setAgreeUpdates(false);
                    }}
                    className="icrast-btn icrast-btn--outline-navy icrast-btn--lg"
                  >
                    <span>Register Another Participant</span>
                  </button>
                </div>
              </div>
            </Reveal>
          ) : (
            <Reveal>
              <form onSubmit={handleSubmit} className="membership-form-card">
                {/* Header */}
                <div className="membership-form-card__header">
                  <span
                    className="membership-category-pill"
                    style={{ background: 'rgba(245, 22, 22, 0.1)', color: '#f51616' }}
                  >
                    Registration Form
                  </span>
                  <h2 className="membership-form-card__title" style={{ color: '#0b1b33' }}>
                    Conference Registration Form
                  </h2>
                  <p className="membership-form-card__subtitle">
                    ICRAST-26
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="membership-error-banner" role="alert">
                    <AlertCircle size={20} />
                    <div>
                      <strong>Registration Notice:</strong>
                      <p>{errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* 1. Personal Details */}
                <div className="membership-form-section">
                  <div className="membership-section-title">
                    <User size={18} style={{ color: '#f51616' }} />
                    <h3 style={{ color: '#0b1b33' }}>1. Personal Details</h3>
                  </div>

                  <div className="membership-form-grid">
                    <div className="membership-field membership-field--full">
                      <label htmlFor="reg-fullName">Full Name *</label>
                      <input
                        type="text"
                        id="reg-fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder="Full Name"
                      />
                    </div>

                    <div className="membership-field">
                      <label htmlFor="reg-email">Email Address *</label>
                      <input
                        type="email"
                        id="reg-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="name@example.com"
                      />
                    </div>

                    <div className="membership-field">
                      <label htmlFor="reg-phone">Mobile / WhatsApp Number *</label>
                      <input
                        type="tel"
                        id="reg-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div className="membership-field membership-field--full">
                      <label htmlFor="reg-country">Country *</label>
                      <input
                        type="text"
                        id="reg-country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Academic / Professional Details */}
                <div className="membership-form-section">
                  <div className="membership-section-title">
                    <Building size={18} style={{ color: '#f51616' }} />
                    <h3 style={{ color: '#0b1b33' }}>2. Academic / Professional Details</h3>
                  </div>

                  <div className="membership-form-grid">
                    <div className="membership-field membership-field--full">
                      <label htmlFor="reg-institution">Institution / Organisation *</label>
                      <input
                        type="text"
                        id="reg-institution"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        required
                        placeholder="Institution / Organisation"
                      />
                    </div>

                    <div className="membership-field">
                      <label htmlFor="reg-department">Department *</label>
                      <input
                        type="text"
                        id="reg-department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                        placeholder="Department"
                      />
                    </div>

                    <div className="membership-field">
                      <label htmlFor="reg-designation">Designation / Current Status *</label>
                      <select
                        id="reg-designation"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        required
                      >
                        {ATTENDEE_DESIGNATION_OPTIONS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Conference Participation */}
                <div className="membership-form-section">
                  <div className="membership-section-title">
                    <Radio size={18} style={{ color: '#f51616' }} />
                    <h3 style={{ color: '#0b1b33' }}>3. Conference Participation</h3>
                  </div>

                  <div className="membership-form-grid">
                    <div className="membership-field membership-field--full">
                      <label>Participation Mode *</label>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                          marginTop: '0.35rem',
                        }}
                      >
                        {PARTICIPATION_MODES.map((mode) => (
                          <label key={mode} className="membership-checkbox-item">
                            <input
                              type="radio"
                              name="regParticipationMode"
                              checked={participationMode === mode}
                              onChange={() => setParticipationMode(mode)}
                            />
                            <span>{mode}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="membership-field membership-field--full">
                      <label htmlFor="reg-areaOfInterest">Area of Interest</label>
                      <select
                        id="reg-areaOfInterest"
                        value={areaOfInterest}
                        onChange={(e) => setAreaOfInterest(e.target.value)}
                      >
                        {PARTICIPATION_AREAS_OF_INTEREST.map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. Confirmation */}
                <div className="membership-form-section">
                  <div className="membership-section-title">
                    <CheckCircle2 size={18} style={{ color: '#f51616' }} />
                    <h3 style={{ color: '#0b1b33' }}>4. Confirmation</h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <label className="membership-consent">
                      <input
                        type="checkbox"
                        checked={confirmAccurate}
                        onChange={(e) => setConfirmAccurate(e.target.checked)}
                        required
                      />
                      <span>
                        I confirm that the information provided is accurate.
                      </span>
                    </label>

                    <label className="membership-consent">
                      <input
                        type="checkbox"
                        checked={agreeUpdates}
                        onChange={(e) => setAgreeUpdates(e.target.checked)}
                        required
                      />
                      <span>
                        I agree to receive conference-related updates and communications.
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
                        <span>Registering for ICRAST-26...</span>
                      </>
                    ) : (
                      <>
                        <span>Register for ICRAST-26</span>
                        <Send size={16} />
                      </>
                    )}
                  </button>
                  <p className="membership-form-note">
                    * Further conference details will be communicated to your registered email address.
                  </p>
                </div>
              </form>
            </Reveal>
          )}
        </div>
      </section>
    </IcrastLayout>
  );
}
