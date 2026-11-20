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
  ChevronDown,
  Copy,
  Check,
  ShieldCheck,
  BadgeCheck,
  Compass,
  Bell,
} from 'lucide-react';

function normalizePhone(p: unknown): string {
  if (p === null || p === undefined) return '';
  const str = String(p).trim();
  const digits = str.replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

function splitCampusLines(name: string, maxLineChars = 28): string[] {
  const str = String(name || '').trim();
  if (str.length <= 22) return [str];
  const words = str.split(/\s+/);
  if (words.length <= 1) return [str];
  const line1Words: string[] = [];
  let line2Words: string[] = [];
  let currentLen = 0;
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const candidateLen = currentLen === 0 ? word.length : currentLen + 1 + word.length;
    if (candidateLen <= maxLineChars && i < words.length - 1) {
      line1Words.push(word);
      currentLen = candidateLen;
    } else if (line1Words.length === 0) {
      line1Words.push(word);
      line2Words = words.slice(i + 1);
      break;
    } else {
      line2Words = words.slice(i);
      break;
    }
  }
  const l1 = line1Words.join(' ');
  const l2 = line2Words.join(' ');
  return l2 ? [l1, l2] : [l1];
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
  const [showMenu, setShowMenu] = useState(false);

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

      // 2. Dynamic Candidate Full Name (Centered at x = 341, y = 556, large prominent font with clean gap below DELEGATE banner)
      ctx.fillStyle = '#081e3e';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fullName = String(delegate.fullName || '').trim();
      if (fullName.length > 28) {
        ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
      } else if (fullName.length > 20) {
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
      } else {
        ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
      }
      ctx.fillText(fullName, 341, 556);

      // 3. Dynamic Campus / Institution with Cap Icon & Divider (Centered relative to Name)
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
      const displayLines = splitCampusLines(institutionText);

      const maxTextWidth = Math.max(...displayLines.map((l) => ctx.measureText(l).width));
      const capWidth = 32;
      const capHeight = 24;
      const gap = 8;
      const dividerWidth = 1.5;
      const totalGroupWidth = capWidth + gap + dividerWidth + gap + maxTextWidth;
      const startX = (width - totalGroupWidth) / 2;
      const centerY = 618;
      const dividerHeight = displayLines.length > 1 ? 34 : 22;

      // Draw Cap Icon
      if (capImg.complete && capImg.naturalWidth > 0) {
        ctx.drawImage(capImg, startX, centerY - capHeight / 2, capWidth, capHeight);
      }

      // Draw Vertical Divider Line
      ctx.fillStyle = '#081e3e';
      ctx.fillRect(startX + capWidth + gap, centerY - dividerHeight / 2, dividerWidth, dividerHeight);

      // Draw Institution Text Lines
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#081e3e';
      const textStartX = startX + capWidth + gap + dividerWidth + gap;
      if (displayLines.length === 1) {
        ctx.fillText(displayLines[0], textStartX, centerY);
      } else {
        ctx.fillText(displayLines[0], textStartX, centerY - 9);
        ctx.fillText(displayLines[1], textStartX, centerY + 10);
      }

      // 4. Draw Scannable Vector QR Code with full border clearance
      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        qrImg.onload = () => resolve();
        qrImg.onerror = () => resolve();
        qrImg.src = qrSource;
      });

      // Cyan box is centered at x = 341, y = 764 (bounds: x: 231..450, y: 661..866)
      // qrSize of 162 leaves a clean ~28px margin so all 4 cyan stroke borders are 100% visible
      const qrSize = 162;
      const qrX = 341 - qrSize / 2;
      const qrY = 764 - qrSize / 2;
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
        backgroundColor: '#F4F7FB',
        color: '#172033',
        fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Top Application Header Bar - Clean White Executive Bar */}
      <header
        style={{
          height: '64px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #EAEFF5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.25rem',
          flexShrink: 0,
          zIndex: 40,
        }}
      >
        {/* Left: ICRAST Cube Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <img
            src="/images/icrast-logo-mark.png"
            alt="ICRAST Logo"
            style={{ width: '34px', height: '34px', objectFit: 'contain' }}
          />
          <div>
            <div
              style={{
                fontSize: '1.02rem',
                fontWeight: 800,
                color: '#123B70',
                lineHeight: 1.15,
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
              Conference Portal
            </div>
          </div>
        </div>

        {/* Right Action: Delegate dropdown + Notification/Logout button */}
        {delegate ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.38rem 0.8rem',
                borderRadius: '9999px',
                backgroundColor: '#EDF3FA',
                border: 'none',
                color: '#123B70',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span>Delegate</span>
              <ChevronDown
                size={14}
                style={{
                  transform: showMenu ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>

            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              title="Notifications & Menu"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#EDF3FA',
                border: 'none',
                color: '#123B70',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Bell size={15} />
            </button>

            {/* Dropdown Menu when clicked */}
            {showMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '46px',
                  right: 0,
                  width: '220px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 16px 36px rgba(18, 59, 112, 0.14), 0 2px 8px rgba(0,0,0,0.06)',
                  border: '1px solid #E2E8F0',
                  padding: '0.85rem',
                  zIndex: 100,
                }}
              >
                <div style={{ fontSize: '0.68rem', color: '#5A6E85', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  SIGNED IN ATTENDEE
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#123B70', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {delegate.fullName}
                </div>
                <div
                  onClick={handleCopyId}
                  style={{
                    fontSize: '0.74rem',
                    fontFamily: '"JetBrains Mono", monospace',
                    color: '#185ADB',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title="Tap to copy"
                >
                  <span>{delegate.delegateId || 'ICRAST26'}</span>
                  {copiedId ? <Check size={12} color="#10B981" /> : <Copy size={12} opacity={0.6} />}
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '0.65rem 0' }} />
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    handleLogout();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '8px',
                    backgroundColor: '#FEF2F2',
                    border: 'none',
                    color: '#DC2626',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/icrast/register"
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#185ADB',
              textDecoration: 'none',
              padding: '0.38rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: '#E8F1FC',
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
              backgroundColor: '#ffffff',
              border: '1px solid #EAEFF5',
              borderRadius: '24px',
              padding: '2.5rem 2rem',
              maxWidth: '420px',
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
              Attendee Pass Portal
            </h1>
            <p
              style={{
                fontSize: '0.85rem',
                color: '#5A6E85',
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
                    color: '#94A3B8',
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
                    fontSize: '1.02rem',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    borderRadius: '12px',
                    color: '#172033',
                    outline: 'none',
                    letterSpacing: '0.04em',
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.92rem',
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  borderRadius: '12px',
                  backgroundColor: '#185ADB',
                  color: '#ffffff',
                  border: 'none',
                  cursor: isLoading ? 'wait' : 'pointer',
                  boxShadow: '0 8px 20px rgba(24, 90, 219, 0.22)',
                  transition: 'all 0.15s ease',
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
                    color: '#5A6E85',
                    textDecoration: 'none',
                    fontWeight: 600,
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
        ) : (
          /* Authenticated Delegate Mobile Portal View */
          <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>
            {/* TAB 1: PASS / TICKET (Hero Digital Badge) */}
            {activeTab === 'pass' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                {/* Clean Apple Wallet-style Ticket Card */}
                <div
                  ref={badgeCardRef}
                  className="icrast-hero-ticket-card"
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '380px',
                    aspectRatio: '682 / 1024',
                    margin: '0 auto 1.15rem',
                    borderRadius: '26px',
                    overflow: 'hidden',
                    boxShadow: '0 16px 45px rgba(18, 59, 112, 0.12), 0 2px 10px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(18, 59, 112, 0.08)',
                    backgroundImage: "url('/images/icrast-badge-template.png')",
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: '#ffffff',
                    userSelect: 'none',
                  }}
                >
                  {/* 1. Dynamic Candidate Full Name - Prominent & Large with extra gap after DELEGATE */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '54.5%',
                      left: '4%',
                      right: '4%',
                      textAlign: 'center',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: 850,
                        fontSize: 'clamp(1.35rem, 5.6vw, 1.85rem)',
                        color: '#081e3e',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.15,
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: delegate.fullName && delegate.fullName.length > 24 ? 'normal' : 'nowrap',
                      }}
                    >
                      {delegate.fullName}
                    </div>
                  </div>

                  {/* 2. Dynamic Campus / Institution with Cap Icon & Divider - Centered relative to Name */}
                  {(() => {
                    const campusLines = splitCampusLines(delegate.institution || 'University of Calicut');
                    const isTwoLines = campusLines.length > 1;
                    return (
                      <div
                        style={{
                          position: 'absolute',
                          top: '60.8%',
                          left: 0,
                          right: 0,
                          width: '100%',
                          margin: '0 auto',
                          transform: 'translateY(-50%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.45rem',
                          pointerEvents: 'none',
                          padding: '0 1rem',
                        }}
                      >
                        <img
                          src="/images/icrast-badge-cap.png"
                          alt="Campus"
                          style={{
                            width: 'clamp(20px, 4.4vw, 24px)',
                            height: 'auto',
                            objectFit: 'contain',
                            flexShrink: 0,
                          }}
                        />
                        <div
                          style={{
                            width: '1.5px',
                            height: isTwoLines ? 'clamp(28px, 5.8vw, 34px)' : 'clamp(18px, 3.8vw, 22px)',
                            backgroundColor: '#081e3e',
                            flexShrink: 0,
                          }}
                        />
                        <div
                          style={{
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            fontWeight: 600,
                            fontSize: 'clamp(0.68rem, 2.4vw, 0.82rem)',
                            color: '#081e3e',
                            lineHeight: 1.25,
                            textAlign: 'left',
                            display: 'flex',
                            flexDirection: 'column',
                            maxWidth: '240px',
                          }}
                        >
                          {campusLines.map((line, idx) => (
                            <span key={idx} style={{ whiteSpace: 'nowrap' }}>
                              {line}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* 3. Dynamic Vector SVG QR Code with full border clearance inside Cyan Rounded Frame */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '74.6%',
                      left: '50.0%',
                      transform: 'translate(-50%, -50%)',
                      width: '23.8%',
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

                {/* Primary Solid Navy/Blue Download Button */}
                <div style={{ width: '100%', maxWidth: '380px' }}>
                  <button
                    type="button"
                    onClick={handleDownloadBadgeImage}
                    disabled={isDownloading}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.55rem',
                      padding: '0.92rem 1.6rem',
                      fontSize: '0.94rem',
                      fontWeight: 700,
                      borderRadius: '14px',
                      width: '100%',
                      backgroundColor: '#185ADB',
                      color: '#ffffff',
                      border: 'none',
                      cursor: isDownloading ? 'wait' : 'pointer',
                      boxShadow: '0 8px 22px rgba(24, 90, 219, 0.22)',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#154ec4')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#185ADB')}
                  >
                    {isDownloading ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        <span>Generating High-Res Badge...</span>
                      </>
                    ) : (
                      <>
                        <Download size={18} />
                        <span>Download Digital Badge (PNG)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: SCHEDULE (Clean Minimal Empty State) */}
            {activeTab === 'schedule' && (
              <div
                style={{
                  padding: '4.5rem 1.5rem 2rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  maxWidth: '380px',
                  margin: '0 auto',
                }}
              >
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    backgroundColor: '#E8F1FC',
                    color: '#185ADB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  <Calendar size={32} strokeWidth={1.8} />
                </div>

                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#123B70',
                    marginBottom: '0.45rem',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Schedule Releasing Soon
                </h3>

                <p
                  style={{
                    fontSize: '0.88rem',
                    color: '#5A6E85',
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  Conference session timetable, oral presentation tracks, and hall allocations will be published here 24 hours prior to Day 1.
                </p>
              </div>
            )}

            {/* TAB 3: CERTIFICATES / DOWNLOADS (Clean Minimal Empty State) */}
            {activeTab === 'certificate' && (
              <div
                style={{
                  padding: '4.5rem 1.5rem 2rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  maxWidth: '380px',
                  margin: '0 auto',
                }}
              >
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    backgroundColor: '#E8F1FC',
                    color: '#185ADB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  <Award size={32} strokeWidth={1.8} />
                </div>

                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#123B70',
                    marginBottom: '0.45rem',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Certificates Available Soon
                </h3>

                <p
                  style={{
                    fontSize: '0.88rem',
                    color: '#5A6E85',
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  Authorized e-certificates of participation and presentation will be available for download here post-conference.
                </p>
              </div>
            )}

            {/* TAB 4: REAL MOBILE APP PROFILE */}
            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {/* 1. Profile Hero Card */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #EAEFF5',
                    borderRadius: '24px',
                    padding: '1.5rem',
                    boxShadow: '0 16px 40px rgba(18, 59, 112, 0.08)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
                    {/* Clean Monogram Avatar */}
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '20px',
                        backgroundColor: '#E8F1FC',
                        color: '#185ADB',
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
                            fontSize: '1.25rem',
                            fontWeight: 800,
                            color: '#123B70',
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
                        <BadgeCheck size={18} style={{ color: '#185ADB', flexShrink: 0 }} />
                      </div>

                      <div
                        style={{
                          fontSize: '0.82rem',
                          color: '#5A6E85',
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
                          backgroundColor: '#F1F5F9',
                          border: '1px solid #E2E8F0',
                          color: '#185ADB',
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                        title="Tap to copy Delegate ID"
                      >
                        <span>{delegate.delegateId || 'ICRAST26-DELEGATE'}</span>
                        {copiedId ? <Check size={12} color="#10B981" /> : <Copy size={12} opacity={0.6} />}
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
                      borderTop: '1px solid #F1F5F9',
                    }}
                  >
                    {/* Chip 1: Registration Status */}
                    <div
                      style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: '12px',
                        padding: '0.65rem',
                        textAlign: 'center',
                        border: '1px solid #EAEFF5',
                      }}
                    >
                      <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700 }}>
                        CHECK-IN
                      </div>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: isCheckedIn ? '#16A34A' : '#D97706',
                          marginTop: '2px',
                        }}
                      >
                        {isCheckedIn ? 'Verified ✓' : 'Pending'}
                      </div>
                    </div>

                    {/* Chip 2: Mode */}
                    <div
                      style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: '12px',
                        padding: '0.65rem',
                        textAlign: 'center',
                        border: '1px solid #EAEFF5',
                      }}
                    >
                      <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700 }}>
                        ENTRY MODE
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#185ADB', marginTop: '2px' }}>
                        {delegate.participationMode?.includes('Online') ? 'Online' : 'On-Campus'}
                      </div>
                    </div>

                    {/* Chip 3: Venue Hall */}
                    <div
                      style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: '12px',
                        padding: '0.65rem',
                        textAlign: 'center',
                        border: '1px solid #EAEFF5',
                      }}
                    >
                      <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700 }}>
                        VENUE
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#123B70', marginTop: '2px' }}>
                        Aryabhata
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Grouped Inset List: Academic Details */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #EAEFF5',
                    borderRadius: '20px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      padding: '0.75rem 1rem 0.35rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#64748B',
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
                      borderBottom: '1px solid #F1F5F9',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: '#EDF3FA',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#185ADB',
                        }}
                      >
                        <Building size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Institution</div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#123B70' }}>
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
                        borderBottom: '1px solid #F1F5F9',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: '#F3E8FF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#9333EA',
                          }}
                        >
                          <GraduationCap size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Department</div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#123B70' }}>
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
                            backgroundColor: '#FEF9C3',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#CA8A04',
                          }}
                        >
                          <Sparkles size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Research Track</div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#123B70' }}>
                            {delegate.areaOfInterest}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Destructive Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    borderRadius: '16px',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    color: '#DC2626',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.55rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEE2E2')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                >
                  <LogOut size={16} />
                  <span>Log Out / Switch Mobile Number</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Clean White Bottom Navigation Bar - Exactly as in Mockup */}
      {delegate && (
        <nav
          className="icrast-mobile-bottom-nav"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '66px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #EAEFF5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            zIndex: 50,
            maxWidth: '580px',
            marginInline: 'auto',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            boxShadow: '0 -4px 20px rgba(18, 59, 112, 0.04)',
          }}
        >
          {/* Tab 1: Badge */}
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
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'pass' ? '#185ADB' : '#7C8BA0',
              transition: 'all 0.15s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: activeTab === 'pass' ? '4px 16px' : '4px',
                borderRadius: '14px',
                backgroundColor: activeTab === 'pass' ? '#E8F1FC' : 'transparent',
                gap: '2px',
                transition: 'all 0.15s ease',
              }}
            >
              <Ticket size={20} strokeWidth={activeTab === 'pass' ? 2.5 : 1.8} />
              <span style={{ fontSize: '0.72rem', fontWeight: activeTab === 'pass' ? 800 : 500 }}>
                Badge
              </span>
            </div>
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
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'schedule' ? '#185ADB' : '#7C8BA0',
              transition: 'all 0.15s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: activeTab === 'schedule' ? '4px 16px' : '4px',
                borderRadius: '14px',
                backgroundColor: activeTab === 'schedule' ? '#E8F1FC' : 'transparent',
                gap: '2px',
                transition: 'all 0.15s ease',
              }}
            >
              <Calendar size={20} strokeWidth={activeTab === 'schedule' ? 2.5 : 1.8} />
              <span style={{ fontSize: '0.72rem', fontWeight: activeTab === 'schedule' ? 800 : 500 }}>
                Schedule
              </span>
            </div>
          </button>

          {/* Tab 3: Downloads / Certificates */}
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
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'certificate' ? '#185ADB' : '#7C8BA0',
              transition: 'all 0.15s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: activeTab === 'certificate' ? '4px 16px' : '4px',
                borderRadius: '14px',
                backgroundColor: activeTab === 'certificate' ? '#E8F1FC' : 'transparent',
                gap: '2px',
                transition: 'all 0.15s ease',
              }}
            >
              <FileText size={20} strokeWidth={activeTab === 'certificate' ? 2.5 : 1.8} />
              <span style={{ fontSize: '0.72rem', fontWeight: activeTab === 'certificate' ? 800 : 500 }}>
                Downloads
              </span>
            </div>
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
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'profile' ? '#185ADB' : '#7C8BA0',
              transition: 'all 0.15s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: activeTab === 'profile' ? '4px 16px' : '4px',
                borderRadius: '14px',
                backgroundColor: activeTab === 'profile' ? '#E8F1FC' : 'transparent',
                gap: '2px',
                transition: 'all 0.15s ease',
              }}
            >
              <User size={20} strokeWidth={activeTab === 'profile' ? 2.5 : 1.8} />
              <span style={{ fontSize: '0.72rem', fontWeight: activeTab === 'profile' ? 800 : 500 }}>
                Profile
              </span>
            </div>
          </button>
        </nav>
      )}
    </div>
  );
}
