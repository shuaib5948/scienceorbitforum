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
  Copy,
  Check,
  ShieldCheck,
  BadgeCheck,
  Compass,
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
  const [copiedId, setCopiedId] = useState(false);

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
          dark: '#071224',
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
            dark: '#071224',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'H',
        });
      } catch (canvasErr) {
        console.warn('Canvas toDataURL failed, using SVG fallback:', canvasErr);
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

  const handleCopyId = () => {
    if (!delegate?.delegateId) return;
    navigator.clipboard?.writeText(delegate.delegateId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // High-Resolution 1364x2048 Canvas PNG Generator matching Official Conference Badge Template
  const handleDownloadBadgeImage = async () => {
    const qrSource = qrDataUrl || (qrSvg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrSvg)}` : '');
    if (!delegate || !qrSource) return;
    setIsDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Native resolution of the official badge is 682 x 1024, scaled 2x for retina print quality (1364 x 2048)
      const scale = 2;
      const width = 682;
      const height = 1024;
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);

      // 1. Draw Official Template Background
      const templateImg = new Image();
      templateImg.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        templateImg.onload = () => resolve();
        templateImg.onerror = () => resolve();
        templateImg.src = '/images/icrast-badge-template.png';
      });
      ctx.drawImage(templateImg, 0, 0, width, height);

      // 2. Dynamic Candidate Full Name (Centered at x = 341, y = 542)
      ctx.fillStyle = '#081e3e';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fullName = String(delegate.fullName || '').trim();
      if (fullName.length > 28) {
        ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      } else if (fullName.length > 22) {
        ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
      } else {
        ctx.font = 'bold 34px "Plus Jakarta Sans", sans-serif';
      }
      ctx.fillText(fullName, 341, 542);

      // 3. Dynamic Campus / Institution with Cap Icon & Divider
      const institutionText = String(delegate.institution || 'University of Calicut').trim();
      const capImg = new Image();
      capImg.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        capImg.onload = () => resolve();
        capImg.onerror = () => resolve();
        capImg.src = '/images/icrast-badge-cap.png';
      });

      // Wrap long institution name into up to 2 lines cleanly
      ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
      const words = institutionText.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      for (const word of words) {
        if ((currentLine + ' ' + word).trim().length <= 26) {
          currentLine = (currentLine + ' ' + word).trim();
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);
      const displayLines = lines.slice(0, 2);

      const maxTextWidth = Math.max(...displayLines.map((l) => ctx.measureText(l).width));
      const capWidth = 32;
      const capHeight = 24;
      const gap = 10;
      const dividerWidth = 1.5;
      const totalGroupWidth = capWidth + gap + dividerWidth + gap + maxTextWidth;
      const startX = (width - totalGroupWidth) / 2;
      const centerY = 604;

      // Draw Cap Icon
      if (capImg.complete && capImg.naturalWidth > 0) {
        ctx.drawImage(capImg, startX, centerY - capHeight / 2, capWidth, capHeight);
      }

      // Draw Vertical Divider Line
      ctx.fillStyle = '#081e3e';
      ctx.fillRect(startX + capWidth + gap, centerY - 14, dividerWidth, 28);

      // Draw Institution Text Lines
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#081e3e';
      const textStartX = startX + capWidth + gap + dividerWidth + gap;
      if (displayLines.length === 1) {
        ctx.fillText(displayLines[0], textStartX, centerY);
      } else {
        ctx.fillText(displayLines[0], textStartX, centerY - 9);
        ctx.fillText(displayLines[1], textStartX, centerY + 11);
      }

      // 4. Draw Scannable Vector QR Code into the Official Cyan Rounded Frame
      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        qrImg.onload = () => resolve();
        qrImg.onerror = () => resolve();
        qrImg.src = qrSource;
      });

      // Official cyan box is centered at x = 350, y = 760 with ~174px width & height
      const qrSize = 174;
      const qrX = 350 - qrSize / 2;
      const qrY = 760 - qrSize / 2;
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

      // 5. Trigger High-Resolution Download
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
        background: 'radial-gradient(circle at 50% 0%, rgba(30, 58, 138, 0.22) 0%, rgba(3, 7, 18, 0.96) 65%, #030712 100%)',
        color: '#ffffff',
        fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Top Application Header Bar */}
      <header
        style={{
          height: '62px',
          backgroundColor: 'rgba(7, 18, 36, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.1rem',
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
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))',
            }}
          />
          <div>
            <div
              style={{
                fontSize: '0.98rem',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
              }}
            >
              ICRAST-26
            </div>
            <div
              style={{
                fontSize: '0.68rem',
                color: '#00e5ff',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
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
              onClick={handleCopyId}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.22rem 0.65rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(0, 229, 255, 0.1)',
                border: '1px solid rgba(0, 229, 255, 0.35)',
                color: '#00e5ff',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              title="Tap to copy Delegate ID"
            >
              <span>{delegate.delegateId || 'DELEGATE'}</span>
              {copiedId ? <Check size={12} color="#4ade80" /> : <Copy size={12} opacity={0.7} />}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Switch Account / Logout"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                width: '34px',
                height: '34px',
                color: 'rgba(255, 255, 255, 0.75)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)')}
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <Link
            to="/icrast/register"
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#00e5ff',
              textDecoration: 'none',
              padding: '0.35rem 0.8rem',
              borderRadius: '8px',
              border: '1px solid rgba(0, 229, 255, 0.35)',
              backgroundColor: 'rgba(0, 229, 255, 0.1)',
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
          paddingBottom: delegate ? '88px' : '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: delegate ? 'flex-start' : 'center',
        }}
      >
        {!delegate ? (
          /* Phone Authorization Screen (When Logged Out) */
          <div
            style={{
              backgroundColor: 'rgba(11, 23, 44, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              padding: '2.5rem 2rem',
              maxWidth: '420px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(212, 175, 55, 0.12)',
              margin: 'auto',
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: 'rgba(212, 175, 55, 0.12)',
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
                style={{ width: '42px', height: '42px', objectFit: 'contain' }}
              />
            </div>

            <h1
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '0.4rem',
                letterSpacing: '-0.02em',
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
              Enter your 10-digit registered mobile number to open your digital badge pass.
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
                    backgroundColor: 'rgba(6, 16, 32, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    outline: 'none',
                    letterSpacing: '0.04em',
                    fontFamily: '"JetBrains Mono", monospace',
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

              <div style={{ textAlign: 'center', marginTop: '1.1rem' }}>
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
            {/* TAB 1: PASS / TICKET (Official Conference Portrait Badge) */}
            {activeTab === 'pass' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                {/* Official Portrait Badge Card */}
                <div
                  ref={badgeCardRef}
                  className="icrast-badge-portrait-wrap"
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '380px',
                    aspectRatio: '682 / 1024',
                    margin: '0 auto 1.25rem',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 45px rgba(0, 168, 255, 0.25)',
                    border: '1px solid rgba(0, 168, 255, 0.35)',
                    backgroundImage: "url('/images/icrast-badge-template.png')",
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    userSelect: 'none',
                  }}
                >
                  {/* 1. Dynamic Candidate Full Name */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '52.8%',
                      left: '6%',
                      right: '6%',
                      textAlign: 'center',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: 800,
                        fontSize: 'clamp(1.05rem, 4.3vw, 1.42rem)',
                        color: '#081e3e',
                        letterSpacing: '-0.015em',
                        lineHeight: 1.18,
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: delegate.fullName && delegate.fullName.length > 28 ? 'normal' : 'nowrap',
                      }}
                    >
                      {delegate.fullName}
                    </div>
                  </div>

                  {/* 2. Dynamic Campus / Institution with Cap Icon & Divider */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '59.0%',
                      left: '7%',
                      right: '7%',
                      transform: 'translateY(-50%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      pointerEvents: 'none',
                    }}
                  >
                    <img
                      src="/images/icrast-badge-cap.png"
                      alt="Campus"
                      style={{
                        width: 'clamp(20px, 4.5vw, 24px)',
                        height: 'auto',
                        objectFit: 'contain',
                        flexShrink: 0,
                      }}
                    />
                    <div
                      style={{
                        width: '1.5px',
                        height: 'clamp(18px, 3.8vw, 24px)',
                        backgroundColor: '#081e3e',
                        flexShrink: 0,
                      }}
                    />
                    <div
                      style={{
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: 600,
                        fontSize: 'clamp(0.68rem, 2.5vw, 0.82rem)',
                        color: '#081e3e',
                        lineHeight: 1.25,
                        textAlign: 'left',
                        maxHeight: '40px',
                        overflow: 'hidden',
                        maxWidth: '220px',
                      }}
                    >
                      {delegate.institution || 'University of Calicut'}
                    </div>
                  </div>

                  {/* 3. Dynamic Vector SVG QR Code in the Official Cyan Rounded Frame */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '74.2%',
                      left: '51.3%',
                      transform: 'translate(-50%, -50%)',
                      width: '25.5%',
                      aspectRatio: '1 / 1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    {qrSvg ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: qrSvg }}
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'block',
                        }}
                      />
                    ) : qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt={`QR Pass for ${delegate.fullName}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'block',
                          imageRendering: 'pixelated',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <RefreshCw size={24} className="animate-spin text-blue-900" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary Download Button & Status */}
                <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={handleDownloadBadgeImage}
                    disabled={isDownloading}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.6rem',
                      padding: '0.9rem 1.6rem',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      borderRadius: '14px',
                      width: '100%',
                      background: 'linear-gradient(135deg, #0062ff 0%, #00a8ff 100%)',
                      color: '#ffffff',
                      border: 'none',
                      cursor: isDownloading ? 'wait' : 'pointer',
                      boxShadow: '0 10px 28px rgba(0, 168, 255, 0.35)',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    {isDownloading ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        <span>Generating High-Res Badge...</span>
                      </>
                    ) : (
                      <>
                        <Download size={18} />
                        <span>Download Official Badge (PNG)</span>
                      </>
                    )}
                  </button>

                  {/* Verification Status Pill */}
                  <div
                    style={{
                      padding: '0.85rem 1.1rem',
                      borderRadius: '16px',
                      backgroundColor: isCheckedIn ? 'rgba(34, 197, 94, 0.12)' : 'rgba(0, 168, 255, 0.1)',
                      border: isCheckedIn ? '1px solid rgba(34, 197, 94, 0.35)' : '1px solid rgba(0, 168, 255, 0.28)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    {isCheckedIn ? (
                      <ShieldCheck size={22} style={{ color: '#4ade80', flexShrink: 0 }} />
                    ) : (
                      <QrCode size={22} style={{ color: '#00e5ff', flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.84rem',
                          fontWeight: 800,
                          color: isCheckedIn ? '#4ade80' : '#00e5ff',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {isCheckedIn ? 'CHECKED IN · ATTENDANCE VERIFIED' : 'OFFICIAL DELEGATE PASS ACTIVE'}
                      </div>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: 'rgba(255, 255, 255, 0.72)',
                          marginTop: '2px',
                          lineHeight: 1.35,
                        }}
                      >
                        {isCheckedIn
                          ? `Entry verified at ${delegate.checkinTimestamp || 'Calicut University desk'}`
                          : 'Show this digital pass or downloaded badge at the counter desk on conference day.'}
                      </div>
                    </div>
                  </div>

                  {/* Quick Metadata Capsule */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.95rem',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={13} style={{ color: '#00e5ff' }} />
                      <span>Calicut University · 21–22 Nov</span>
                    </div>
                    <div
                      onClick={handleCopyId}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        color: '#00e5ff',
                        fontFamily: '"JetBrains Mono", monospace',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                      title="Tap to copy"
                    >
                      <span>{delegate.delegateId || 'ICRAST26'}</span>
                      {copiedId ? <Check size={12} color="#4ade80" /> : <Copy size={12} opacity={0.7} />}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SCHEDULE (Upcoming Conference Timetable) */}
            {activeTab === 'schedule' && (
              <div
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '24px',
                  padding: '2.2rem 1.5rem',
                  textAlign: 'center',
                  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5)',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(59, 130, 246, 0.12)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    color: '#93c5fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  <Calendar size={30} />
                </div>

                <div
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.8rem',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(212, 175, 55, 0.12)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    color: '#d4af37',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    marginBottom: '0.85rem',
                    letterSpacing: '0.04em',
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  TIMETABLE RELEASING 20 NOV 2026
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
                  Conference Schedule &amp; Oral Tracks
                </h3>
                <p
                  style={{
                    fontSize: '0.88rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    maxWidth: '440px',
                    margin: '0 auto 1.75rem',
                    lineHeight: 1.55,
                  }}
                >
                  The complete oral presentation slots, keynote schedules, and hall allocations will be published here 24 hours prior to Day 1.
                </p>

                <div
                  style={{
                    backgroundColor: 'rgba(6, 16, 32, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    textAlign: 'left',
                    fontSize: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                  }}
                >
                  <div style={{ color: '#00e5ff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={15} />
                    <span>Official Venue:</span>
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.45 }}>
                    Aryabhata Hall, Department of Physics &amp; Campus Auditorium, University of Calicut, Thenhipalam, Kerala 673635.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CERTIFICATE (Verified E-Certificate Desk) */}
            {activeTab === 'certificate' && (
              <div
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: isCheckedIn ? '1px solid rgba(34, 197, 94, 0.35)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '24px',
                  padding: '2.2rem 1.5rem',
                  textAlign: 'center',
                  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5)',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    backgroundColor: isCheckedIn ? 'rgba(34, 197, 94, 0.12)' : 'rgba(212, 175, 55, 0.12)',
                    border: isCheckedIn ? '1px solid rgba(34, 197, 94, 0.35)' : '1px solid rgba(212, 175, 55, 0.35)',
                    color: isCheckedIn ? '#4ade80' : '#d4af37',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  {isCheckedIn ? <Award size={32} /> : <Lock size={28} />}
                </div>

                <div
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.8rem',
                    borderRadius: '9999px',
                    backgroundColor: isCheckedIn ? 'rgba(34, 197, 94, 0.12)' : 'rgba(212, 175, 55, 0.12)',
                    border: isCheckedIn ? '1px solid rgba(34, 197, 94, 0.35)' : '1px solid rgba(212, 175, 55, 0.35)',
                    color: isCheckedIn ? '#86efac' : '#d4af37',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    marginBottom: '0.85rem',
                    letterSpacing: '0.04em',
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  {isCheckedIn ? 'ATTENDANCE VERIFIED ✓' : 'LOCKED UNTIL CHECK-IN'}
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
                  Official E-Certificate Desk
                </h3>
                <p
                  style={{
                    fontSize: '0.88rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    maxWidth: '440px',
                    margin: '0 auto 1.75rem',
                    lineHeight: 1.55,
                  }}
                >
                  {isCheckedIn
                    ? 'Your conference participation certificate is queued and will be generated with authorized Calicut University signatures post-conference.'
                    : 'To prevent proxy participation, certificates are unlocked only after your QR pass is verified at the registration counter on conference day.'}
                </p>

                <div
                  style={{
                    backgroundColor: 'rgba(6, 16, 32, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '1.1rem',
                    textAlign: 'left',
                    fontSize: '0.82rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#ffffff' }}>
                    Candidate: {delegate.fullName}
                  </div>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', color: '#00e5ff' }}>
                    ID: {delegate.delegateId || 'ICRAST26-DELEGATE'}
                  </div>
                  <div style={{ color: isCheckedIn ? '#86efac' : '#facc15' }}>
                    Status: {isCheckedIn ? 'Checked in at registration counter ✓' : 'Pending in-person check-in'}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: REAL MOBILE APP PROFILE */}
            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {/* 1. Profile Hero Card */}
                <div
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    padding: '1.5rem',
                    boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
                    {/* Gradient Avatar */}
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)',
                        boxShadow: '0 8px 20px rgba(59, 130, 246, 0.35)',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {delegate.fullName ? delegate.fullName.charAt(0).toUpperCase() : 'D'}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <h2
                          style={{
                            fontSize: '1.3rem',
                            fontWeight: 800,
                            color: '#ffffff',
                            margin: 0,
                            lineHeight: 1.2,
                            letterSpacing: '-0.02em',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {delegate.fullName}
                        </h2>
                        <BadgeCheck size={18} style={{ color: '#00e5ff', flexShrink: 0 }} />
                      </div>

                      <div
                        style={{
                          fontSize: '0.82rem',
                          color: '#93c5fd',
                          marginTop: '3px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {delegate.designation || 'Conference Delegate'}
                      </div>

                      {/* Monospace Delegate ID with Copy action */}
                      <div
                        onClick={handleCopyId}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          marginTop: '0.5rem',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(0, 229, 255, 0.1)',
                          border: '1px solid rgba(0, 229, 255, 0.3)',
                          color: '#00e5ff',
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                        title="Tap to copy Delegate ID"
                      >
                        <span>{delegate.delegateId || 'ICRAST26-DELEGATE'}</span>
                        {copiedId ? <Check size={12} color="#4ade80" /> : <Copy size={12} opacity={0.7} />}
                      </div>
                    </div>
                  </div>

                  {/* Quick Metrics Bar (3 Chips) */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '0.65rem',
                      marginTop: '1.25rem',
                      paddingTop: '1.1rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    {/* Chip 1: Registration Status */}
                    <div
                      style={{
                        backgroundColor: 'rgba(6, 16, 32, 0.75)',
                        borderRadius: '12px',
                        padding: '0.65rem',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 600 }}>
                        CHECK-IN
                      </div>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: isCheckedIn ? '#4ade80' : '#facc15',
                          marginTop: '2px',
                        }}
                      >
                        {isCheckedIn ? 'Verified ✓' : 'Pending'}
                      </div>
                    </div>

                    {/* Chip 2: Mode */}
                    <div
                      style={{
                        backgroundColor: 'rgba(6, 16, 32, 0.75)',
                        borderRadius: '12px',
                        padding: '0.65rem',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 600 }}>
                        ENTRY MODE
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#93c5fd', marginTop: '2px' }}>
                        {delegate.participationMode?.includes('Online') ? 'Online' : 'On-Campus'}
                      </div>
                    </div>

                    {/* Chip 3: Venue Hall */}
                    <div
                      style={{
                        backgroundColor: 'rgba(6, 16, 32, 0.75)',
                        borderRadius: '12px',
                        padding: '0.65rem',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 600 }}>
                        VENUE
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#d4af37', marginTop: '2px' }}>
                        Aryabhata
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Grouped Inset List: Academic Details (iOS / Native style) */}
                <div
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      padding: '0.75rem 1rem 0.35rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: 'rgba(255, 255, 255, 0.45)',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Academic Credentials
                  </div>

                  {/* Row: Institution */}
                  <div
                    style={{
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(59, 130, 246, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#93c5fd',
                        }}
                      >
                        <Building size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)' }}>Institution</div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#ffffff' }}>
                          {delegate.institution || 'University of Calicut'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row: Department */}
                  {delegate.department && (
                    <div
                      style={{
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(168, 85, 247, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#c084fc',
                          }}
                        >
                          <GraduationCap size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)' }}>Department</div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#ffffff' }}>
                            {delegate.department}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Row: Track */}
                  {delegate.areaOfInterest && (
                    <div
                      style={{
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(234, 179, 8, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#facc15',
                          }}
                        >
                          <Sparkles size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)' }}>Research Track</div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#ffffff' }}>
                            {delegate.areaOfInterest}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Grouped Inset List: Conference Essentials */}
                <div
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      padding: '0.75rem 1rem 0.35rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: 'rgba(255, 255, 255, 0.45)',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Conference Assistance
                  </div>

                  {/* Row: Campus Wi-Fi */}
                  <div
                    style={{
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(34, 197, 94, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#4ade80',
                        }}
                      >
                        <Wifi size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)' }}>Campus Guest Wi-Fi</div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#ffffff' }}>
                          CU-Guest / Eduroam Available
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row: Conference Dates */}
                  <div
                    style={{
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(0, 229, 255, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#00e5ff',
                        }}
                      >
                        <Clock size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)' }}>Conference Dates</div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#ffffff' }}>
                          21–22 November 2026 · Calicut University
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Destructive Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#fca5a5',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.55rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.22)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)')}
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
            backgroundColor: 'rgba(5, 14, 30, 0.94)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(0, 168, 255, 0.18)',
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
              gap: '4px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'pass' ? '#00e5ff' : 'rgba(255, 255, 255, 0.45)',
              transition: 'all 0.15s ease',
              position: 'relative',
            }}
          >
            <Ticket size={21} strokeWidth={activeTab === 'pass' ? 2.5 : 1.8} />
            <span style={{ fontSize: '0.72rem', fontWeight: activeTab === 'pass' ? 800 : 500, letterSpacing: '0.01em' }}>
              Pass
            </span>
            {activeTab === 'pass' && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '6px',
                  width: '16px',
                  height: '3px',
                  borderRadius: '2px',
                  backgroundColor: '#00e5ff',
                  boxShadow: '0 0 8px #00e5ff',
                }}
              />
            )}
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
              gap: '4px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'schedule' ? '#00a8ff' : 'rgba(255, 255, 255, 0.45)',
              transition: 'all 0.15s ease',
              position: 'relative',
            }}
          >
            <Calendar size={21} strokeWidth={activeTab === 'schedule' ? 2.5 : 1.8} />
            <span style={{ fontSize: '0.72rem', fontWeight: activeTab === 'schedule' ? 800 : 500, letterSpacing: '0.01em' }}>
              Schedule
            </span>
            {activeTab === 'schedule' && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '6px',
                  width: '16px',
                  height: '3px',
                  borderRadius: '2px',
                  backgroundColor: '#00a8ff',
                  boxShadow: '0 0 8px #00a8ff',
                }}
              />
            )}
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
              gap: '4px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'certificate' ? '#4ade80' : 'rgba(255, 255, 255, 0.45)',
              transition: 'all 0.15s ease',
              position: 'relative',
            }}
          >
            <Award size={21} strokeWidth={activeTab === 'certificate' ? 2.5 : 1.8} />
            <span style={{ fontSize: '0.72rem', fontWeight: activeTab === 'certificate' ? 800 : 500, letterSpacing: '0.01em' }}>
              Certificate
            </span>
            {activeTab === 'certificate' && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '6px',
                  width: '16px',
                  height: '3px',
                  borderRadius: '2px',
                  backgroundColor: '#4ade80',
                  boxShadow: '0 0 8px #4ade80',
                }}
              />
            )}
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
              gap: '4px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'profile' ? '#93c5fd' : 'rgba(255, 255, 255, 0.45)',
              transition: 'all 0.15s ease',
              position: 'relative',
            }}
          >
            <User size={21} strokeWidth={activeTab === 'profile' ? 2.5 : 1.8} />
            <span style={{ fontSize: '0.72rem', fontWeight: activeTab === 'profile' ? 800 : 500, letterSpacing: '0.01em' }}>
              Profile
            </span>
            {activeTab === 'profile' && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '6px',
                  width: '16px',
                  height: '3px',
                  borderRadius: '2px',
                  backgroundColor: '#93c5fd',
                  boxShadow: '0 0 8px #93c5fd',
                }}
              />
            )}
          </button>
        </nav>
      )}
    </div>
  );
}
