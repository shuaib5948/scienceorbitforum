import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from '@tanstack/react-router';
import QRCode from 'qrcode';
import { IcrastLayout } from '../components/icrast/IcrastLayout';
import { Reveal } from '../components/ui/Reveal';
import { trackPageView, trackEvent } from '../lib/analytics';
import {
  ICRAST_REGISTER_SCRIPT_URL,
  type DelegateLookupResult,
} from '../types/icrast';
import {
  QrCode,
  Phone,
  CheckCircle2,
  Clock,
  Download,
  RefreshCw,
  Search,
  Building,
  GraduationCap,
  MapPin,
  AlertCircle,
  X,
} from 'lucide-react';

function normalizePhone(p: string): string {
  if (!p) return '';
  const digits = p.replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

export default function IcrastBadgePage() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const initialPhone = queryParams.get('phone') || '';

  const [phoneInput, setPhoneInput] = useState(initialPhone);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [delegate, setDelegate] = useState<DelegateLookupResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const badgeCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackPageView('/icrast/delegate', 'ICRAST-26 Delegate Badge Portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // If phone is passed in URL query, auto-lookup
    if (initialPhone.trim()) {
      handleLookup(initialPhone.trim());
    }
  }, []);

  // Handle ESC key and scroll-lock for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
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
        setIsModalOpen(true);
        generateQrCode(data.phone || cleanPhone, data.delegateId || 'ICRAST26-DELEGATE');
        trackEvent('icrast_delegate_portal', 'lookup', 'success');
      } else {
        setDelegate(null);
        setIsModalOpen(false);
        // Guard: If old Apps Script ran (which returns "Registration recorded successfully"), do NOT show that confusing text!
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

  const [isDownloading, setIsDownloading] = useState(false);

  const generateQrCode = async (phone: string, delegateId: string) => {
    try {
      const cleanPhone = normalizePhone(phone);
      const cleanId = (delegateId || '').trim();
      const checkinUrl = `https://icrast.scienceorbitforum.org/checkin?phone=${encodeURIComponent(
        cleanPhone
      )}&id=${encodeURIComponent(cleanId)}`;

      const dataUrl = await QRCode.toDataURL(checkinUrl, {
        width: 360,
        margin: 1,
        color: {
          dark: '#0b1b33',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error('QR code generation failed:', err);
    }
  };

  const handleDownloadBadgeImage = async () => {
    if (!delegate || !qrDataUrl) return;
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
        qrImg.src = qrDataUrl;
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

      const triggerDownload = (url: string) => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      if (canvas.toBlob) {
        canvas.toBlob((blob) => {
          if (blob) {
            const blobUrl = URL.createObjectURL(blob);
            triggerDownload(blobUrl);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
          } else {
            triggerDownload(canvas.toDataURL('image/png'));
          }
        }, 'image/png');
      } else {
        triggerDownload(canvas.toDataURL('image/png'));
      }

      trackEvent('icrast_delegate_badge', 'action', 'download_image');
    } catch (err) {
      console.error('Badge download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const isCheckedIn = delegate?.checkinStatus === 'Checked In';

  return (
    <IcrastLayout>
      <section
        className="container section icrast-delegate-portal"
        style={{
          paddingTop: 'clamp(4.5rem, 7vh, 6rem)',
          paddingBottom: 'clamp(2.5rem, 4.5vh, 3.5rem)',
        }}
      >
        <div style={{ maxWidth: '600px', marginInline: 'auto' }}>
          {/* Standard Professional Input Box Card */}
          <Reveal delay={100}>
            <div
              className="no-print"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: 'clamp(1rem, 2.5vw, 1.35rem)',
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.85rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: '0.6rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <QrCode size={18} style={{ color: '#00e5ff' }} />
                  <h1
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      letterSpacing: '0.02em',
                      margin: 0,
                    }}
                  >
                    Delegate Verification
                  </h1>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: '#86efac',
                    backgroundColor: 'rgba(34, 197, 94, 0.12)',
                    padding: '0.15rem 0.55rem',
                    borderRadius: '9999px',
                    fontWeight: 600,
                  }}
                >
                  Live Portal
                </span>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLookup(phoneInput);
                }}
              >
                <label
                  htmlFor="delegate-phone-input"
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.85)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Registered Mobile / WhatsApp Number
                </label>
                <div
                  className="icrast-delegate-search-row"
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.6rem',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      flex: '1 1 200px',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: '0.85rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'rgba(255, 255, 255, 0.45)',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Phone size={16} />
                    </div>
                    <input
                      id="delegate-phone-input"
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="e.g. 9876543210"
                      disabled={isLoading}
                      autoFocus
                      style={{
                        width: '100%',
                        height: '44px',
                        padding: '0.65rem 0.85rem 0.65rem 2.5rem',
                        backgroundColor: 'rgba(11, 27, 51, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '9px',
                        color: '#ffffff',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#00e5ff';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 229, 255, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="icrast-btn icrast-btn--primary"
                    style={{
                      height: '44px',
                      padding: '0.65rem 1.4rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      borderRadius: '9px',
                    }}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <Search size={15} />
                        <span>View Pass</span>
                      </>
                    )}
                  </button>
                </div>

                <div
                  style={{
                    textAlign: 'center',
                    marginTop: '0.85rem',
                  }}
                >
                  <Link
                    to="/icrast/register"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: 'rgba(255, 255, 255, 0.65)',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)')}
                  >
                    <span>Register here</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </form>

              {errorMessage && (
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem 0.9rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    color: '#fca5a5',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          </Reveal>

          {/* Delegate Badge Modal Overlay */}
          {isModalOpen && delegate && (
            <div
              className="icrast-badge-modal-overlay"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setIsModalOpen(false);
                }
              }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(3, 7, 18, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: 'clamp(0.75rem, 3vw, 1.5rem)',
                overflowY: 'auto',
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Delegate Conference Pass"
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '580px',
                  margin: 'auto',
                }}
              >
                {/* Modal Close Button */}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="icrast-badge-modal-close no-print"
                  aria-label="Close Badge Modal"
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '-12px',
                    zIndex: 20,
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: '#0b1b33',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.6)',
                    transition: 'transform 0.15s, background-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1e3a8a')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0b1b33')}
                >
                  <X size={18} />
                </button>

                {/* Badge Card */}
                <div
                  ref={badgeCardRef}
                  className="icrast-delegate-badge-wrap"
                  style={{
                    position: 'relative',
                    backgroundColor: '#071224',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 175, 55, 0.15)',
                    marginBottom: '1rem',
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
                                  : 'Entry verified'}
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
                                Show this pass at registration counter to check in
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Scannable QR Code */}
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
                        {qrDataUrl ? (
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
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#64748b',
                            }}
                          >
                            <QrCode size={40} />
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
                      <strong>Organised by:</strong> Science Orbit Forum &amp; Swaminathan Chair
                    </div>
                  </div>
                </div>

                {/* Action Button: Download Badge Image Only */}
                <div
                  className="no-print"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '0.25rem',
                  }}
                >
                  <button
                    type="button"
                    onClick={handleDownloadBadgeImage}
                    disabled={isDownloading}
                    className="icrast-btn icrast-btn--primary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.6rem',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      borderRadius: '10px',
                      width: '100%',
                      maxWidth: '260px',
                    }}
                  >
                    {isDownloading ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Generating Image...</span>
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        <span>Download Badge Image</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Responsive mobile adjustments & Print stylesheet */}
      <style>{`
        @media (max-width: 520px) {
          .icrast-delegate-search-row {
            flex-direction: column !important;
          }
          .icrast-delegate-search-row > div {
            width: 100% !important;
            flex: 1 1 100% !important;
          }
          .icrast-delegate-search-row button {
            width: 100% !important;
          }
          .icrast-badge-grid {
            flex-direction: column !important;
            align-items: stretch !important;
          }
        }
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .icrast-badge-modal-overlay {
            position: static !important;
            background: transparent !important;
            backdrop-filter: none !important;
            padding: 0 !important;
            display: block !important;
          }
          .icrast-badge-modal-close,
          .icrast-topbar,
          .icrast-spectrum-bar,
          .icrast-site-footer,
          .no-print {
            display: none !important;
          }
          .icrast-portal__body {
            padding: 0 !important;
            margin: 0 !important;
          }
          .icrast-delegate-badge-wrap {
            border: 2px solid #0b1b33 !important;
            box-shadow: none !important;
            page-break-inside: avoid;
            margin: 20px auto !important;
            max-width: 600px !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .icrast-delegate-badge-wrap * {
            color: #0b1b33 !important;
          }
          .icrast-delegate-badge-wrap img {
            filter: none !important;
          }
        }
      `}</style>
    </IcrastLayout>
  );
}
