import { useEffect, useState, type FormEvent } from 'react';
import { PageHero } from '../components/site/PageHero';
import { Reveal } from '../components/ui/Reveal';
import { UpiPaymentModal } from '../components/donate/UpiPaymentModal';
import {
  SUPPORT_INTRO,
  SUPPORT_AVENUES,
  SUPPORT_TRANSPARENCY,
} from '../data/support';
import {
  HeartHandshake,
  Building2,
  Landmark,
  Briefcase,
  GraduationCap,
  Users,
  Wrench,
  Sparkles,
  ShieldCheck,
  Mail,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const AVENUE_ICONS: Record<string, typeof HeartHandshake> = {
  'individual-donations': HeartHandshake,
  'csr-support': Building2,
  'research-grants': Landmark,
  'corporate-sponsorships': Briefcase,
  'academic-collaborations': GraduationCap,
  'membership-contributions': Users,
  'in-kind-volunteer': Wrench,
  'student-grants': Sparkles,
};

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

export default function SupportPage() {
  const [frequency, setFrequency] = useState<'one-time' | 'annual'>('one-time');
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const scrollToHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;
      const el = document.getElementById(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
      }
    };
    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

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
        eyebrow={SUPPORT_INTRO.eyebrow}
        title={SUPPORT_INTRO.title}
        lede={SUPPORT_INTRO.lede}
      />

      {/* Section 1: How You Can Support Us (4x2 Institutional Grid Cards) */}
      <section
        id="funding-and-support"
        className="container section membership-hub-section"
      >
        <Reveal>
          <div className="membership-section-head">
            <span className="subdomain-eyebrow">Support Avenues</span>
            <h2 className="subdomain-heading">How You Can Support Us</h2>
            <p className="subdomain-lede">
              Explore the pathways for individuals, institutions, companies, and funding agencies to collaborate with Science Orbit Forum.
            </p>
          </div>
        </Reveal>

        <div className="support-avenues-grid">
          {SUPPORT_AVENUES.map((avenue, idx) => {
            const IconComponent = AVENUE_ICONS[avenue.id] ?? HeartHandshake;
            return (
              <Reveal key={avenue.id} delay={idx * 45}>
                <article className="support-avenue-card">
                  <div className="support-avenue-card__top">
                    <div className="support-avenue-card__icon">
                      <IconComponent size={20} />
                    </div>
                    <span className="support-avenue-card__num">
                      {avenue.number}
                    </span>
                  </div>
                  <h3 className="support-avenue-card__title">
                    {avenue.title}
                  </h3>
                  <p className="support-avenue-card__desc">
                    {avenue.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Section 2: Transparency and Responsible Use of Funds */}
      <section
        id="transparency"
        className="membership-band membership-band--muted"
      >
        <div className="container">
          <Reveal>
            <div className="support-transparency-block">
              <div className="support-transparency-block__main">
                <div className="support-transparency-badge">
                  <ShieldCheck size={18} />
                  <span>Governance & Accountability</span>
                </div>
                <h2 className="subdomain-heading">
                  {SUPPORT_TRANSPARENCY.heading}
                </h2>
                {SUPPORT_TRANSPARENCY.paragraphs.map((p, idx) => (
                  <p key={idx} className="support-transparency-text">
                    {p}
                  </p>
                ))}
                <p className="support-transparency-tagline">
                  {SUPPORT_TRANSPARENCY.tagline}
                </p>
              </div>

              <div className="support-transparency-block__aside">
                <span className="support-aside-label">Official Channels</span>
                <p className="support-aside-note">
                  {SUPPORT_TRANSPARENCY.contactNote}
                </p>
                <a
                  href="mailto:info@scienceorbitforum.org"
                  className="support-aside-mail"
                >
                  <Mail size={16} />
                  <span>info@scienceorbitforum.org</span>
                </a>
                <a href="#donate" className="support-aside-cta">
                  <span>Donate Now</span>
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Section 3: Standard Institutional Donate Box with Modal Payment */}
      <section id="donate" className="membership-band">
        <div className="container">
          <Reveal>
            <div className="donate-widget-layout">
              {/* Left Column: Mission Impact & Direct Institutional Support */}
              <div className="donate-widget-info">
                <span className="subdomain-eyebrow">Support Science</span>
                <h2 className="subdomain-heading">Make a Contribution</h2>
                <p className="donate-widget-info__lede">
                  Your contribution directly supports scientific education, research outreach, student fellowships, and public science engagement programmes across Science Orbit Forum.
                </p>

                <div className="donate-benefits-list">
                  <div className="donate-benefit-pill">
                    <CheckCircle2 size={16} className="donate-benefit-pill__icon" />
                    <span><strong>100% Free:</strong> 0% gateway commission. Direct bank settlement.</span>
                  </div>
                  <div className="donate-benefit-pill">
                    <CheckCircle2 size={16} className="donate-benefit-pill__icon" />
                    <span><strong>Instant Mobile UPI:</strong> 1-click pay via Google Pay, PhonePe, Paytm &amp; Cred.</span>
                  </div>
                  <div className="donate-benefit-pill">
                    <CheckCircle2 size={16} className="donate-benefit-pill__icon" />
                    <span><strong>Official Receipt:</strong> Acknowledgment issued for all contributions.</span>
                  </div>
                </div>

                <div className="donate-widget-info__meta">
                  <span>
                    For CSR grants, institutional sponsorships, or bank wire inquiries, contact{' '}
                    <a href="mailto:info@scienceorbitforum.org">
                      info@scienceorbitforum.org
                    </a>
                    .
                  </span>
                </div>
              </div>

              {/* Right Column: Clean Original Donation Box */}
              <div className="donate-widget-card">
                <form onSubmit={handleDonateSubmit} className="donate-widget-form">
                  {/* Frequency Segmented Toggle */}
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
                      One-Time
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

                  {/* Custom Amount Input with ₹ Prefix */}
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

                  {/* Primary Donate Button (Opens Modal) */}
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
        </div>
      </section>

      {/* UPI Payment Modal with Dynamic QR & Payment Options */}
      <UpiPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        amount={activeNumericAmount}
        frequency={frequency}
      />
    </>
  );
}
