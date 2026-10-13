import React, { useState, useEffect, useId } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Smartphone,
  Copy,
  Check,
  Building,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { UPI_CONFIG } from '../../data/support';

const PRESET_AMOUNTS = [250, 500, 1000, 2500, 5000];

export function UpiDonationWidget() {
  const [frequency, setFrequency] = useState<'one-time' | 'annual'>('one-time');
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showReceiptForm, setShowReceiptForm] = useState(false);
  const [receiptSubmitted, setReceiptSubmitted] = useState(false);

  // UTR receipt fields
  const [receiptName, setReceiptName] = useState('');
  const [receiptEmail, setReceiptEmail] = useState('');
  const [receiptUtr, setReceiptUtr] = useState('');

  const customInputId = useId();

  // Active numeric amount
  const numericAmount =
    selectedAmount === 'custom'
      ? Math.max(10, parseInt(customAmount, 10) || 0)
      : selectedAmount;

  // Build the official NPCI UPI intent URL
  const note = `${UPI_CONFIG.note} (${frequency === 'annual' ? 'Annual' : 'One-time'})`;
  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(
    UPI_CONFIG.vpa
  )}&pn=${encodeURIComponent(UPI_CONFIG.payeeName)}&am=${
    numericAmount > 0 ? numericAmount : ''
  }&cu=INR&tn=${encodeURIComponent(note)}`;

  // Generate QR code on amount/frequency change
  useEffect(() => {
    let active = true;
    QRCode.toDataURL(upiIntentUrl, {
      width: 320,
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
  }, [upiIntentUrl]);

  const copyToClipboard = (text: string, type: 'upi' | 'ifsc' | 'acc') => {
    navigator.clipboard?.writeText(text);
    if (type === 'upi') {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2200);
    } else if (type === 'ifsc') {
      setCopiedIfsc(true);
      setTimeout(() => setCopiedIfsc(false), 2200);
    } else if (type === 'acc') {
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2200);
    }
  };

  const handleReceiptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptUtr.trim()) return;
    setReceiptSubmitted(true);
  };

  return (
    <div className="upi-widget-card" id="upi-donation-widget">
      {/* 0% Fee Zero-Cost Guarantee Badge */}
      <div className="upi-zero-cost-banner">
        <Sparkles size={16} className="upi-zero-cost-banner__icon" />
        <div className="upi-zero-cost-banner__text">
          <strong>100% Free · 0% Payment Gateway Fee</strong>
          <span>Direct zero-commission settlement straight to Science Orbit Forum</span>
        </div>
      </div>

      {/* Frequency Toggle */}
      <div className="donate-frequency-tabs" role="tablist" aria-label="Donation frequency">
        <button
          type="button"
          role="tab"
          aria-selected={frequency === 'one-time'}
          className={`donate-frequency-tab ${frequency === 'one-time' ? 'is-active' : ''}`}
          onClick={() => setFrequency('one-time')}
        >
          One-Time Gift
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={frequency === 'annual'}
          className={`donate-frequency-tab ${frequency === 'annual' ? 'is-active' : ''}`}
          onClick={() => setFrequency('annual')}
        >
          Annual Support
        </button>
      </div>

      {/* Preset Amount Chips */}
      <div className="donate-amounts-grid">
        {PRESET_AMOUNTS.map((amt) => {
          const active = selectedAmount === amt;
          return (
            <button
              key={amt}
              type="button"
              onClick={() => {
                setSelectedAmount(amt);
                setCustomAmount('');
              }}
              className={`donate-amount-btn ${active ? 'is-active' : ''}`}
            >
              ₹{amt.toLocaleString('en-IN')}
            </button>
          );
        })}
      </div>

      {/* Custom Amount Field */}
      <div
        className={`donate-custom-input-wrap ${
          selectedAmount === 'custom' ? 'is-focused' : ''
        }`}
      >
        <span className="donate-custom-prefix">₹</span>
        <input
          id={customInputId}
          type="number"
          min={10}
          placeholder="Enter other amount"
          value={customAmount}
          onFocus={() => setSelectedAmount('custom')}
          onChange={(e) => {
            setSelectedAmount('custom');
            setCustomAmount(e.target.value);
          }}
          className="donate-custom-input"
          aria-label="Custom contribution amount in INR"
        />
        <span className="donate-custom-currency">INR</span>
      </div>

      {/* Main Payment Section: Split between Mobile 1-Click Pay & Scannable QR */}
      <div className="upi-payment-stage">
        {/* Mobile 1-Click Intent Button */}
        <div className="upi-mobile-box">
          <a
            href={upiIntentUrl}
            className="upi-pay-now-btn"
            aria-label={`Pay ₹${numericAmount} via installed UPI apps`}
          >
            <Smartphone size={18} />
            <span>Pay ₹{numericAmount.toLocaleString('en-IN')} via UPI App</span>
            <ExternalLink size={15} />
          </a>
          <span className="upi-apps-hint">
            Works with Google Pay, PhonePe, Paytm, BHIM, Cred &amp; any UPI app
          </span>
        </div>

        {/* Dynamic QR Code Display */}
        <div className="upi-qr-box">
          <div className="upi-qr-frame">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`Scan to pay ₹${numericAmount} to ${UPI_CONFIG.payeeName}`}
                className="upi-qr-image"
              />
            ) : (
              <div className="upi-qr-placeholder">
                <RefreshCw size={24} className="upi-spin" />
                <span>Generating QR...</span>
              </div>
            )}
            <div className="upi-qr-badge">
              <QrCode size={13} />
              <span>₹{numericAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <span className="upi-qr-caption">
            Scan using any smartphone camera or UPI scanner
          </span>
        </div>
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
                <div className="upi-bank-copyable">
                  <span className="upi-bank-val">{UPI_CONFIG.bankDetails.accountNumber}</span>
                </div>
              </div>
            </div>
            <p className="upi-bank-note">
              Please include your name or mobile number in the transfer remarks for accurate reconciliation.
            </p>
          </div>
        )}
      </div>

      {/* Optional UTR / Receipt Submission */}
      <div className="upi-receipt-section">
        {!showReceiptForm ? (
          <button
            type="button"
            className="upi-receipt-toggle-btn"
            onClick={() => setShowReceiptForm(true)}
          >
            <span>Transferred already? Submit your UTR / Ref No. for official receipt</span>
            <ArrowRight size={14} />
          </button>
        ) : receiptSubmitted ? (
          <div className="upi-receipt-success">
            <CheckCircle2 size={22} className="upi-receipt-success__icon" />
            <div>
              <strong>Transaction Reference Received!</strong>
              <p>
                Thank you! We will verify your UTR and email an official Science Orbit Forum contribution receipt to{' '}
                <strong>{receiptEmail || 'your email'}</strong>.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReceiptSubmit} className="upi-receipt-form">
            <span className="upi-receipt-form-title">
              Request Official Donation Receipt
            </span>
            <div className="upi-receipt-form-grid">
              <input
                type="text"
                required
                placeholder="Your Full Name"
                value={receiptName}
                onChange={(e) => setReceiptName(e.target.value)}
                className="upi-receipt-input"
              />
              <input
                type="email"
                required
                placeholder="Email Address for Receipt"
                value={receiptEmail}
                onChange={(e) => setReceiptEmail(e.target.value)}
                className="upi-receipt-input"
              />
              <input
                type="text"
                required
                placeholder="12-digit UPI Ref / UTR Number"
                value={receiptUtr}
                onChange={(e) => setReceiptUtr(e.target.value)}
                className="upi-receipt-input upi-receipt-input--full"
              />
            </div>
            <button type="submit" className="upi-receipt-submit-btn">
              <span>Submit for Receipt</span>
              <Check size={15} />
            </button>
          </form>
        )}
      </div>

      {/* Governance & Trust Footer */}
      <div className="donate-widget-footnote">
        <ShieldCheck size={14} />
        <span>
          Regulated under NPCI &amp; RBI UPI guidelines. 0% gateway commission.
        </span>
      </div>
    </div>
  );
}
