import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from '@tanstack/react-router';
import QRCode from 'qrcode';
import { trackPageView, trackEvent } from '../lib/analytics';
import {
  ICRAST_REGISTER_SCRIPT_URL,
  type DelegateLookupResult,
} from '../types/icrast';
import {
  QrCode,
  Ticket,
  Calendar,
  Award,
  User,
  Download,
  LogOut,
  Building,
  GraduationCap,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Lock,
  Sparkles,
  Phone,
  FileText,
  Wifi,
  ChevronRight,
} from 'lucide-react';

function normalizePhone(p: unknown): string {
  if (p === null || p === undefined) return '';
  const str = String(p).trim();
  const digits = str.replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

const DELEGATE_STORAGE_KEY = 'icrast_delegate_mobile_session';

export default function IcrastBadgePage() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const initialPhone = queryParams.get('phone') || '';

  const [phoneInput, setPhoneInput] = useState(initialPhone);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [delegate, setDelegate] = useState<DelegateLookupResult | null>(null);

  // Active Tab: pass | schedule | certificate | profile
  const [activeTab, setActiveTab] = useState<'pass' | 'schedule' | 'certificate' | 'profile'>('pass');

  // QR Code States
  const [qrSvg, setQrSvg] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);

  const badgeCardRef = useRef<HTMLDivElement>(null);

  // Auto-load session from query param or localStorage
  useEffect(() => {
    trackPageView('/icrast/delegate', 'ICRAST-26 Delegate Mobile Portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const queryPhone = initialPhone.trim();
    const savedPhone = typeof window !== 'undefined' ? localStorage.getItem(DELEGATE_STORAGE_KEY) || '' : '';

    const phoneToUse = queryPhone || savedPhone;
    if (phoneToUse) {
      setPhoneInput(phoneToUse);
      handleLookup(phoneToUse);
    }
  }, []);

  const generateQrCode = async (phone: unknown, delegateId: unknown) => {
    try {
      const cleanPhone = normalizePhone(phone);
      const cleanId = String(delegateId || '').trim();
      const checkinUrl = `https://icrast.scienceorbitforum.org/checkin?phone=${encodeURIComponent(
        cleanPhone
      )}&id=${encodeURIComponent(cleanId)}`;

      // 1. Generate guaranteed pure SVG (zero canvas dependency)
      const svg = await QRCode.toString(checkinUrl, {
        type: 'svg',
        margin: 1,
        color: {
          dark: '#0b1b33',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      });
      setQrSvg(svg);

      // 2. Generate PNG Data URL for download
      let dataUrl = '';
      try {
        dataUrl = await QRCode.toDataURL(checkinUrl, {
          width: 360,
          margin: 1,
          color: {
            dark: '#0b1b33',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'H',
        });
      } catch (canvasErr) {
        console.warn('Canvas toDataURL fallback to SVG data URI:', canvasErr);
        dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      }
      setQrDataUrl(dataUrl);
      return { svg, dataUrl };
    } catch (err) {
      console.error('QR code generation failed:', err);
      return null;
    }
  };

  // Ensure QR code is generated whenever delegate data is present
  useEffect(() => {
    if (delegate && !qrSvg) {
      generateQrCode(delegate.phone || phoneInput, delegate.delegateId || 'ICRAST26-DELEGATE');
    }
  }, [delegate, qrSvg]);

  const handleLookup = async (phoneToQuery: string) => {
    const cleanPhone = normalizePhone(phoneToQuery);
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit registered mobile number.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(ICRAST_REGISTER_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'delegate_lookup',
          phone: cleanPhone,
        }),
      });

      const data = await response.json();

      if (data && data.ok && data.fullName) {
        setDelegate(data);
        if (typeof window !== 'undefined') {
          localStorage.setItem(DELEGATE_STORAGE_KEY, cleanPhone);
        }
        await generateQrCode(data.phone || cleanPhone, data.delegateId || 'ICRAST26-DELEGATE');
        trackEvent('icrast_delegate_portal', 'lookup', 'success');
      } else {
        setDelegate(null);
        let msg = 'No registration record found for this mobile number. Please check the 10-digit number used during registration.';
        if (data && data.message && data.message !== 'Registration recorded successfully') {
          msg = data.message;
        } else if (data && data.message === 'Registration recorded successfully') {
          msg = 'The registration database has not yet enabled digital badge lookups. Please verify your mobile number or contact the organizers.';
        }
        setErrorMessage(msg);
        trackEvent('icrast_delegate_portal', 'lookup', 'not_found');
      }
    } catch (err) {
      console.error('Delegate lookup failed:', err);
      setErrorMessage(
        'Unable to reach the registration server. Please check your internet connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DELEGATE_STORAGE_KEY);
    }
    setDelegate(null);
    setQrSvg('');
    setQrDataUrl('');
    setPhoneInput('');
    setErrorMessage('');
    setActiveTab('pass');
    window.history.replaceState({}, '', window.location.pathname);
  };

  // High-Resolution 1280x800 Canvas PNG Generator
  const handleDownloadBadgeImage = async () => {
    const qrSource = qrDataUrl || (qrSvg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrSvg)}` : '');
    if (!delegate || !qrSource) return;
    setIsDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const scale = 2;
      const width = 640;
      const height = 400;
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);

      // Deep Conference Navy Background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#071224');
      bgGrad.addColorStop(0.5, '#0b1b33');
      bgGrad.addColorStop(1, '#050c18');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Gold Outer Border
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(10, 10, width - 20, height - 20);

      // Top Ribbon Header
      const headerGrad = ctx.createLinearGradient(0, 0, width, 0);
      headerGrad.addColorStop(0, '#0b1b33');
      headerGrad.addColorStop(0.5, '#1e3a8a');
      headerGrad.addColorStop(1, '#0b1b33');
      ctx.fillStyle = headerGrad;
      ctx.fillRect(10, 10, width - 20, 60);

      // Header Texts
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('ICRAST-26', 28, 42);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('University of Calicut & Science Orbit Forum', 28, 58);

      // Official Delegate Pass Pill
      ctx.fillStyle = 'rgba(212, 175, 55, 0.18)';
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1;
      const pillX = width - 180;
      const pillY = 27;
      ctx.fillRect(pillX, pillY, 152, 26);
      ctx.strokeRect(pillX, pillY, 152, 26);
      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('OFFICIAL DELEGATE PASS', pillX + 9, pillY + 17);

      // Left Column Details
      ctx.fillStyle = '#00e5ff';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(`ID: ${delegate.delegateId || 'ICRAST26-DELEGATE'}`, 28, 106);

      // Full Name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const nameText = delegate.fullName || '';
      ctx.fillText(nameText.length > 32 ? nameText.substring(0, 32) + '...' : nameText, 28, 138);

      // Designation
      ctx.fillStyle = '#93c5fd';
      ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(delegate.designation || 'Conference Attendee', 28, 166);

      // Department & Institution
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const inst = `${delegate.department ? delegate.department + ', ' : ''}${delegate.institution || 'Calicut University'}`;
      ctx.fillText(inst.length > 42 ? inst.substring(0, 42) + '...' : inst, 28, 192);

      // Track / Area of Interest
      if (delegate.areaOfInterest) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(`Track: ${delegate.areaOfInterest}`, 28, 216);
      }

      // Participation Mode Pill
      const isOnline = delegate.participationMode?.includes('Online');
      ctx.fillStyle = isOnline ? 'rgba(59, 130, 246, 0.2)' : 'rgba(34, 197, 94, 0.2)';
      ctx.strokeStyle = isOnline ? '#3b82f6' : '#22c55e';
      ctx.lineWidth = 1;
      ctx.fillRect(28, 242, 230, 24);
      ctx.strokeRect(28, 242, 230, 24);
      ctx.fillStyle = isOnline ? '#93c5fd' : '#86efac';
      ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(delegate.participationMode || 'Offline – On Campus Participation', 36, 258);

      // Status Badge
      const isCheckedIn = delegate.checkinStatus === 'Checked In';
      ctx.fillStyle = isCheckedIn ? 'rgba(34, 197, 94, 0.18)' : 'rgba(212, 175, 55, 0.18)';
      ctx.strokeStyle = isCheckedIn ? '#22c55e' : '#d4af37';
      ctx.lineWidth = 1;
      ctx.fillRect(28, 280, 230, 36);
      ctx.strokeRect(28, 280, 230, 36);
      ctx.fillStyle = isCheckedIn ? '#4ade80' : '#facc15';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(isCheckedIn ? 'CHECKED IN · VERIFIED' : 'STATUS: REGISTERED', 40, 303);

      // Load and Draw Candidate's Specific QR Code
      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        qrImg.onload = () => resolve();
        qrImg.onerror = () => resolve();
        qrImg.src = qrSource;
      });

      // QR Code container
      const qrX = width - 175;
      const qrY = 100;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX, qrY, 145, 145);
      ctx.drawImage(qrImg, qrX + 5, qrY + 5, 135, 135);

      // Bottom Bar
      ctx.fillStyle = 'rgba(11, 27, 51, 0.95)';
      ctx.fillRect(10, height - 42, width - 20, 32);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('Date & Venue: 21–22 Nov 2026 · Calicut University', 25, height - 22);
      ctx.textAlign = 'right';
      ctx.fillText('Science Orbit Forum', width - 25, height - 22);
      ctx.textAlign = 'left';

      // Safe cross-browser download trigger
      const filename = `ICRAST26-Badge-${(delegate.delegateId || 'Delegate').replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;

      canvas.toBlob((blob) => {
        if (!blob) return;
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      }, 'image/png');

      trackEvent('icrast_delegate_portal', 'download_badge', delegate.delegateId || 'unknown');
    } catch (err) {
      console.error('Badge generation failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const isCheckedIn = delegate?.checkinStatus === 'Checked In';

  return (
    <div
      className="icrast-delegate-app-shell"
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
      {/* Top Application Header Bar */}
      <header
        style={{
          height: '60px',
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
                color: '#d4af37',
                fontWeight: 700,
                letterSpacing: '0.04em',
              }}
            >
              Delegate Portal
            </div>
          </div>
        </div>

        {/* Right Action: Delegate ID or Logout */}
        {delegate ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(0, 229, 255, 0.12)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                color: '#00e5ff',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              <span>{delegate.delegateId || 'DELEGATE'}</span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Switch Mobile / Logout"
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
              }}
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <Link
            to="/icrast/register"
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#93c5fd',
              textDecoration: 'none',
              padding: '0.3rem 0.65rem',
              borderRadius: '6px',
              border: '1px solid rgba(147, 197, 253, 0.3)',
            }}
          >
            Register Now
          </Link>
        )}
      </header>

      {/* Main Scrollable View Area */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          paddingBottom: delegate ? '84px' : '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: delegate ? 'flex-start' : 'center',
        }}
      >
        {!delegate ? (
          /* Search / Phone Number Authorization Screen */
          <div
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              padding: '2.5rem 2rem',
              maxWidth: '420px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 175, 55, 0.1)',
              margin: 'auto',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
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
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '0.4rem',
              }}
            >
              Attendee Pass Portal
            </h1>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.68)',
                marginBottom: '1.75rem',
                lineHeight: 1.45,
              }}
            >
              Enter your 10-digit registered mobile number to open your digital badge and conference hub.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLookup(phoneInput);
              }}
            >
              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <Phone
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 255, 255, 0.45)',
                  }}
                />
                <input
                  type="tel"
                  maxLength={15}
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.9rem 1rem 0.9rem 2.75rem',
                    fontSize: '1.05rem',
                    backgroundColor: 'rgba(11, 27, 51, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    outline: 'none',
                    letterSpacing: '0.04em',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="icrast-btn icrast-btn--primary"
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  borderRadius: '12px',
                }}
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={17} className="animate-spin" />
                    <span>Searching Record...</span>
                  </>
                ) : (
                  <>
                    <Search size={17} />
                    <span>Open My Pass</span>
                  </>
                )}
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link
                  to="/icrast/register"
                  style={{
                    fontSize: '0.82rem',
                    color: 'rgba(255, 255, 255, 0.65)',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  New attendee? Register here &rarr;
                </Link>
              </div>
            </form>

            {errorMessage && (
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '0.75rem 0.9rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.18)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
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
        ) : (
          /* Authenticated Delegate Mobile Portal View */
          <div style={{ width: '100%', maxWidth: '580px', margin: '0 auto' }}>
            {/* TAB 1: PASS / TICKET (Live Conference Badge) */}
            {activeTab === 'pass' && (
              <div>
                {/* Badge Card Wrapper */}
                <div
                  ref={badgeCardRef}
                  className="icrast-delegate-badge-wrap"
                  style={{
                    position: 'relative',
                    backgroundColor: '#071224',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 175, 55, 0.15)',
                    marginBottom: '1.25rem',
                  }}
                >
                  {/* Top Golden / Academic Ribbon */}
                  <div
                    style={{
                      background: 'linear-gradient(90deg, #0b1b33 0%, #1e3a8a 50%, #0b1b33 100%)',
                      padding: '0.75rem 1.25rem',
                      borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.65rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img
                        src="/images/icrast-logo-mark.png"
                        alt="ICRAST Logo"
                        style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                      />
                      <div>
                        <div
                          style={{
                            fontSize: '1rem',
                            fontWeight: 800,
                            color: '#ffffff',
                            letterSpacing: '0.04em',
                            lineHeight: 1.2,
                          }}
                        >
                          ICRAST-26
                        </div>
                        <div
                          style={{
                            fontSize: '0.72rem',
                            color: 'rgba(255, 255, 255, 0.72)',
                            letterSpacing: '0.01em',
                          }}
                        >
                          University of Calicut &amp; Science Orbit Forum
                        </div>
                      </div>
                    </div>

                    <div>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.65rem',
                          borderRadius: '9999px',
                          backgroundColor: 'rgba(212, 175, 55, 0.15)',
                          border: '1px solid rgba(212, 175, 55, 0.4)',
                          color: '#d4af37',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                        }}
                      >
                        OFFICIAL DELEGATE PASS
                      </span>
                    </div>
                  </div>

                  {/* Main Badge Content Area */}
                  <div
                    className="icrast-badge-grid"
                    style={{
                      padding: 'clamp(1rem, 2.5vw, 1.35rem)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 'clamp(1rem, 2.5vw, 1.5rem)',
                      alignItems: 'center',
                    }}
                  >
                    {/* Left Column: Delegate Details */}
                    <div style={{ flex: '1 1 260px' }}>
                      {/* Delegate ID Pill */}
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
                          marginBottom: '0.4rem',
                          letterSpacing: '0.05em',
                        }}
                      >
                        <span>ID: {delegate.delegateId || 'ICRAST26-D1001'}</span>
                      </div>

                      {/* Full Name */}
                      <h2
                        style={{
                          fontSize: 'clamp(1.25rem, 2.2vw, 1.55rem)',
                          fontWeight: 800,
                          color: '#ffffff',
                          margin: 0,
                          lineHeight: 1.25,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {delegate.fullName}
                      </h2>

                      {/* Designation / Status */}
                      <div
                        style={{
                          fontSize: '0.88rem',
                          color: '#93c5fd',
                          fontWeight: 600,
                          marginTop: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <GraduationCap size={15} />
                        <span>{delegate.designation || 'Conference Attendee'}</span>
                      </div>

                      {/* Department & Institution */}
                      <div
                        style={{
                          fontSize: '0.82rem',
                          color: 'rgba(255, 255, 255, 0.75)',
                          marginTop: '0.35rem',
                          lineHeight: 1.45,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.35rem',
                        }}
                      >
                        <Building size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>
                          {delegate.department ? `${delegate.department}, ` : ''}
                          <strong>{delegate.institution || 'Calicut, Kerala'}</strong>
                        </span>
                      </div>

                      {/* Area of Interest */}
                      {delegate.areaOfInterest && (
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'rgba(255, 255, 255, 0.55)',
                            marginTop: '0.25rem',
                            paddingLeft: '1.2rem',
                          }}
                        >
                          Track: {delegate.areaOfInterest}
                        </div>
                      )}

                      {/* Participation Mode */}
                      <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backgroundColor:
                              delegate.participationMode?.includes('Online')
                                ? 'rgba(59, 130, 246, 0.15)'
                                : 'rgba(34, 197, 94, 0.15)',
                            border: delegate.participationMode?.includes('Online')
                              ? '1px solid rgba(59, 130, 246, 0.4)'
                              : '1px solid rgba(34, 197, 94, 0.4)',
                            color: delegate.participationMode?.includes('Online')
                              ? '#93c5fd'
                              : '#86efac',
                          }}
                        >
                          <MapPin size={12} />
                          <span>{delegate.participationMode || 'Offline – On Campus Participation'}</span>
                        </span>
                      </div>

                      {/* Live Check-in Status */}
                      <div style={{ marginTop: '0.85rem' }}>
                        {isCheckedIn ? (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.55rem 0.8rem',
                              borderRadius: '10px',
                              backgroundColor: 'rgba(34, 197, 94, 0.12)',
                              border: '1px solid rgba(34, 197, 94, 0.35)',
                              color: '#86efac',
                            }}
                          >
                            <CheckCircle2 size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                                CHECKED IN · VERIFIED
                              </div>
                              <div
                                style={{
                                  fontSize: '0.72rem',
                                  color: 'rgba(255, 255, 255, 0.7)',
                                }}
                              >
                                {delegate.checkinTimestamp
                                  ? `Time: ${delegate.checkinTimestamp}`
                                  : 'Entry verified at registration counter'}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.55rem 0.8rem',
                              borderRadius: '10px',
                              backgroundColor: 'rgba(212, 175, 55, 0.12)',
                              border: '1px solid rgba(212, 175, 55, 0.35)',
                              color: '#fef08a',
                            }}
                          >
                            <Clock size={17} style={{ color: '#d4af37', flexShrink: 0 }} />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                                STATUS: REGISTERED
                              </div>
                              <div
                                style={{
                                  fontSize: '0.72rem',
                                  color: 'rgba(255, 255, 255, 0.7)',
                                }}
                              >
                                Show this pass at counter desk for check-in
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Scannable Vector SVG QR Code */}
                    <div
                      style={{
                        flex: '0 0 auto',
                        marginInline: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: '#ffffff',
                          padding: '0.65rem',
                          borderRadius: '12px',
                          boxShadow: '0 6px 18px rgba(0, 0, 0, 0.35)',
                          display: 'inline-block',
                          textAlign: 'center',
                        }}
                      >
                        {qrSvg ? (
                          <>
                            <div
                              dangerouslySetInnerHTML={{ __html: qrSvg }}
                              style={{
                                width: '140px',
                                height: '140px',
                                display: 'block',
                                borderRadius: '4px',
                                overflow: 'hidden',
                              }}
                            />
                            <div
                              style={{
                                marginTop: '0.35rem',
                                fontSize: '0.72rem',
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                color: '#0b1b33',
                                letterSpacing: '0.04em',
                              }}
                            >
                              {delegate.delegateId || 'ICRAST26-PASS'}
                            </div>
                          </>
                        ) : qrDataUrl ? (
                          <>
                            <img
                              src={qrDataUrl}
                              alt={`QR Check-in Pass for ${delegate.fullName}`}
                              style={{
                                width: '140px',
                                height: '140px',
                                display: 'block',
                                imageRendering: 'pixelated',
                              }}
                            />
                            <div
                              style={{
                                marginTop: '0.35rem',
                                fontSize: '0.72rem',
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                color: '#0b1b33',
                                letterSpacing: '0.04em',
                              }}
                            >
                              {delegate.delegateId || 'ICRAST26-PASS'}
                            </div>
                          </>
                        ) : (
                          <div
                            style={{
                              width: '140px',
                              height: '140px',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#0b1b33',
                              gap: '0.5rem',
                            }}
                          >
                            <RefreshCw size={24} className="animate-spin text-blue-900" />
                            <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>Generating QR...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Event Info Strip */}
                  <div
                    style={{
                      backgroundColor: 'rgba(11, 27, 51, 0.95)',
                      padding: '0.65rem 1.25rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.72rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    <div>
                      <strong>Date &amp; Venue:</strong> 21–22 Nov 2026 · Calicut University
                    </div>
                    <div>
                      <strong>Organised by:</strong> Science Orbit Forum
                    </div>
                  </div>
                </div>

                {/* Action Button: Download Badge Image Only */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={handleDownloadBadgeImage}
                    disabled={isDownloading}
                    className="icrast-btn icrast-btn--primary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.55rem',
                      padding: '0.85rem 1.75rem',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      borderRadius: '12px',
                      width: '100%',
                      maxWidth: '320px',
                      boxShadow: '0 8px 22px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    {isDownloading ? (
                      <>
                        <RefreshCw size={17} className="animate-spin" />
                        <span>Preparing Image...</span>
                      </>
                    ) : (
                      <>
                        <Download size={17} />
                        <span>Download Badge Image</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: SCHEDULE (Upcoming Conference Timetable) */}
            {activeTab === 'schedule' && (
              <div
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '20px',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.35)',
                    color: '#93c5fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  <Calendar size={28} />
                </div>

                <div
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    color: '#d4af37',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginBottom: '0.75rem',
                    letterSpacing: '0.04em',
                  }}
                >
                  SCHEDULE RELEASING SOON
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
                  Conference Timetable &amp; Track Sessions
                </h3>
                <p
                  style={{
                    fontSize: '0.88rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    maxWidth: '420px',
                    margin: '0 auto 1.5rem',
                    lineHeight: 1.5,
                  }}
                >
                  The complete oral presentation slots, keynote schedules, and hall allocations will be published here 24 hours prior to Day 1.
                </p>

                <div
                  style={{
                    backgroundColor: 'rgba(11, 27, 51, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '1rem',
                    textAlign: 'left',
                    fontSize: '0.85rem',
                  }}
                >
                  <div style={{ color: '#00e5ff', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Conference Venue:
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                    Aryabhata Hall, Department of Physics &amp; Campus Auditorium, University of Calicut, Kerala.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CERTIFICATE (Verified E-Certificate Desk) */}
            {activeTab === 'certificate' && (
              <div
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: isCheckedIn ? '1px solid rgba(34, 197, 94, 0.35)' : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '20px',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: isCheckedIn ? 'rgba(34, 197, 94, 0.15)' : 'rgba(212, 175, 55, 0.15)',
                    border: isCheckedIn ? '1px solid rgba(34, 197, 94, 0.35)' : '1px solid rgba(212, 175, 55, 0.35)',
                    color: isCheckedIn ? '#4ade80' : '#d4af37',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  {isCheckedIn ? <Award size={30} /> : <Lock size={26} />}
                </div>

                <div
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    backgroundColor: isCheckedIn ? 'rgba(34, 197, 94, 0.15)' : 'rgba(212, 175, 55, 0.15)',
                    border: isCheckedIn ? '1px solid rgba(34, 197, 94, 0.35)' : '1px solid rgba(212, 175, 55, 0.35)',
                    color: isCheckedIn ? '#86efac' : '#d4af37',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginBottom: '0.75rem',
                    letterSpacing: '0.04em',
                  }}
                >
                  {isCheckedIn ? 'ATTENDANCE VERIFIED' : 'LOCKED UNTIL CHECK-IN'}
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
                  Verifiable E-Certificate Desk
                </h3>
                <p
                  style={{
                    fontSize: '0.88rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    maxWidth: '420px',
                    margin: '0 auto 1.5rem',
                    lineHeight: 1.5,
                  }}
                >
                  {isCheckedIn
                    ? 'Your conference participation certificate is queued and will be generated with authorized Calicut University signatures post-conference.'
                    : 'To prevent proxy participation, certificates are unlocked only after your QR pass is verified at the registration desk on conference day.'}
                </p>

                <div
                  style={{
                    backgroundColor: 'rgba(11, 27, 51, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '1rem',
                    textAlign: 'left',
                    fontSize: '0.82rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#ffffff', marginBottom: '0.25rem' }}>
                    Candidate Registered: {delegate.fullName}
                  </div>
                  <div>Delegate ID: {delegate.delegateId || 'ICRAST26-DELEGATE'}</div>
                  <div style={{ marginTop: '0.25rem', color: isCheckedIn ? '#86efac' : '#facc15' }}>
                    Status: {isCheckedIn ? 'Checked in at registration desk ✓' : 'Pending in-person check-in'}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PROFILE / INFO */}
            {activeTab === 'profile' && (
              <div
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '20px',
                  padding: '1.75rem 1.5rem',
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 229, 255, 0.15)',
                      border: '1px solid rgba(0, 229, 255, 0.35)',
                      color: '#00e5ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem',
                      fontWeight: 800,
                    }}
                  >
                    {delegate.fullName ? delegate.fullName.charAt(0).toUpperCase() : 'D'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      {delegate.fullName}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: '#93c5fd', marginTop: '2px' }}>
                      {delegate.designation || 'Conference Delegate'}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(11, 27, 51, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '1.1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                    fontSize: '0.85rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.72rem', fontWeight: 600 }}>
                      DELEGATE ID
                    </div>
                    <strong style={{ fontFamily: 'monospace', color: '#00e5ff' }}>
                      {delegate.delegateId || 'ICRAST26-DELEGATE'}
                    </strong>
                  </div>

                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.72rem', fontWeight: 600 }}>
                      INSTITUTION &amp; DEPARTMENT
                    </div>
                    <strong style={{ color: '#ffffff' }}>
                      {delegate.department ? `${delegate.department}, ` : ''}
                      {delegate.institution || 'University of Calicut'}
                    </strong>
                  </div>

                  {delegate.areaOfInterest && (
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.72rem', fontWeight: 600 }}>
                        TRACK / RESEARCH AREA
                      </div>
                      <strong style={{ color: '#ffffff' }}>{delegate.areaOfInterest}</strong>
                    </div>
                  )}

                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.72rem', fontWeight: 600 }}>
                      PARTICIPATION MODE
                    </div>
                    <strong style={{ color: '#86efac' }}>
                      {delegate.participationMode || 'Offline – On Campus Participation'}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    color: '#fca5a5',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                  }}
                >
                  <LogOut size={16} />
                  <span>Log Out / Switch Mobile Number</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Fixed Bottom Mobile App Navigation Bar (When Logged In) */}
      {delegate && (
        <nav
          className="icrast-mobile-bottom-nav"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '66px',
            backgroundColor: 'rgba(11, 27, 51, 0.96)',
            backdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            zIndex: 50,
            maxWidth: '580px',
            marginInline: 'auto',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          {/* Tab 1: Pass */}
          <button
            type="button"
            onClick={() => setActiveTab('pass')}
            style={{
              flex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'pass' ? '#d4af37' : 'rgba(255, 255, 255, 0.55)',
              transition: 'color 0.15s ease',
            }}
          >
            <Ticket size={20} strokeWidth={activeTab === 'pass' ? 2.5 : 2} />
            <span style={{ fontSize: '0.72rem', fontWeight: activeTab === 'pass' ? 700 : 500 }}>
              Pass
            </span>
          </button>

          {/* Tab 2: Schedule */}
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            style={{
              flex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'schedule' ? '#00e5ff' : 'rgba(255, 255, 255, 0.55)',
              transition: 'color 0.15s ease',
            }}
          >
            <Calendar size={20} strokeWidth={activeTab === 'schedule' ? 2.5 : 2} />
            <span style={{ fontSize: '0.72rem', fontWeight: activeTab === 'schedule' ? 700 : 500 }}>
              Schedule
            </span>
          </button>

          {/* Tab 3: Certificate */}
          <button
            type="button"
            onClick={() => setActiveTab('certificate')}
            style={{
              flex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'certificate' ? '#86efac' : 'rgba(255, 255, 255, 0.55)',
              transition: 'color 0.15s ease',
            }}
          >
            <Award size={20} strokeWidth={activeTab === 'certificate' ? 2.5 : 2} />
            <span style={{ fontSize: '0.72rem', fontWeight: activeTab === 'certificate' ? 700 : 500 }}>
              Certificate
            </span>
          </button>

          {/* Tab 4: Profile */}
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            style={{
              flex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'profile' ? '#93c5fd' : 'rgba(255, 255, 255, 0.55)',
              transition: 'color 0.15s ease',
            }}
          >
            <User size={20} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
            <span style={{ fontSize: '0.72rem', fontWeight: activeTab === 'profile' ? 700 : 500 }}>
              Profile
            </span>
          </button>
        </nav>
      )}
    </div>
  );
}
