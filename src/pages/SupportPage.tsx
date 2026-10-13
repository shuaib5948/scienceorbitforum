import { useEffect, useState, type FormEvent } from 'react';
import { PageHero } from '../components/site/PageHero';
import { Reveal } from '../components/ui/Reveal';
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

const PRESET_AMOUNTS = [1000, 2500, 5000, 10000];

export default function SupportPage() {
  const [frequency, setFrequency] = useState<'one-time' | 'annual'>('one-time');
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(5000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

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

  const displayAmount =
    selectedAmount === 'custom'
      ? customAmount
        ? `₹${Number(customAmount).toLocaleString('en-IN')}`
        : ''
      : `₹${selectedAmount.toLocaleString('en-IN')}`;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
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

      {/* Section 3: Standard Institutional Donate Now Widget */}
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

              {/* Right Column: Standard Donation Selector Card */}
              <div className="donate-widget-card">
                {submitted ? (
                  <div className="donate-widget-success">
                    <div className="donate-widget-success__icon">
                      <CheckCircle2 size={28} />
                    </div>
                    <h3 className="donate-widget-success__title">
                      Contribution Initiated
                    </h3>
                    <p className="donate-widget-success__text">
                      Thank you for your{' '}
                      <strong>
                        {frequency === 'annual' ? 'annual' : 'one-time'}
                      </strong>{' '}
                      contribution{displayAmount ? ` of ${displayAmount}` : ''}. Our online payment gateway integration is being finalised; please contact{' '}
                      <a href="mailto:info@scienceorbitforum.org">
                        info@scienceorbitforum.org
                      </a>{' '}
                      to complete your transfer and receive your official receipt.
                    </p>
                    <button
                      type="button"
                      className="donate-widget-reset"
                      onClick={() => setSubmitted(false)}
                    >
                      Change Amount
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="donate-widget-form">
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
                        min={100}
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
                        Managed in accordance with SOF financial governance &amp; compliance standards.
                      </span>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
