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
  Printer,
  Share2,
  RefreshCw,
  Search,
  Building,
  GraduationCap,
  MapPin,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  UserCheck,
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

      const data: DelegateLookupResult = await response.json();

      if (data.ok && data.fullName) {
        setDelegate(data);
        generateQrCode(data.phone || cleanPhone, data.delegateId || 'ICRAST26-DELEGATE');
        trackEvent('icrast_delegate_portal', 'lookup', 'success');
      } else {
        setDelegate(null);
        setErrorMessage(
          data.message ||
            'No registration record found for this mobile number. Please check your number or contact the registration desk.'
        );
        trackEvent('icrast_delegate_portal', 'lookup', 'not_found');
      }
    } catch (err) {
      console.error('Delegate lookup failed:', err);
      setErrorMessage(
        'Unable to reach the registration server. Please check your internet connection or visit the helpdesk at Aryabhata Hall.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const generateQrCode = async (phone: string, delegateId: string) => {
    try {
      const checkinUrl = `https://icrast.scienceorbitforum.org/checkin?phone=${encodeURIComponent(
        normalizePhone(phone)
      )}&id=${encodeURIComponent(delegateId)}`;

      const dataUrl = await QRCode.toDataURL(checkinUrl, {
        width: 320,
        margin: 1,
        color: {
          dark: '#0b1b33',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error('QR code generation failed:', err);
    }
  };

  const handleRefreshStatus = async () => {
    if (!delegate?.phone) return;
    setIsRefreshing(true);
    await handleLookup(delegate.phone);
    setIsRefreshing(false);
  };

  const handlePrint = () => {
    window.print();
    trackEvent('icrast_delegate_badge', 'action', 'print');
  };

  const handleCopyLink = () => {
    if (!delegate?.phone) return;
    const shareUrl = `${window.location.origin}/icrast/delegate?phone=${encodeURIComponent(
      normalizePhone(delegate.phone)
    )}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
      trackEvent('icrast_delegate_badge', 'action', 'copy_link');
    });
  };

  const isCheckedIn = delegate?.checkinStatus === 'Checked In';

  return (
    <IcrastLayout>
      <section
        className="container section icrast-delegate-portal"
        style={{
          paddingTop: 'clamp(5.5rem, 9vh, 7rem)',
          paddingBottom: 'clamp(4rem, 7vh, 6rem)',
        }}
      >
        <div style={{ maxWidth: '840px', marginInline: 'auto' }}>
          {/* Header Banner */}
          <Reveal>
            <div className="text-center" style={{ marginBottom: '2.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 1rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  color: '#d4af37',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                <Sparkles size={14} />
                <span>ICRAST-26 · Aryabhata Hall, Calicut University</span>
              </div>
              <h1
                style={{
                  fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '0.75rem',
                  letterSpacing: '-0.02em',
                }}
              >
                Digital Delegate ID &amp; QR Pass
              </h1>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.72)',
                  fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
                  maxWidth: '620px',
                  marginInline: 'auto',
                  lineHeight: 1.6,
                }}
              >
                Access your personalized conference badge and show this QR pass at the
                Aryabhata Hall check-in desk for event entry and session access.
              </p>
            </div>
          </Reveal>

          {/* Search / Login Box */}
          <Reveal delay={100}>
            <div
              className="no-print"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '1.75rem',
                marginBottom: '2.5rem',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)',
              }}
            >
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
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Enter Registered Mobile / WhatsApp Number
                </label>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      flex: '1 1 280px',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'rgba(255, 255, 255, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Phone size={18} />
                    </div>
                    <input
                      id="delegate-phone-input"
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="e.g. 9876543210"
                      disabled={isLoading}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem 0.85rem 2.85rem',
                        backgroundColor: 'rgba(11, 27, 51, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = '#00e5ff')
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          'rgba(255, 255, 255, 0.2)')
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="icrast-btn icrast-btn--primary"
                    style={{
                      padding: '0.85rem 1.75rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.95rem',
                    }}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <Search size={16} />
                        <span>Retrieve Pass</span>
                      </>
                    )}
                  </button>
                </div>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.55)',
                    marginTop: '0.65rem',
                    marginBottom: 0,
                  }}
                >
                  Enter the 10-digit number used during your conference registration.
                  Country code prefixes (e.g. +91) will be matched automatically.
                </p>
              </form>

              {errorMessage && (
                <div
                  style={{
                    marginTop: '1.25rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    color: '#fca5a5',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span>{errorMessage}</span>
                    <div style={{ marginTop: '0.4rem' }}>
                      <Link
                        to="/icrast/register"
                        style={{
                          color: '#ffffff',
                          textDecoration: 'underline',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                        }}
                      >
                        Not registered yet? Register for free here &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          {/* Delegate Badge Display Card */}
          {delegate && (
            <Reveal delay={150}>
              <div
                ref={badgeCardRef}
                className="icrast-delegate-badge-wrap"
                style={{
                  position: 'relative',
                  backgroundColor: '#071224',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(212, 175, 55, 0.15)',
                  marginBottom: '2rem',
                }}
              >
                {/* Top Golden / Academic Ribbon */}
                <div
                  style={{
                    background: 'linear-gradient(90deg, #0b1b33 0%, #1e3a8a 50%, #0b1b33 100%)',
                    padding: '1.25rem 2rem',
                    borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img
                      src="/images/icrast-logo-mark.png"
                      alt="ICRAST Logo"
                      style={{ width: '42px', height: '42px', objectFit: 'contain' }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 800,
                          color: '#ffffff',
                          letterSpacing: '0.05em',
                        }}
                      >
                        ICRAST-26
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'rgba(255, 255, 255, 0.75)',
                          letterSpacing: '0.02em',
                        }}
                      >
                        University of Calicut &amp; Science Orbit Forum
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign: 'right',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.3rem 0.85rem',
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(212, 175, 55, 0.15)',
                        border: '1px solid rgba(212, 175, 55, 0.4)',
                        color: '#d4af37',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                      }}
                    >
                      OFFICIAL DELEGATE PASS
                    </span>
                  </div>
                </div>

                {/* Main Badge Content Area */}
                <div
                  style={{
                    padding: '2rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '2rem',
                    alignItems: 'center',
                  }}
                >
                  {/* Left Column: Delegate Details */}
                  <div>
                    {/* Delegate ID Pill */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(0, 229, 255, 0.12)',
                        border: '1px solid rgba(0, 229, 255, 0.3)',
                        color: '#00e5ff',
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        marginBottom: '0.75rem',
                        letterSpacing: '0.06em',
                      }}
                    >
                      <span>ID: {delegate.delegateId || 'ICRAST26-D1001'}</span>
                    </div>

                    {/* Full Name */}
                    <h2
                      style={{
                        fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
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
                        fontSize: '1rem',
                        color: '#93c5fd',
                        fontWeight: 600,
                        marginTop: '0.35rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <GraduationCap size={16} />
                      <span>{delegate.designation || 'Conference Attendee'}</span>
                    </div>

                    {/* Department & Institution */}
                    <div
                      style={{
                        fontSize: '0.9rem',
                        color: 'rgba(255, 255, 255, 0.75)',
                        marginTop: '0.5rem',
                        lineHeight: 1.5,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.4rem',
                      }}
                    >
                      <Building size={16} style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>
                        {delegate.department ? `${delegate.department}, ` : ''}
                        <strong>{delegate.institution || 'Calicut, Kerala'}</strong>
                      </span>
                    </div>

                    {/* Area of Interest */}
                    {delegate.areaOfInterest && (
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'rgba(255, 255, 255, 0.55)',
                          marginTop: '0.35rem',
                          paddingLeft: '1.4rem',
                        }}
                      >
                        Track: {delegate.areaOfInterest}
                      </div>
                    )}

                    {/* Participation Mode */}
                    <div style={{ marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.35rem 0.85rem',
                          borderRadius: '9999px',
                          fontSize: '0.8rem',
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
                        <MapPin size={13} />
                        <span>{delegate.participationMode || 'Offline – On Campus Participation'}</span>
                      </span>
                    </div>

                    {/* Live Check-in Status */}
                    <div style={{ marginTop: '1.5rem' }}>
                      {isCheckedIn ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(34, 197, 94, 0.12)',
                            border: '1px solid rgba(34, 197, 94, 0.35)',
                            color: '#86efac',
                          }}
                        >
                          <CheckCircle2 size={22} style={{ color: '#22c55e', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                              CHECKED IN · VERIFIED
                            </div>
                            <div
                              style={{
                                fontSize: '0.75rem',
                                color: 'rgba(255, 255, 255, 0.7)',
                              }}
                            >
                              {delegate.checkinTimestamp
                                ? `Time: ${delegate.checkinTimestamp}`
                                : 'Entry verified at Aryabhata Hall'}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(212, 175, 55, 0.12)',
                            border: '1px solid rgba(212, 175, 55, 0.35)',
                            color: '#fef08a',
                          }}
                        >
                          <Clock size={20} style={{ color: '#d4af37', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                              STATUS: REGISTERED
                            </div>
                            <div
                              style={{
                                fontSize: '0.75rem',
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
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#ffffff',
                        padding: '1rem',
                        borderRadius: '16px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                        display: 'inline-block',
                      }}
                    >
                      {qrDataUrl ? (
                        <img
                          src={qrDataUrl}
                          alt={`QR Check-in Pass for ${delegate.fullName}`}
                          style={{
                            width: '180px',
                            height: '180px',
                            display: 'block',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '180px',
                            height: '180px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#64748b',
                          }}
                        >
                          <QrCode size={48} />
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        marginTop: '0.85rem',
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.65)',
                        maxWidth: '220px',
                        lineHeight: 1.4,
                      }}
                    >
                      Scan at desk for instant check-in at <strong>Aryabhata Hall</strong>
                    </div>

                    {/* Refresh status button for attendee while waiting */}
                    <button
                      type="button"
                      onClick={handleRefreshStatus}
                      disabled={isRefreshing}
                      className="no-print"
                      style={{
                        marginTop: '0.75rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.75rem',
                        color: '#00e5ff',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem 0.5rem',
                      }}
                    >
                      <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
                      <span>{isRefreshing ? 'Checking...' : 'Refresh status'}</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Event Info Strip */}
                <div
                  style={{
                    backgroundColor: 'rgba(11, 27, 51, 0.95)',
                    padding: '0.85rem 2rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <div>
                    <strong>Date &amp; Venue:</strong> 21–22 Nov 2026 · Aryabhata Hall, University of Calicut
                  </div>
                  <div>
                    <strong>Organised by:</strong> Science Orbit Forum &amp; Swaminathan Chair
                  </div>
                </div>
              </div>

              {/* Action Buttons for Delegate */}
              <div
                className="no-print"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  justifyContent: 'center',
                  marginBottom: '3rem',
                }}
              >
                <button
                  type="button"
                  onClick={handlePrint}
                  className="icrast-btn icrast-btn--primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.9rem',
                  }}
                >
                  <Printer size={16} />
                  <span>Print / Save Badge (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="icrast-btn icrast-btn--outline-red"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.9rem',
                  }}
                >
                  <Share2 size={16} />
                  <span>{copiedLink ? 'Link Copied!' : 'Share / Copy Pass Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDelegate(null);
                    setPhoneInput('');
                    setQrDataUrl('');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.75rem 1.25rem',
                    fontSize: '0.85rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    cursor: 'pointer',
                  }}
                >
                  <span>Switch Delegate</span>
                </button>
              </div>
            </Reveal>
          )}

          {/* Quick Help / Instructions Card */}
          <Reveal delay={200}>
            <div
              className="no-print"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '1.75rem',
              }}
            >
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <ShieldCheck size={18} style={{ color: '#00e5ff' }} />
                <span>Instructions for Conference Delegates</span>
              </h3>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.75)',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                }}
              >
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <ChevronRight size={16} style={{ color: '#d4af37', flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    <strong>Arrival:</strong> Present this digital badge on your mobile device at the check-in counter in <strong>Aryabhata Hall</strong> upon arrival on 21 November 2026.
                  </span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <ChevronRight size={16} style={{ color: '#d4af37', flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    <strong>Instant Check-in:</strong> Our volunteer desk will scan your QR code to record your attendance and hand over your delegate kit and lanyard.
                  </span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <ChevronRight size={16} style={{ color: '#d4af37', flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    <strong>Certificates:</strong> Validated attendance via counter check-in is required for issuing the official Certificate of Participation.
                  </span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <ChevronRight size={16} style={{ color: '#d4af37', flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    <strong>Need Help?</strong> For any registration discrepancy, please contact the secretariat at <a href="tel:+919656930916" style={{ color: '#93c5fd' }}>+91 96569 30916</a> or email <a href="mailto:info@scienceorbitforum.org" style={{ color: '#93c5fd' }}>info@scienceorbitforum.org</a>.
                  </span>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Print-specific style sheet */}
      <style>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
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
