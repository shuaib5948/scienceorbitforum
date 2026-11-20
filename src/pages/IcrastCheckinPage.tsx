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
  Unlock,
  RefreshCw,
  ArrowRight,
  Camera,
  X,
  PackageCheck,
  Building,
  LogOut,
  Phone,
  Search,
  Clock,
  UserCheck,
  KeyRound,
  ShieldCheck,
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

  // Mode: 'camera' or 'manual'
  const [activeMode, setActiveMode] = useState<'camera' | 'manual'>('camera');
  const [manualPhoneInput, setManualPhoneInput] = useState('');

  // Live Stats (Registration & Checked-in Count)
  const [stats, setStats] = useState<{ total: number; checkedIn: number } | null>(null);
  const [isFetchingStats, setIsFetchingStats] = useState(false);

  // Checkin Action & Modal
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkinResult, setCheckinResult] = useState<DelegateCheckinResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Camera QR Scanner
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
    if (isScannerRunningRef.current || activeMode !== 'camera') return;
    setCameraError(null);

    // Delay slightly to ensure DOM element #icrast-reader exists
    setTimeout(() => {
      try {
        const readerEl = document.getElementById('icrast-reader');
        if (!readerEl) return;

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
    if (activeMode !== 'camera') return;
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

  // Launch camera automatically whenever unlocked, camera mode is active, and modal is closed
  useEffect(() => {
    if (pinVerified && !isModalOpen && activeMode === 'camera') {
      startScanner();
    } else {
      stopScanner();
    }
    return () => {
      stopScanner();
    };
  }, [pinVerified, activeMode, isModalOpen]);

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
      setErrorMessage('Please enter or scan a valid 10-digit mobile number.');
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
          data.message || 'No attendee found matching this number. Please verify registration.'
        );
        trackEvent('icrast_counter_checkin', 'action', 'not_found');
        resumeScanner();
      }
    } catch (err) {
      console.error('Checkin failed:', err);
      setErrorMessage(
        'Connection error reaching the database. Please check your internet connection.'
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
    setManualPhoneInput('');
    window.history.replaceState({}, '', window.location.pathname);
    // Instantly resume camera for next delegate
    if (activeMode === 'camera') {
      resumeScanner();
    }
  };

  return (
    <div
      className="icrast-checkin-standalone-app"
      style={{
        minHeight: '100dvh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F4F7FB',
        color: '#172033',
        fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
      }}
    >
      {/* Dynamic Keyframe & Viewfinder CSS */}
      <style>{`
        #icrast-reader {
          border: none !important;
          background: #0b192c !important;
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
          50% { opacity: 0.4; transform: scale(0.9); }
        }
      `}</style>

      {/* Top Application Header Bar matching Delegate Portal */}
      <header
        style={{
          height: '60px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #EAEFF5',
          boxShadow: '0 2px 10px rgba(18, 59, 112, 0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.25rem',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        {/* Brand: ICRAST Logo & Title */}
        <Link
          to="/icrast/badge"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
          }}
        >
          <img
            src="/images/icrast-logo-mark.png"
            alt="ICRAST Logo"
            style={{
              width: '32px',
              height: '32px',
              objectFit: 'contain',
            }}
          />
          <div>
            <div
              style={{
                fontSize: '0.96rem',
                fontWeight: 800,
                color: '#123B70',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              ICRAST-26
            </div>
            <div
              style={{
                fontSize: '0.72rem',
                color: '#5A6E85',
                fontWeight: 600,
                letterSpacing: '0.01em',
              }}
            >
              Check-in Desk
            </div>
          </div>
        </Link>

        {/* Right Side: Live Registration Count & Lock Button */}
        {pinVerified ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            {/* Live Registration Count Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                backgroundColor: '#EDF3FA',
                border: '1px solid #E2E8F0',
                color: '#123B70',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 8px #10B981',
                  animation: 'icrast-pulse 2s infinite',
                }}
              />
              <span style={{ color: '#5A6E85', fontSize: '0.74rem', fontWeight: 600 }}>Checked In:</span>
              <strong style={{ color: '#123B70', fontFamily: 'monospace', fontSize: '0.82rem' }}>
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
                  color: '#185ADB',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 0 0 2px',
                }}
              >
                <RefreshCw size={12} className={isFetchingStats ? 'animate-spin' : ''} />
              </button>
            </div>

            {/* Lock Desk Button */}
            <button
              type="button"
              onClick={handleLock}
              title="Lock Check-in Desk"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.38rem 0.75rem',
                borderRadius: '9999px',
                backgroundColor: '#FEE2E2',
                border: 'none',
                color: '#DC2626',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        ) : (
          <Link
            to="/icrast/badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.38rem 0.8rem',
              borderRadius: '9999px',
              backgroundColor: '#EDF3FA',
              color: '#123B70',
              fontSize: '0.78rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <span>Delegate Portal</span>
          </Link>
        )}
      </header>

      {/* Main Full-Height App Area */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: pinVerified ? 'flex-start' : 'center',
          padding: '1.25rem 1rem',
          position: 'relative',
        }}
      >
        {/* PIN Authorization Screen (When Locked) */}
        {!pinVerified ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #EAEFF5',
              borderRadius: '24px',
              padding: '2.5rem 2rem',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 16px 40px rgba(18, 59, 112, 0.08), 0 2px 8px rgba(0, 0, 0, 0.03)',
              margin: 'auto',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                backgroundColor: '#EDF3FA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <img
                src="/images/icrast-logo-mark.png"
                alt="ICRAST Logo"
                style={{ width: '40px', height: '40px', objectFit: 'contain' }}
              />
            </div>

            <h1
              style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#123B70',
                marginBottom: '0.35rem',
                letterSpacing: '-0.02em',
              }}
            >
              Desk Authorization
            </h1>
            <p
              style={{
                fontSize: '0.85rem',
                color: '#5A6E85',
                marginBottom: '1.75rem',
                lineHeight: 1.45,
              }}
            >
              Enter authorized volunteer coordinator PIN to unlock the live scanner desk.
            </p>

            <form onSubmit={handleVerifyPin}>
              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <KeyRound
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94A3B8',
                  }}
                />
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.9rem 1rem 0.9rem 2.75rem',
                    textAlign: 'center',
                    fontSize: '1.4rem',
                    letterSpacing: '0.35em',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    borderRadius: '12px',
                    color: '#123B70',
                    outline: 'none',
                    fontWeight: 700,
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.92rem 1.25rem',
                  backgroundColor: '#185ADB',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(24, 90, 219, 0.25)',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <Unlock size={17} />
                <span>Unlock Scanner Desk</span>
              </button>
            </form>

            {pinError && (
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '0.75rem 0.9rem',
                  borderRadius: '10px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#DC2626',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  textAlign: 'left',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{pinError}</span>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link
                to="/icrast/badge"
                style={{
                  fontSize: '0.82rem',
                  color: '#5A6E85',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                &larr; Switch to Delegate Pass Portal
              </Link>
            </div>
          </div>
        ) : (
          /* Volunteer Active Desk View (Matching Minimal Clean MICE UI) */
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '0.5rem',
            }}
          >
            {/* Mode Segmented Control: QR Scanner vs Manual Lookup */}
            <div
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                padding: '4px',
                borderRadius: '14px',
                backgroundColor: '#EAEFF5',
                marginBottom: '1.25rem',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveMode('camera');
                  setErrorMessage('');
                }}
                style={{
                  padding: '0.65rem 0.8rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: activeMode === 'camera' ? '#ffffff' : 'transparent',
                  color: activeMode === 'camera' ? '#123B70' : '#5A6E85',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                  boxShadow: activeMode === 'camera' ? '0 2px 6px rgba(18, 59, 112, 0.08)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Camera size={16} color={activeMode === 'camera' ? '#185ADB' : '#5A6E85'} />
                <span>QR Scanner</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMode('manual');
                  stopScanner();
                  setErrorMessage('');
                }}
                style={{
                  padding: '0.65rem 0.8rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: activeMode === 'manual' ? '#ffffff' : 'transparent',
                  color: activeMode === 'manual' ? '#123B70' : '#5A6E85',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                  boxShadow: activeMode === 'manual' ? '0 2px 6px rgba(18, 59, 112, 0.08)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Search size={16} color={activeMode === 'manual' ? '#185ADB' : '#5A6E85'} />
                <span>Manual Entry</span>
              </button>
            </div>

            {/* TAB 1: Live Camera Scanner */}
            {activeMode === 'camera' && (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Viewfinder Outer Card */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    backgroundColor: '#ffffff',
                    border: '1px solid #EAEFF5',
                    borderRadius: '24px',
                    padding: '0.75rem',
                    boxShadow: '0 16px 45px rgba(18, 59, 112, 0.09), 0 2px 10px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  {/* Viewfinder Inner Video Frame */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      backgroundColor: '#0a192f',
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

                    {/* High-Tech Clean Reticles in Royal Blue */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: '22px',
                        pointerEvents: 'none',
                        zIndex: 10,
                      }}
                    >
                      {/* Top-Left */}
                      <span
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '28px',
                          height: '28px',
                          borderTop: '3px solid #185ADB',
                          borderLeft: '3px solid #185ADB',
                          borderTopLeftRadius: '8px',
                          filter: 'drop-shadow(0 0 6px rgba(24, 90, 219, 0.6))',
                        }}
                      />
                      {/* Top-Right */}
                      <span
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: '28px',
                          height: '28px',
                          borderTop: '3px solid #185ADB',
                          borderRight: '3px solid #185ADB',
                          borderTopRightRadius: '8px',
                          filter: 'drop-shadow(0 0 6px rgba(24, 90, 219, 0.6))',
                        }}
                      />
                      {/* Bottom-Left */}
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '28px',
                          height: '28px',
                          borderBottom: '3px solid #185ADB',
                          borderLeft: '3px solid #185ADB',
                          borderBottomLeftRadius: '8px',
                          filter: 'drop-shadow(0 0 6px rgba(24, 90, 219, 0.6))',
                        }}
                      />
                      {/* Bottom-Right */}
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: '28px',
                          height: '28px',
                          borderBottom: '3px solid #185ADB',
                          borderRight: '3px solid #185ADB',
                          borderBottomRightRadius: '8px',
                          filter: 'drop-shadow(0 0 6px rgba(24, 90, 219, 0.6))',
                        }}
                      />

                      {/* Smooth Animated Royal Blue Laser Sweep */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '4px',
                          right: '4px',
                          height: '2px',
                          background: 'linear-gradient(90deg, transparent 0%, #2583E8 50%, transparent 100%)',
                          boxShadow: '0 0 12px 2px rgba(37, 131, 232, 0.7)',
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
                          backgroundColor: 'rgba(255, 255, 255, 0.94)',
                          backdropFilter: 'blur(6px)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.85rem',
                          color: '#123B70',
                          zIndex: 25,
                        }}
                      >
                        <RefreshCw size={34} className="animate-spin text-blue-600" color="#185ADB" />
                        <span style={{ fontSize: '0.98rem', fontWeight: 800, letterSpacing: '-0.01em', color: '#123B70' }}>
                          Verifying Attendee Pass...
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Indicator Pill below Viewfinder */}
                <div style={{ marginTop: '1.25rem', textAlign: 'center', width: '100%' }}>
                  {cameraError ? (
                    <div
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: '14px',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        color: '#DC2626',
                        fontSize: '0.85rem',
                        textAlign: 'center',
                      }}
                    >
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.82rem', fontWeight: 600 }}>{cameraError}</p>
                      <button
                        type="button"
                        onClick={resumeScanner}
                        style={{
                          backgroundColor: '#DC2626',
                          border: 'none',
                          color: '#ffffff',
                          borderRadius: '8px',
                          padding: '0.4rem 0.85rem',
                          fontSize: '0.8rem',
                          fontWeight: 700,
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
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        color: '#DC2626',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <AlertCircle size={16} style={{ flexShrink: 0 }} />
                      <span>{errorMessage}</span>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.45rem 1.1rem',
                        borderRadius: '9999px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 2px 8px rgba(18, 59, 112, 0.04)',
                        fontSize: '0.82rem',
                        color: '#5A6E85',
                        fontWeight: 600,
                      }}
                    >
                      <Camera size={14} style={{ color: '#185ADB' }} />
                      <span>Align candidate digital QR badge inside frame</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Manual Search / Phone Number Checkin */}
            {activeMode === 'manual' && (
              <div
                style={{
                  width: '100%',
                  backgroundColor: '#ffffff',
                  border: '1px solid #EAEFF5',
                  borderRadius: '24px',
                  padding: '2rem 1.5rem',
                  boxShadow: '0 16px 45px rgba(18, 59, 112, 0.08), 0 2px 10px rgba(0, 0, 0, 0.03)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '16px',
                    backgroundColor: '#EDF3FA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.15rem',
                    color: '#185ADB',
                  }}
                >
                  <UserCheck size={26} />
                </div>

                <h2
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#123B70',
                    marginBottom: '0.35rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Manual Attendee Check-In
                </h2>
                <p
                  style={{
                    fontSize: '0.84rem',
                    color: '#5A6E85',
                    marginBottom: '1.5rem',
                    lineHeight: 1.45,
                  }}
                >
                  If delegate pass cannot be scanned, enter their registered 10-digit mobile number.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    performCheckin(manualPhoneInput, sessionStorage.getItem(VOLUNTEER_STORAGE_KEY) || '2026');
                  }}
                >
                  <div style={{ position: 'relative', marginBottom: '1.15rem' }}>
                    <Phone
                      size={18}
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94A3B8',
                      }}
                    />
                    <input
                      type="tel"
                      maxLength={15}
                      value={manualPhoneInput}
                      onChange={(e) => setManualPhoneInput(e.target.value)}
                      placeholder="Enter 10-digit mobile number"
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '0.9rem 1rem 0.9rem 2.75rem',
                        fontSize: '1.02rem',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #CBD5E1',
                        borderRadius: '12px',
                        color: '#172033',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    style={{
                      width: '100%',
                      padding: '0.92rem 1.25rem',
                      backgroundColor: '#185ADB',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.55rem',
                      cursor: isProcessing ? 'not-allowed' : 'pointer',
                      opacity: isProcessing ? 0.8 : 1,
                      boxShadow: '0 4px 14px rgba(24, 90, 219, 0.25)',
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw size={17} className="animate-spin" />
                        <span>Verifying Database...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={17} />
                        <span>Verify &amp; Check In</span>
                      </>
                    )}
                  </button>
                </form>

                {errorMessage && (
                  <div
                    style={{
                      marginTop: '1.25rem',
                      padding: '0.75rem 0.9rem',
                      borderRadius: '10px',
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FCA5A5',
                      color: '#DC2626',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      textAlign: 'left',
                    }}
                  >
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Verification Success / Already Checked In Modal (Minimal Apple/MICE Style) */}
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
              backgroundColor: 'rgba(18, 59, 112, 0.38)',
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
                maxWidth: '460px',
                backgroundColor: '#ffffff',
                border: '1px solid #EAEFF5',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(18, 59, 112, 0.2), 0 4px 16px rgba(0, 0, 0, 0.04)',
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
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#EDF3FA',
                  border: 'none',
                  color: '#123B70',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <X size={16} />
              </button>

              {/* Top Colored Status Ribbon */}
              <div
                style={{
                  backgroundColor: checkinResult.alreadyCheckedIn ? '#FFFBEB' : '#ECFDF5',
                  borderBottom: checkinResult.alreadyCheckedIn ? '1px solid #FDE68A' : '1px solid #A7F3D0',
                  padding: '1rem 1.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                }}
              >
                {checkinResult.alreadyCheckedIn ? (
                  <AlertTriangle size={22} style={{ color: '#D97706', flexShrink: 0 }} />
                ) : (
                  <CheckCircle2 size={22} style={{ color: '#059669', flexShrink: 0 }} />
                )}
                <span
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: checkinResult.alreadyCheckedIn ? '#92400E' : '#065F46',
                  }}
                >
                  {checkinResult.alreadyCheckedIn
                    ? 'ALREADY CHECKED IN PREVIOUSLY'
                    : 'CHECK-IN VERIFIED & CONFIRMED'}
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
                      padding: '0.22rem 0.65rem',
                      borderRadius: '6px',
                      backgroundColor: '#EDF3FA',
                      border: '1px solid #E2E8F0',
                      color: '#185ADB',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      marginBottom: '0.45rem',
                      letterSpacing: '0.02em',
                    }}
                  >
                    <span>ID: {checkinResult.delegateId || 'ICRAST26-DELEGATE'}</span>
                  </div>

                  <h2
                    style={{
                      fontSize: 'clamp(1.4rem, 3.4vw, 1.75rem)',
                      fontWeight: 850,
                      color: '#081e3e',
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
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #EAEFF5',
                    borderRadius: '16px',
                    padding: '1rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '0.85rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.85rem',
                  }}
                >
                  <div>
                    <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      INSTITUTION
                    </div>
                    <strong
                      style={{
                        color: '#123B70',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        marginTop: '3px',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                      }}
                    >
                      <Building size={15} style={{ color: '#185ADB', flexShrink: 0 }} />
                      <span>{checkinResult.institution || 'University of Calicut'}</span>
                    </strong>
                  </div>

                  <div>
                    <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      RECORDED TIMESTAMP
                    </div>
                    <strong
                      style={{
                        color: '#123B70',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        marginTop: '3px',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                      }}
                    >
                      <Clock size={15} style={{ color: '#185ADB', flexShrink: 0 }} />
                      <span>{checkinResult.checkinTimestamp || 'Recorded Just Now'}</span>
                    </strong>
                  </div>
                </div>

                {/* Delegate Kit Dispatch Highlight Banner */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.9rem 1rem',
                    borderRadius: '14px',
                    backgroundColor: checkinResult.alreadyCheckedIn ? '#FFFBEB' : '#F0FDF4',
                    border: checkinResult.alreadyCheckedIn
                      ? '1px solid #FDE68A'
                      : '1px solid #BBF7D0',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: checkinResult.alreadyCheckedIn ? '#FEF3C7' : '#DCFCE7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: checkinResult.alreadyCheckedIn ? '#D97706' : '#059669',
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
                        color: checkinResult.alreadyCheckedIn ? '#92400E' : '#065F46',
                      }}
                    >
                      Registration Desk Action
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#123B70' }}>
                      Issue Delegate Kit &amp; Lanyard Pass
                    </div>
                  </div>
                </div>

                {/* Primary Next Scan Button */}
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    width: '100%',
                    padding: '0.95rem',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    backgroundColor: '#185ADB',
                    color: '#ffffff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.55rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 14px rgba(24, 90, 219, 0.25)',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
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
