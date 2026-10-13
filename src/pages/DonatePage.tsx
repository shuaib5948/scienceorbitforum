import { useState, type FormEvent } from 'react';
import { PageHero } from '../components/site/PageHero';
import { Reveal } from '../components/ui/Reveal';
import { UpiPaymentModal } from '../components/donate/UpiPaymentModal';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

export default function DonatePage() {
  const [frequency, setFrequency] = useState<'one-time' | 'annual'>('one-time');
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeNumericAmount =
    selectedAmount === 'custom'
      ? Math.max(10, parseInt(customAmount, 10) || 500)
      : selectedAmount;

  const displayAmount =
    selectedAmount === 'custom'
      ? customAmount
        ? `₹${Number(customAmount).toLocaleString('en-IN')}`
        : ''
      : `₹${selectedAmount.toLocaleString('en-IN')}`;

  const handleDonateSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      <PageHero
        className="page-hero--people-gradient"
        eyebrow="Direct Zero-Cost Contribution"
        title="Contribute to Science Orbit Forum"
        lede="Your contribution directly empowers open science education, student fellowships, conferences, and community discovery programmes across Kerala and beyond."
      />

      <section className="container section">
        <Reveal>
          <div className="donate-widget-layout">
            {/* Left Column: Mission Impact & Zero-Fee Guarantee */}
            <div className="donate-widget-info">
              <span className="subdomain-eyebrow">Zero-Gateway-Fee Guarantee</span>
              <h2 className="subdomain-heading">Direct UPI &amp; Bank Contribution</h2>
              <p className="donate-widget-info__lede">
                Science Orbit Forum accepts contributions directly through NPCI / RBI UPI and direct bank wire transfers with <strong>0% payment gateway fees</strong>. Every single rupee goes directly into funding scientific programs.
              </p>

              <div className="donate-benefits-list">
                <div className="donate-benefit-pill">
                  <CheckCircle2 size={16} className="donate-benefit-pill__icon" />
                  <span><strong>100% Free:</strong> 0% transaction fee or gateway deduction. 100% funds science initiatives.</span>
                </div>
                <div className="donate-benefit-pill">
                  <CheckCircle2 size={16} className="donate-benefit-pill__icon" />
                  <span><strong>Instant Mobile UPI:</strong> 1-click pay via Google Pay, PhonePe, Paytm, BHIM, Cred.</span>
                </div>
                <div className="donate-benefit-pill">
                  <CheckCircle2 size={16} className="donate-benefit-pill__icon" />
                  <span><strong>Direct Bank Settlement:</strong> NPCI &amp; RBI compliant direct account transfers.</span>
                </div>
                <div className="donate-benefit-pill">
                  <CheckCircle2 size={16} className="donate-benefit-pill__icon" />
                  <span><strong>Transparent Governance:</strong> Managed under SOF compliance &amp; audited financial reporting.</span>
                </div>
              </div>

              <div className="donate-widget-info__meta">
                <span>
                  Looking for institutional grants, sponsorships, or CSR partnerships?{' '}
                  <Link to="/support">
                    Explore Support Avenues →
                  </Link>
                </span>
              </div>
            </div>

            {/* Right Column: Clean Donation Box */}
            <div className="donate-widget-card">
              <form onSubmit={handleDonateSubmit} className="donate-widget-form">
                {/* Frequency Toggle */}
                <div
                  className="donate-frequency-tabs"
                  role="tablist"
                  aria-label="Contribution frequency"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={frequency === 'one-time'}
                    className={`donate-frequency-tab ${
                      frequency === 'one-time' ? 'is-active' : ''
                    }`}
                    onClick={() => setFrequency('one-time')}
                  >
                    One-Time Gift
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={frequency === 'annual'}
                    className={`donate-frequency-tab ${
                      frequency === 'annual' ? 'is-active' : ''
                    }`}
                    onClick={() => setFrequency('annual')}
                  >
                    Annual Support
                  </button>
                </div>

                {/* Preset Amounts Grid */}
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
                        className={`donate-amount-btn ${
                          active ? 'is-active' : ''
                        }`}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount Input */}
                <div
                  className={`donate-custom-input-wrap ${
                    selectedAmount === 'custom' ? 'is-focused' : ''
                  }`}
                >
                  <span className="donate-custom-prefix">₹</span>
                  <input
                    type="number"
                    min={10}
                    placeholder="Other amount"
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

                {/* Primary Donate Button */}
                <button type="submit" className="donate-submit-btn">
                  <span>
                    Donate {displayAmount ? displayAmount : 'Now'}
                    {frequency === 'annual' ? ' / year' : ''}
                  </span>
                  <ArrowRight size={16} />
                </button>

                <p className="donate-widget-footnote">
                  <ShieldCheck size={14} />
                  <span>
                    Direct zero-commission UPI settlement · NPCI &amp; RBI compliant.
                  </span>
                </p>
              </form>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Payment Modal */}
      <UpiPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        amount={activeNumericAmount}
        frequency={frequency}
      />
    </>
  );
}
