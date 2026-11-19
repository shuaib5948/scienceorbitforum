import React, { useState, useEffect, useRef } from 'react';
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
  Lock,
  Unlock,
  RefreshCw,
  Building,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Camera,
  X,
  PackageCheck,
  UserCheck,
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

function normalizePhone(p: unknown): string {
  if (p === null || p === undefined) return '';
  const str = String(p).trim();
  const digits = str.replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

function extractPhoneFromQr(text: unknown): string {
  if (!text) return '';
  const trimmed = String(text).trim();

  // Try URL parameter phone=
  try {
    if (trimmed.includes('phone=')) {
      const match = trimmed.match(/[?&]phone=([^&#]+)/i);
      if (match && match[1]) {
        return normalizePhone(decodeURIComponent(match[1]));
      }
    }
  } catch {}

  // Try JSON payload
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed.phone) return normalizePhone(parsed.phone);
    } catch {}
  }

  // Look for 10-digit number inside the scanned string
  const digitMatch = trimmed.match(/\b\d{10}\b/);
  if (digitMatch) {
    return digitMatch[0];
  }

  return normalizePhone(trimmed);
}

const VOLUNTEER_STORAGE_KEY = 'icrast_volunteer_desk_pin';

export default function IcrastCheckinPage() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const scanPhone = queryParams.get('phone') || '';

  // Volunteer PIN Auth
  const [pinInput, setPinInput] = useState('');
  const [pinVerified, setPinVerified] = useState(false);
  const [pinError, setPinError] = useState('');

  // Checkin Action & Modal
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkinResult, setCheckinResult] = useState<DelegateCheckinResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Camera QR Scanner (Always on when unlocked)
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScannerRunningRef = useRef(false);

  useEffect(() => {
    trackPageView('/icrast/checkin', 'ICRAST-26 Counter Check-in Desk');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Check existing session PIN
    const savedPin = sessionStorage.getItem(VOLUNTEER_STORAGE_KEY);
    if (savedPin === '2026') {
      setPinVerified(true);
      if (scanPhone) {
        performCheckin(scanPhone, savedPin);
      }
    }
  }, []);

  // Handle Escape key and scroll-lock for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
    };
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  // Start / Stop camera scanner lifecycle
  const startScanner = () => {
    if (isScannerRunningRef.current) return;
    setCameraError(null);

    // Delay slightly to ensure DOM element #icrast-reader exists
    setTimeout(() => {
      try {
        const html5QrCode = new Html5Qrcode('icrast-reader');
        scannerRef.current = html5QrCode;

        const qrSuccessCallback = (decodedText: string) => {
          const phoneFound = extractPhoneFromQr(decodedText);
          if (phoneFound && phoneFound.length >= 10) {
            // Haptic vibration feedback
            try {
              if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(200);
              }
            } catch {}

            // Pause scanner immediately so it doesn't multi-scan while processing
            pauseScanner();

            const activePin = sessionStorage.getItem(VOLUNTEER_STORAGE_KEY) || '2026';
            performCheckin(phoneFound, activePin);
          } else {
            setCameraError(
              `Scanned QR: "${decodedText.slice(0, 35)}...". No valid delegate phone found.`
            );
          }
        };

        const config = {
          fps: 12,
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const edgeSize = Math.floor(minEdge * 0.72);
            return { width: edgeSize, height: edgeSize };
          },
          aspectRatio: 1.0,
        };

        html5QrCode
          .start(
            { facingMode: 'environment' },
            config,
            qrSuccessCallback,
            () => {
              // Ignore per-frame non-detection
            }
          )
          .then(() => {
            isScannerRunningRef.current = true;
          })
          .catch((err) => {
            console.error('Camera start failed:', err);
            isScannerRunningRef.current = false;
            setCameraError(
              typeof err === 'string'
                ? err
                : err?.message || 'Could not access camera. Please allow camera permissions in browser settings.'
            );
          });
      } catch (initErr) {
        console.error('Html5Qrcode init error:', initErr);
        setCameraError('Unable to initialize camera component.');
      }
    }, 150);
  };

  const pauseScanner = () => {
    if (scannerRef.current && isScannerRunningRef.current) {
      try {
        scannerRef.current.pause(true);
      } catch {
        // Fallback to stop if pause fails
        stopScanner();
      }
    }
  };

  const resumeScanner = () => {
    setCameraError(null);
    setErrorMessage('');
    if (scannerRef.current && isScannerRunningRef.current) {
      try {
        scannerRef.current.resume();
        return;
      } catch {
        // Fallback to restart
        stopScanner();
      }
    }
    startScanner();
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop().catch(() => {});
        }
        scannerRef.current.clear();
      } catch (err) {
        console.warn('Error clearing camera scanner:', err);
      }
      scannerRef.current = null;
    }
    isScannerRunningRef.current = false;
  };

  // Launch camera automatically whenever unlocked and modal is not open
  useEffect(() => {
    if (pinVerified && !isModalOpen) {
      startScanner();
    }
    return () => {
      stopScanner();
    };
  }, [pinVerified]);

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    if (pinInput.trim() === '2026') {
      sessionStorage.setItem(VOLUNTEER_STORAGE_KEY, '2026');
      setPinVerified(true);
      if (scanPhone) {
        performCheckin(scanPhone, '2026');
      }
    } else {
      setPinError('Incorrect PIN. Please ask the registration coordinator for access.');
    }
  };

  const performCheckin = async (phoneToProcess: string, activePin: string) => {
    const cleanPhone = normalizePhone(phoneToProcess);
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please scan a valid delegate pass.');
      resumeScanner();
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
        setIsModalOpen(true);
        trackEvent('icrast_counter_checkin', 'action', data.alreadyCheckedIn ? 'already_checked' : 'new_checkin');
      } else {
        setCheckinResult(null);
        setErrorMessage(
          data.message || 'No attendee found matching this pass. Please verify registration.'
        );
        trackEvent('icrast_counter_checkin', 'action', 'not_found');
        resumeScanner();
      }
    } catch (err) {
      console.error('Checkin failed:', err);
      setErrorMessage(
        'Connection error reaching the database. Please check internet connection.'
      );
      resumeScanner();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCheckinResult(null);
    setErrorMessage('');
    window.history.replaceState({}, '', window.location.pathname);
    // Instantly resume camera for next delegate
    resumeScanner();
  };

  return (
    <IcrastLayout>
      <section
        className="container section icrast-checkin-portal"
        style={{
          paddingTop: 'clamp(2rem, 4vh, 3.5rem)',
          paddingBottom: 'clamp(3rem, 6vh, 5rem)',
        }}
      >
        <div style={{ maxWidth: '520px', marginInline: 'auto' }}>
          {/* Volunteer PIN Gate */}
          {!pinVerified ? (
            <Reveal delay={100}>
              <div
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.92)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '20px',
                  padding: '2.5rem 2rem',
                  maxWidth: '440px',
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
                    marginBottom: '0.4rem',
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
                  Enter authorized volunteer PIN to access the camera desk.
                </p>

                <form onSubmit={handleVerifyPin}>
                  <input
                    type="password"
                    maxLength={6}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Enter PIN"
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
                      marginBottom: '1.25rem',
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
                    <span>Unlock Desk</span>
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
              {/* Authenticated Always-On Camera Scanner Desk */}
              <Reveal delay={100}>
                <div
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '20px',
                    padding: 'clamp(1.25rem, 3vw, 1.75rem)',
                    boxShadow: '0 16px 45px rgba(0, 0, 0, 0.5), 0 0 25px rgba(34, 197, 94, 0.1)',
                    textAlign: 'center',
                  }}
                >
                  {/* Status Indicator Bar */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      padding: '0.35rem 0.9rem',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(34, 197, 94, 0.12)',
                      border: '1px solid rgba(34, 197, 94, 0.35)',
                      color: '#86efac',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      marginBottom: '1rem',
                      letterSpacing: '0.03em',
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#22c55e',
                        boxShadow: '0 0 8px #22c55e',
                      }}
                    />
                    <span>Live Counter Camera Ready</span>
                  </div>

                  {/* Always-On Video Viewfinder Box */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      maxWidth: '420px',
                      margin: '0 auto',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '2px solid rgba(34, 197, 94, 0.45)',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(0, 0, 0, 0.5)',
                      backgroundColor: '#000000',
                      minHeight: '300px',
                    }}
                  >
                    <div
                      id="icrast-reader"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '14px',
                      }}
                    />

                    {/* Scanning guide corners overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: '16px',
                        border: '2px dashed rgba(34, 197, 94, 0.4)',
                        borderRadius: '12px',
                        pointerEvents: 'none',
                      }}
                    />

                    {isProcessing && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(3, 7, 18, 0.75)',
                          backdropFilter: 'blur(4px)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.75rem',
                          color: '#86efac',
                          zIndex: 10,
                        }}
                      >
                        <RefreshCw size={28} className="animate-spin text-green-400" />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                          Verifying Attendee...
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Error / Instruction Messages */}
                  {cameraError ? (
                    <div
                      style={{
                        marginTop: '1rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        color: '#fca5a5',
                        fontSize: '0.85rem',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <AlertCircle size={16} />
                        <strong>Camera Message:</strong>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.82rem' }}>{cameraError}</p>
                      <button
                        type="button"
                        onClick={resumeScanner}
                        style={{
                          marginTop: '0.5rem',
                          background: 'rgba(255, 255, 255, 0.15)',
                          border: 'none',
                          color: '#ffffff',
                          borderRadius: '6px',
                          padding: '0.3rem 0.75rem',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                        }}
                      >
                        Retry Camera
                      </button>
                    </div>
                  ) : errorMessage ? (
                    <div
                      style={{
                        marginTop: '1rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        color: '#fca5a5',
                        fontSize: '0.85rem',
                      }}
                    >
                      {errorMessage}
                    </div>
                  ) : (
                    <p
                      style={{
                        marginTop: '1rem',
                        fontSize: '0.85rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginBottom: 0,
                      }}
                    >
                      Point camera directly at candidate's QR badge pass.
                    </p>
                  )}
                </div>
              </Reveal>
            </>
          )}

          {/* Premium Professional Verification Success Modal */}
          {isModalOpen && checkinResult && (
            <div
              className="icrast-checkin-modal-overlay"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  handleCloseModal();
                }
              }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(3, 7, 18, 0.88)',
                backdropFilter: 'blur(8px)',
                padding: 'clamp(0.75rem, 3vw, 1.5rem)',
                overflowY: 'auto',
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Delegate Check-in Status"
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '520px',
                  backgroundColor: '#071224',
                  border: checkinResult.alreadyCheckedIn
                    ? '2px solid rgba(234, 179, 8, 0.55)'
                    : '2px solid rgba(34, 197, 94, 0.55)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: checkinResult.alreadyCheckedIn
                    ? '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(234, 179, 8, 0.2)'
                    : '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(34, 197, 94, 0.25)',
                  margin: 'auto',
                }}
              >
                {/* Modal Top Close Button */}
                <button
                  type="button"
                  onClick={handleCloseModal}
                  aria-label="Close Modal and Scan Next"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    zIndex: 20,
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(11, 27, 51, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1e3a8a')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(11, 27, 51, 0.8)')}
                >
                  <X size={16} />
                </button>

                {/* Top Colored Accent Ribbon */}
                <div
                  style={{
                    background: checkinResult.alreadyCheckedIn
                      ? 'linear-gradient(90deg, #713f12 0%, #a16207 50%, #713f12 100%)'
                      : 'linear-gradient(90deg, #14532d 0%, #16a34a 50%, #14532d 100%)',
                    padding: '0.9rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                  }}
                >
                  {checkinResult.alreadyCheckedIn ? (
                    <AlertTriangle size={20} style={{ color: '#fef08a' }} />
                  ) : (
                    <CheckCircle2 size={20} style={{ color: '#bbf7d0' }} />
                  )}
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: checkinResult.alreadyCheckedIn ? '#fef08a' : '#dcfce7',
                    }}
                  >
                    {checkinResult.alreadyCheckedIn
                      ? 'ALREADY CHECKED IN'
                      : 'CHECK-IN VERIFIED & RECORDED'}
                  </span>
                </div>

                {/* Modal Body Content */}
                <div style={{ padding: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
                  {/* Delegate Name & ID */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '5px',
                        backgroundColor: 'rgba(0, 229, 255, 0.12)',
                        border: '1px solid rgba(0, 229, 255, 0.3)',
                        color: '#00e5ff',
                        fontFamily: 'monospace',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        marginBottom: '0.45rem',
                        letterSpacing: '0.05em',
                      }}
                    >
                      <span>ID: {checkinResult.delegateId || 'ICRAST26-DELEGATE'}</span>
                    </div>

                    <h2
                      style={{
                        fontSize: 'clamp(1.4rem, 2.8vw, 1.75rem)',
                        fontWeight: 800,
                        color: '#ffffff',
                        margin: 0,
                        lineHeight: 1.25,
                      }}
                    >
                      {checkinResult.fullName}
                    </h2>
                  </div>

                  {/* Details Grid */}
                  <div
                    style={{
                      backgroundColor: 'rgba(11, 27, 51, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '0.85rem',
                      marginBottom: '1.25rem',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.72rem', fontWeight: 600 }}>
                        INSTITUTION
                      </div>
                      <strong style={{ color: '#ffffff' }}>
                        {checkinResult.institution || 'Calicut University'}
                      </strong>
                    </div>

                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.72rem', fontWeight: 600 }}>
                        CHECK-IN TIMESTAMP
                      </div>
                      <strong style={{ color: '#93c5fd' }}>
                        {checkinResult.checkinTimestamp || 'Recorded Just Now'}
                      </strong>
                    </div>
                  </div>

                  {/* Delegate Kit Dispatch Highlight Banner */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      backgroundColor: checkinResult.alreadyCheckedIn
                        ? 'rgba(234, 179, 8, 0.12)'
                        : 'rgba(34, 197, 94, 0.14)',
                      border: checkinResult.alreadyCheckedIn
                        ? '1px solid rgba(234, 179, 8, 0.35)'
                        : '1px solid rgba(34, 197, 94, 0.35)',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: checkinResult.alreadyCheckedIn
                          ? 'rgba(234, 179, 8, 0.2)'
                          : 'rgba(34, 197, 94, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: checkinResult.alreadyCheckedIn ? '#facc15' : '#4ade80',
                        flexShrink: 0,
                      }}
                    >
                      <PackageCheck size={20} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          color: checkinResult.alreadyCheckedIn ? '#facc15' : '#86efac',
                        }}
                      >
                        Counter Action
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>
                        Issue Official Conference Kit &amp; Delegate Lanyard
                      </div>
                    </div>
                  </div>

                  {/* Primary Next Scan Button */}
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="icrast-btn icrast-btn--primary"
                    style={{
                      width: '100%',
                      padding: '0.9rem',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.55rem',
                      borderRadius: '10px',
                    }}
                  >
                    <Camera size={18} />
                    <span>Scan Next Delegate</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </IcrastLayout>
  );
}
