import React, { useState, useEffect } from 'react';
import { useLocation, Link } from '@tanstack/react-router';
import { IcrastLayout } from '../components/icrast/IcrastLayout';
import { Reveal } from '../components/ui/Reveal';
import { trackPageView, trackEvent } from '../lib/analytics';
import {
  ICRAST_REGISTER_SCRIPT_URL,
  type DelegateCheckinResult,
} from '../types/icrast';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  QrCode,
  Search,
  Lock,
  Unlock,
  RefreshCw,
  UserCheck,
  Building,
  GraduationCap,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

function normalizePhone(p: string): string {
  if (!p) return '';
  const digits = p.replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

const VOLUNTEER_STORAGE_KEY = 'icrast_volunteer_desk_pin';

export default function IcrastCheckinPage() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const scanPhone = queryParams.get('phone') || '';
  const scanId = queryParams.get('id') || '';

  // Volunteer PIN Auth
  const [pinInput, setPinInput] = useState('');
  const [pinVerified, setPinVerified] = useState(false);
  const [pinError, setPinError] = useState('');

  // Checkin Search & Action
  const [manualPhone, setManualPhone] = useState(scanPhone);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkinResult, setCheckinResult] = useState<DelegateCheckinResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Live Stats
  const [stats, setStats] = useState<{ total: number; checkedIn: number } | null>(null);
  const [isFetchingStats, setIsFetchingStats] = useState(false);

  useEffect(() => {
    trackPageView('/icrast/checkin', 'ICRAST-26 Counter Check-in Desk');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Check existing session PIN
    const savedPin = sessionStorage.getItem(VOLUNTEER_STORAGE_KEY);
    if (savedPin === '2026') {
      setPinVerified(true);
      fetchStats(savedPin);
      if (scanPhone) {
        performCheckin(scanPhone, savedPin);
      }
    }
  }, []);

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    if (pinInput.trim() === '2026') {
      sessionStorage.setItem(VOLUNTEER_STORAGE_KEY, '2026');
      setPinVerified(true);
      fetchStats('2026');
      if (scanPhone) {
        performCheckin(scanPhone, '2026');
      }
    } else {
      setPinError('Incorrect PIN. Please ask the registration coordinator for access.');
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem(VOLUNTEER_STORAGE_KEY);
    setPinVerified(false);
    setPinInput('');
    setCheckinResult(null);
  };

  const fetchStats = async (pin: string) => {
    setIsFetchingStats(true);
    try {
      const response = await fetch(ICRAST_REGISTER_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'volunteer_stats',
          pin: pin,
        }),
      });
      const data = await response.json();
      if (data.ok && data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.warn('Could not fetch counter stats:', err);
    } finally {
      setIsFetchingStats(false);
    }
  };

  const performCheckin = async (phoneToProcess: string, activePin: string) => {
    const cleanPhone = normalizePhone(phoneToProcess);
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);
    setCheckinResult(null);

    try {
      const response = await fetch(ICRAST_REGISTER_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'checkin',
          phone: cleanPhone,
          pin: activePin,
        }),
      });

      const data: DelegateCheckinResult = await response.json();

      if (data.ok) {
        setCheckinResult(data);
        if (data.stats) {
          setStats(data.stats);
        } else {
          fetchStats(activePin);
        }
        trackEvent('icrast_counter_checkin', 'action', data.alreadyCheckedIn ? 'already_checked' : 'new_checkin');
      } else {
        setCheckinResult(null);
        setErrorMessage(
          data.message || 'No attendee found matching this mobile number. Please check registration.'
        );
        trackEvent('icrast_counter_checkin', 'action', 'not_found');
      }
    } catch (err) {
      console.error('Checkin failed:', err);
      setErrorMessage(
        'Connection error connecting to Google Sheet database. Please check internet connection.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = sessionStorage.getItem(VOLUNTEER_STORAGE_KEY) || '2026';
    performCheckin(manualPhone, pin);
  };

  const handleResetForNext = () => {
    setCheckinResult(null);
    setManualPhone('');
    setErrorMessage('');
    // Remove query params from browser URL without reloading
    window.history.replaceState({}, '', window.location.pathname);
  };

  return (
    <IcrastLayout>
      <section
        className="container section icrast-checkin-portal"
        style={{
          paddingTop: 'clamp(5.5rem, 9vh, 7rem)',
          paddingBottom: 'clamp(4rem, 7vh, 6rem)',
        }}
      >
        <div style={{ maxWidth: '800px', marginInline: 'auto' }}>
          {/* Top Title Banner */}
          <Reveal>
            <div className="text-center" style={{ marginBottom: '2.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 1rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(34, 197, 94, 0.35)',
                  color: '#86efac',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                <UserCheck size={14} />
                <span>Aryabhata Hall · Registration Counter Desk</span>
              </div>
              <h1
                style={{
                  fontSize: 'clamp(1.9rem, 3.8vw, 2.6rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '0.75rem',
                  letterSpacing: '-0.02em',
                }}
              >
                Volunteer Check-in Counter
              </h1>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.72)',
                  fontSize: '1rem',
                  maxWidth: '580px',
                  marginInline: 'auto',
                }}
              >
                Scan delegate QR passes or search by mobile number to mark attendance
                and record entry in real time.
              </p>
            </div>
          </Reveal>

          {/* Volunteer PIN Gate */}
          {!pinVerified ? (
            <Reveal delay={100}>
              <div
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '20px',
                  padding: '2.5rem 2rem',
                  maxWidth: '460px',
                  marginInline: 'auto',
                  textAlign: 'center',
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    color: '#d4af37',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  <Lock size={26} />
                </div>
                <h2
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '0.5rem',
                  }}
                >
                  Counter Desk Access
                </h2>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255, 255, 255, 0.65)',
                    marginBottom: '1.75rem',
                  }}
                >
                  Enter the 4-digit volunteer desk PIN to unlock check-in actions.
                </p>

                <form onSubmit={handleVerifyPin}>
                  <input
                    type="password"
                    maxLength={6}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Enter PIN (e.g. 2026)"
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      textAlign: 'center',
                      fontSize: '1.4rem',
                      letterSpacing: '0.35em',
                      backgroundColor: 'rgba(11, 27, 51, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      outline: 'none',
                      marginBottom: '1rem',
                    }}
                  />
                  <button
                    type="submit"
                    className="icrast-btn icrast-btn--primary"
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Unlock size={16} />
                    <span>Unlock Check-in Desk</span>
                  </button>
                </form>

                {pinError && (
                  <div
                    style={{
                      marginTop: '1rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      color: '#fca5a5',
                      fontSize: '0.85rem',
                    }}
                  >
                    {pinError}
                  </div>
                )}
              </div>
            </Reveal>
          ) : (
            <>
              {/* Authenticated Desk Panel */}
              <Reveal delay={100}>
                {/* Desk Control Bar & Live Stats */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    backgroundColor: 'rgba(11, 27, 51, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '14px',
                    padding: '1rem 1.5rem',
                    marginBottom: '1.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: '#22c55e',
                        boxShadow: '0 0 10px #22c55e',
                      }}
                    />
                    <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>
                      Counter Desk Active (PIN: 2026)
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {stats && (
                      <div
                        style={{
                          fontSize: '0.85rem',
                          color: '#93c5fd',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                        }}
                      >
                        <Users size={15} />
                        <span>
                          Checked In: <strong>{stats.checkedIn}</strong> / {stats.total}
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fetchStats('2026')}
                      disabled={isFetchingStats}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.6)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.25rem',
                      }}
                      title="Refresh Stats"
                    >
                      <RefreshCw size={14} className={isFetchingStats ? 'animate-spin' : ''} />
                    </button>
                    <button
                      type="button"
                      onClick={handleLock}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.75rem',
                        padding: '0.3rem 0.65rem',
                        cursor: 'pointer',
                      }}
                    >
                      Lock Desk
                    </button>
                  </div>
                </div>

                {/* Scan / Manual Search Form */}
                <div
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    marginBottom: '2rem',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
                  }}
                >
                  <form onSubmit={handleManualSubmit}>
                    <label
                      htmlFor="manual-phone-input"
                      style={{
                        display: 'block',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: '#ffffff',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Mobile / WhatsApp Number from QR Code or Delegate
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <input
                        id="manual-phone-input"
                        type="tel"
                        value={manualPhone}
                        onChange={(e) => setManualPhone(e.target.value)}
                        placeholder="Scan or type 10-digit phone number"
                        disabled={isProcessing}
                        autoFocus
                        style={{
                          flex: '1 1 280px',
                          padding: '0.85rem 1rem',
                          backgroundColor: 'rgba(11, 27, 51, 0.7)',
                          border: '1px solid rgba(255, 255, 255, 0.25)',
                          borderRadius: '10px',
                          color: '#ffffff',
                          fontSize: '1.05rem',
                          outline: 'none',
                        }}
                      />
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="icrast-btn icrast-btn--primary"
                        style={{
                          padding: '0.85rem 1.75rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.95rem',
                        }}
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw size={16} className="animate-spin" />
                            <span>Checking in...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={16} />
                            <span>Confirm Check-in</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {errorMessage && (
                    <div
                      style={{
                        marginTop: '1.25rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.35)',
                        color: '#fca5a5',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.65rem',
                      }}
                    >
                      <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong>Not Found / Error:</strong> {errorMessage}
                        <div style={{ marginTop: '0.4rem' }}>
                          <Link
                            to="/icrast/register"
                            target="_blank"
                            style={{
                              color: '#ffffff',
                              textDecoration: 'underline',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                            }}
                          >
                            Open on-spot registration form &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Check-in Result Card */}
                {checkinResult && (
                  <div
                    style={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: checkinResult.alreadyCheckedIn
                        ? '2px solid #eab308'
                        : '2px solid #22c55e',
                      backgroundColor: checkinResult.alreadyCheckedIn
                        ? 'rgba(113, 63, 18, 0.25)'
                        : 'rgba(20, 83, 45, 0.25)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5)',
                      padding: '2rem',
                      marginBottom: '2rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '1.25rem',
                      }}
                    >
                      <div
                        style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: '50%',
                          backgroundColor: checkinResult.alreadyCheckedIn
                            ? 'rgba(234, 179, 8, 0.2)'
                            : 'rgba(34, 197, 94, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: checkinResult.alreadyCheckedIn ? '#facc15' : '#4ade80',
                        }}
                      >
                        {checkinResult.alreadyCheckedIn ? (
                          <AlertTriangle size={30} />
                        ) : (
                          <CheckCircle2 size={30} />
                        )}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            color: checkinResult.alreadyCheckedIn ? '#facc15' : '#4ade80',
                          }}
                        >
                          {checkinResult.alreadyCheckedIn
                            ? 'ALREADY CHECKED IN PREVIOUSLY'
                            : 'CHECK-IN VERIFIED & RECORDED'}
                        </div>
                        <h2
                          style={{
                            fontSize: '1.65rem',
                            fontWeight: 800,
                            color: '#ffffff',
                            margin: 0,
                          }}
                        >
                          {checkinResult.fullName}
                        </h2>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '1rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        color: 'rgba(255, 255, 255, 0.85)',
                      }}
                    >
                      <div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
                          DELEGATE ID
                        </div>
                        <strong style={{ fontFamily: 'monospace', color: '#00e5ff' }}>
                          {checkinResult.delegateId || 'ICRAST26-DELEGATE'}
                        </strong>
                      </div>
                      <div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
                          INSTITUTION
                        </div>
                        <strong>{checkinResult.institution || 'Calicut University'}</strong>
                      </div>
                      <div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
                          CHECK-IN TIMESTAMP
                        </div>
                        <strong>{checkinResult.checkinTimestamp || 'Recorded Just Now'}</strong>
                      </div>
                      <div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
                          KIT &amp; BADGE STATUS
                        </div>
                        <strong style={{ color: '#86efac' }}>Issue Delegate Kit &amp; Lanyard</strong>
                      </div>
                    </div>

                    {/* Next Scan Action Button */}
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={handleResetForNext}
                        className="icrast-btn icrast-btn--primary"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem 1.5rem',
                          fontSize: '0.9rem',
                        }}
                      >
                        <span>Scan Next Attendee</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </Reveal>
            </>
          )}
        </div>
      </section>
    </IcrastLayout>
  );
}
