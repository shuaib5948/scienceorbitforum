import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  X,
  QrCode,
  Smartphone,
  Copy,
  Check,
  Building,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { UPI_CONFIG } from '../../data/support';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  frequency: 'one-time' | 'annual';
}

export function UpiPaymentModal({
  isOpen,
  onClose,
  amount,
  frequency,
}: UpiPaymentModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Build the official NPCI UPI intent URL
  const note = `${UPI_CONFIG.note} (${frequency === 'annual' ? 'Annual' : 'One-time'})`;
  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(
    UPI_CONFIG.vpa
  )}&pn=${encodeURIComponent(UPI_CONFIG.payeeName)}&am=${
    amount > 0 ? amount : ''
  }&cu=INR&tn=${encodeURIComponent(note)}`;

  // Generate large high-resolution QR code
  useEffect(() => {
    if (!isOpen) return;
    let active = true;

    QRCode.toDataURL(upiIntentUrl, {
      width: 480,
      margin: 1,
      color: {
        dark: '#0a192f',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate UPI QR code', err);
      });

    return () => {
      active = false;
    };
  }, [isOpen, upiIntentUrl]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: 'upi' | 'ifsc') => {
    navigator.clipboard?.writeText(text);
    if (type === 'upi') {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2200);
    } else {
      setCopiedIfsc(true);
      setTimeout(() => setCopiedIfsc(false), 2200);
    }
  };

  return (
    <div className="upi-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="upi-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="upi-modal-header">
          <div className="upi-modal-title-group">
            <span className="upi-modal-eyebrow">Zero-Fee Direct Contribution</span>
            <div className="upi-modal-amount-row">
              <h2 className="upi-modal-amount">
                ₹{amount.toLocaleString('en-IN')}
              </h2>
              <span className="upi-modal-freq-tag">
                {frequency === 'annual' ? 'Annual Support' : 'One-Time Gift'}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="upi-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="upi-modal-body">
          {/* 0% Commission Guarantee */}
          <div className="upi-zero-cost-banner">
            <Sparkles size={16} className="upi-zero-cost-banner__icon" />
            <div className="upi-zero-cost-banner__text">
              <strong>100% Free · 0% Payment Gateway Fee</strong>
              <span>Direct zero-commission settlement straight to Science Orbit Forum</span>
            </div>
          </div>

          {/* Large Hero Scannable QR Code */}
          <div className="upi-large-qr-section">
            <div className="upi-large-qr-frame">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`Scan to pay ₹${amount} via UPI`}
                  className="upi-large-qr-image"
                />
              ) : (
                <div className="upi-qr-placeholder">
                  <RefreshCw size={28} className="upi-spin" />
                  <span>Generating QR...</span>
                </div>
              )}
              <div className="upi-large-qr-amount-pill">
                <QrCode size={14} />
                <span>₹{amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="upi-large-qr-hint">
              Scan with any UPI app (Google Pay, PhonePe, Paytm, BHIM, Cred)
            </p>
          </div>

          {/* Mobile 1-Click Pay Button */}
          <div className="upi-mobile-box">
            <a
              href={upiIntentUrl}
              className="upi-pay-now-btn"
              aria-label={`Pay ₹${amount} via installed UPI apps`}
            >
              <Smartphone size={18} />
              <span>Open &amp; Pay ₹{amount.toLocaleString('en-IN')} in UPI App</span>
              <ExternalLink size={15} />
            </a>
          </div>

          {/* Copy UPI VPA Strip */}
          <div className="upi-vpa-strip">
            <div className="upi-vpa-info">
              <span className="upi-vpa-label">Official UPI ID</span>
              <code className="upi-vpa-id">{UPI_CONFIG.vpa}</code>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(UPI_CONFIG.vpa, 'upi')}
              className="upi-copy-btn"
              aria-label="Copy UPI ID"
            >
              {copiedUpi ? (
                <>
                  <Check size={14} color="#16a34a" />
                  <span style={{ color: '#16a34a' }}>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy UPI ID</span>
                </>
              )}
            </button>
          </div>

          {/* Direct Bank NEFT / IMPS Accordion */}
          <div className="upi-accordion">
            <button
              type="button"
              className="upi-accordion-trigger"
              onClick={() => setShowBankDetails((prev) => !prev)}
              aria-expanded={showBankDetails}
            >
              <div className="upi-accordion-trigger__left">
                <Building size={16} />
                <span>Prefer Direct Bank Transfer (NEFT / RTGS / IMPS)?</span>
              </div>
              <ChevronDown
                size={16}
                className={`upi-accordion-arrow ${showBankDetails ? 'is-open' : ''}`}
              />
            </button>

            {showBankDetails && (
              <div className="upi-accordion-content">
                <div className="upi-bank-grid">
                  <div className="upi-bank-row">
                    <span className="upi-bank-key">Account Name</span>
                    <strong className="upi-bank-val">{UPI_CONFIG.bankDetails.accountName}</strong>
                  </div>
                  <div className="upi-bank-row">
                    <span className="upi-bank-key">Bank &amp; Branch</span>
                    <span className="upi-bank-val">
                      {UPI_CONFIG.bankDetails.bankName}, {UPI_CONFIG.bankDetails.branch}
                    </span>
                  </div>
                  <div className="upi-bank-row">
                    <span className="upi-bank-key">IFSC Code</span>
                    <div className="upi-bank-copyable">
                      <code>{UPI_CONFIG.bankDetails.ifsc}</code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(UPI_CONFIG.bankDetails.ifsc, 'ifsc')}
                        className="upi-mini-copy"
                        aria-label="Copy IFSC Code"
                      >
                        {copiedIfsc ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                  <div className="upi-bank-row">
                    <span className="upi-bank-key">Account Number</span>
                    <span className="upi-bank-val">{UPI_CONFIG.bankDetails.accountNumber}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="upi-modal-footer">
          <ShieldCheck size={14} />
          <span>Regulated under NPCI &amp; RBI UPI guidelines. 0% gateway commission.</span>
        </div>
      </div>
    </div>
  );
}
