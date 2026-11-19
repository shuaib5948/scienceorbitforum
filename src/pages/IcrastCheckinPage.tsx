import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from '@tanstack/react-router';
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
  ArrowRight,
  Camera,
  X,
  PackageCheck,
  Building,
  LogOut,
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

  // Live Stats (Registration & Checked-in Count)
  const [stats, setStats] = useState<{ total: number; checkedIn: number } | null>(null);
  const [isFetchingStats, setIsFetchingStats] = useState(false);

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
    trackPageView('/icrast/checkin', 'ICRAST-26 Mobile Check-in Desk');
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

  // Screen Wake Lock (Keeps mobile screen awake during scanning)
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && (navigator as any).wakeLock) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        }
      } catch (err) {
        // Ignored if unsupported or user disabled
      }
    };

    if (pinVerified) {
      requestWakeLock();
    }

    return () => {
      if (wakeLock && typeof wakeLock.release === 'function') {
        wakeLock.release().catch(() => {});
      }
    };
  }, [pinVerified]);

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

  // Fetch Live Registration Stats
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
            const edgeSize = Math.floor(minEdge * 0.74);
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
      fetchStats('2026');
      if (scanPhone) {
        performCheckin(scanPhone, '2026');
      }
    } else {
      setPinError('Incorrect PIN. Please ask the registration coordinator for access.');
    }
  };

  const handleLock = () => {
    stopScanner();
    sessionStorage.removeItem(VOLUNTEER_STORAGE_KEY);
    setPinVerified(false);
    setPinInput('');
    setCheckinResult(null);
    setIsModalOpen(false);
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
        if (data.stats) {
          setStats(data.stats);
        } else {
          fetchStats(activePin);
        }
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
    <div
      className="icrast-checkin-standalone-app"
      style={{
        minHeight: '100dvh',
        height: '100dvh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#071224',
        color: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Dynamic Keyframe & Viewfinder CSS */}
      <style>{`
        #icrast-reader {
          border: none !important;
          background: #000000 !important;
        }
        #icrast-reader video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 18px !important;
        }
        #icrast-reader__scan_region {
          border-radius: 18px !important;
        }
        @keyframes icrast-laser-scan {
          0% { top: 6%; opacity: 0.8; }
          50% { top: 92%; opacity: 1; }
          100% { top: 6%; opacity: 0.8; }
        }
        @keyframes icrast-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.95); }
        }
      `}</style>

      {/* Top Application Header Bar */}
      <header
        style={{
          height: '62px',
          backgroundColor: 'rgba(11, 27, 51, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          flexShrink: 0,
          zIndex: 40,
        }}
      >
        {/* Brand: ICRAST Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <img
            src="/images/icrast-logo-mark.png"
            alt="ICRAST Logo"
            style={{
              width: '32px',
              height: '32px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))',
            }}
          />
          <div>
            <div
              style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '0.02em',
              }}
            >
              ICRAST-26
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                color: '#93c5fd',
                fontWeight: 600,
                letterSpacing: '0.03em',
              }}
            >
              Check-in Desk
            </div>
          </div>
        </div>

        {/* Right Side: Live Registration Count & Lock Button */}
        {pinVerified && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* Live Registration Count Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                color: '#86efac',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  boxShadow: '0 0 8px #22c55e',
                  animation: 'icrast-pulse 2s infinite',
                }}
              />
              <span style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.75rem' }}>Checked In:</span>
              <strong style={{ color: '#ffffff', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                {stats ? `${stats.checkedIn} / ${stats.total}` : '...'}
              </strong>
              <button
                type="button"
                onClick={() => fetchStats('2026')}
                disabled={isFetchingStats}
                title="Refresh Live Count"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 0 0 2px',
                }}
              >
                <RefreshCw size={11} className={isFetchingStats ? 'animate-spin' : ''} />
              </button>
            </div>

            {/* Discreet Lock Button */}
            <button
              type="button"
              onClick={handleLock}
              title="Lock Desk"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                color: 'rgba(255, 255, 255, 0.75)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
            >
              <LogOut size={15} />
            </button>
          </div>
        )}
      </header>

      {/* Main Full-Height App Area */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          position: 'relative',
          overflowY: 'auto',
        }}
      >
        {/* PIN Authorization Screen (When Locked) */}
        {!pinVerified ? (
          <div
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              padding: '2.5rem 2rem',
              maxWidth: '380px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 175, 55, 0.1)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                color: '#d4af37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <img
                src="/images/icrast-logo-mark.png"
                alt="ICRAST Logo"
                style={{ width: '38px', height: '38px', objectFit: 'contain' }}
              />
            </div>

            <h1
              style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '0.35rem',
              }}
            >
              Counter Desk Access
            </h1>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.65)',
                marginBottom: '1.75rem',
              }}
            >
              Enter authorized volunteer PIN to unlock camera desk.
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
                  padding: '0.9rem 1rem',
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  letterSpacing: '0.35em',
                  backgroundColor: 'rgba(11, 27, 51, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  outline: 'none',
                  marginBottom: '1.25rem',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4)',
                }}
              />
              <button
                type="submit"
                className="icrast-btn icrast-btn--primary"
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  borderRadius: '12px',
                }}
              >
                <Unlock size={17} />
                <span>Unlock Desk</span>
              </button>
            </form>

            {pinError && (
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.18)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
                  fontSize: '0.85rem',
                }}
              >
                {pinError}
              </div>
            )}
          </div>
        ) : (
          /* Mobile-Optimized Always-On Live Scanner View */
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Viewfinder Container Card */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1',
                maxHeight: 'min(70vh, 380px)',
                borderRadius: '24px',
                overflow: 'hidden',
                backgroundColor: '#000000',
                border: '2px solid rgba(34, 197, 94, 0.4)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(34, 197, 94, 0.15)',
              }}
            >
              {/* html5-qrcode video viewport */}
              <div
                id="icrast-reader"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />

              {/* High-Tech Corner Reticles */}
              <div
                style={{
                  position: 'absolute',
                  inset: '20px',
                  pointerEvents: 'none',
                  zIndex: 10,
                }}
              >
                {/* Top-Left Corner */}
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '28px',
                    height: '28px',
                    borderTop: '3px solid #22c55e',
                    borderLeft: '3px solid #22c55e',
                    borderTopLeftRadius: '8px',
                    filter: 'drop-shadow(0 0 6px #22c55e)',
                  }}
                />
                {/* Top-Right Corner */}
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '28px',
                    height: '28px',
                    borderTop: '3px solid #22c55e',
                    borderRight: '3px solid #22c55e',
                    borderTopRightRadius: '8px',
                    filter: 'drop-shadow(0 0 6px #22c55e)',
                  }}
                />
                {/* Bottom-Left Corner */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '28px',
                    height: '28px',
                    borderBottom: '3px solid #22c55e',
                    borderLeft: '3px solid #22c55e',
                    borderBottomLeftRadius: '8px',
                    filter: 'drop-shadow(0 0 6px #22c55e)',
                  }}
                />
                {/* Bottom-Right Corner */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '28px',
                    height: '28px',
                    borderBottom: '3px solid #22c55e',
                    borderRight: '3px solid #22c55e',
                    borderBottomRightRadius: '8px',
                    filter: 'drop-shadow(0 0 6px #22c55e)',
                  }}
                />

                {/* Animated Green Laser Sweep Line */}
                <div
                  style={{
                    position: 'absolute',
                    left: '4px',
                    right: '4px',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent 0%, #22c55e 50%, transparent 100%)',
                    boxShadow: '0 0 12px 2px #22c55e',
                    animation: 'icrast-laser-scan 2.6s ease-in-out infinite',
                  }}
                />
              </div>

              {/* Loading / Verifying Overlay */}
              {isProcessing && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(3, 7, 18, 0.85)',
                    backdropFilter: 'blur(6px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.85rem',
                    color: '#86efac',
                    zIndex: 25,
                  }}
                >
                  <RefreshCw size={32} className="animate-spin text-green-400" />
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.02em' }}>
                    Verifying Pass...
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Status / Instructions */}
            <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
              {cameraError ? (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#fca5a5',
                    fontSize: '0.85rem',
                  }}
                >
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.82rem' }}>{cameraError}</p>
                  <button
                    type="button"
                    onClick={resumeScanner}
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      border: 'none',
                      color: '#ffffff',
                      borderRadius: '8px',
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Restart Camera
                  </button>
                </div>
              ) : errorMessage ? (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#fca5a5',
                    fontSize: '0.85rem',
                  }}
                >
                  {errorMessage}
                </div>
              ) : (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 1rem',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(11, 27, 51, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    fontSize: '0.82rem',
                    color: 'rgba(255, 255, 255, 0.75)',
                  }}
                >
                  <Camera size={14} style={{ color: '#86efac' }} />
                  <span>Align candidate QR pass inside frame</span>
                </div>
              )}
            </div>
          </div>
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
              backgroundColor: 'rgba(3, 7, 18, 0.9)',
              backdropFilter: 'blur(10px)',
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
                maxWidth: '480px',
                backgroundColor: '#071224',
                border: checkinResult.alreadyCheckedIn
                  ? '2px solid rgba(234, 179, 8, 0.6)'
                  : '2px solid rgba(34, 197, 94, 0.6)',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: checkinResult.alreadyCheckedIn
                  ? '0 25px 65px rgba(0, 0, 0, 0.8), 0 0 35px rgba(234, 179, 8, 0.25)'
                  : '0 25px 65px rgba(0, 0, 0, 0.8), 0 0 35px rgba(34, 197, 94, 0.3)',
                margin: 'auto',
              }}
            >
              {/* Modal Top Close Button */}
              <button
                type="button"
                onClick={handleCloseModal}
                aria-label="Close and Scan Next"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  zIndex: 20,
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(11, 27, 51, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1e3a8a')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(11, 27, 51, 0.85)')}
              >
                <X size={17} />
              </button>

              {/* Top Colored Accent Ribbon */}
              <div
                style={{
                  background: checkinResult.alreadyCheckedIn
                    ? 'linear-gradient(90deg, #713f12 0%, #ca8a04 50%, #713f12 100%)'
                    : 'linear-gradient(90deg, #14532d 0%, #16a34a 50%, #14532d 100%)',
                  padding: '1rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                }}
              >
                {checkinResult.alreadyCheckedIn ? (
                  <AlertTriangle size={22} style={{ color: '#fef08a' }} />
                ) : (
                  <CheckCircle2 size={22} style={{ color: '#dcfce7' }} />
                )}
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: checkinResult.alreadyCheckedIn ? '#fef08a' : '#ffffff',
                  }}
                >
                  {checkinResult.alreadyCheckedIn
                    ? 'ALREADY CHECKED IN PREVIOUSLY'
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
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(0, 229, 255, 0.12)',
                      border: '1px solid rgba(0, 229, 255, 0.35)',
                      color: '#00e5ff',
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      marginBottom: '0.45rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <span>ID: {checkinResult.delegateId || 'ICRAST26-DELEGATE'}</span>
                  </div>

                  <h2
                    style={{
                      fontSize: 'clamp(1.4rem, 3.2vw, 1.75rem)',
                      fontWeight: 800,
                      color: '#ffffff',
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {checkinResult.fullName}
                  </h2>
                </div>

                {/* Details Grid */}
                <div
                  style={{
                    backgroundColor: 'rgba(11, 27, 51, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '1rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '0.85rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.85rem',
                  }}
                >
                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.72rem', fontWeight: 600 }}>
                      INSTITUTION
                    </div>
                    <strong style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
                      <Building size={14} style={{ color: '#93c5fd', flexShrink: 0 }} />
                      <span>{checkinResult.institution || 'Calicut University'}</span>
                    </strong>
                  </div>

                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.72rem', fontWeight: 600 }}>
                      RECORDED TIMESTAMP
                    </div>
                    <strong style={{ color: '#93c5fd', display: 'block', marginTop: '2px' }}>
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
                    borderRadius: '14px',
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
                      width: '38px',
                      height: '38px',
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
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        color: checkinResult.alreadyCheckedIn ? '#facc15' : '#86efac',
                      }}
                    >
                      Registration Desk Action
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>
                      Issue Delegate Kit &amp; Lanyard Pass
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
                    padding: '0.95rem',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.55rem',
                    borderRadius: '12px',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
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
      </main>
    </div>
  );
}
