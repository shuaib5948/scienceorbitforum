import { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Reveal } from '../components/ui/Reveal';
import { IcrastLayout } from '../components/icrast/IcrastLayout';
import { trackPageView } from '../lib/analytics';
import {
  Clock,
  ArrowRight,
  FileText,
  Users,
  Home,
  AlertCircle,
} from 'lucide-react';

export default function IcrastSubmitClosedPage() {
  const isSubdomain =
    typeof window !== 'undefined' &&
    window.location.hostname.toLowerCase().startsWith('icrast.');

  const homePath = isSubdomain ? '/' : '/icrast';
  const fullPaperPath = isSubdomain ? '/full-paper' : '/icrast/full-paper';
  const registerPath = isSubdomain ? '/register' : '/icrast/register';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackPageView('/icrast/submit', 'ICRAST-26 Abstract Submissions Closed');
    document.title = 'Abstract Submissions Closed · ICRAST-26 · Science Orbit Forum';
  }, []);

  return (
    <IcrastLayout>
      <section
        className="container section icrast-submit-section"
        style={{
          paddingTop: 'clamp(5.5rem, 9vh, 7rem)',
          paddingBottom: 'clamp(3.5rem, 6vh, 5rem)',
        }}
      >
        <div style={{ maxWidth: '780px', marginInline: 'auto' }}>
          <Reveal>
            <div className="membership-form-card" style={{ textAlign: 'center', padding: 'clamp(2rem, 5vw, 3rem)' }}>
              {/* Status Pill */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
                <span
                  className="membership-category-pill"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#dc2626',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontWeight: 700,
                  }}
                >
                  <Clock size={13} />
                  Abstract Submissions Closed
                </span>
              </div>

              {/* Main Heading */}
              <h1
                style={{
                  color: '#0b1b33',
                  fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
                  lineHeight: 1.3,
                  fontWeight: 800,
                  margin: '0 0 0.85rem',
                }}
              >
                Abstract Submission Period Concluded
              </h1>

              {/* Subtitle & Note */}
              <p
                style={{
                  color: '#475569',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  maxWidth: '620px',
                  margin: '0 auto 2rem',
                }}
              >
                The abstract submission deadline for <strong>ICRAST-26</strong> closed on{' '}
                <strong>06 November 2026</strong>. Peer evaluations have completed and notifications have been dispatched. Thank you to all researchers and academicians who submitted their work.
              </p>

              {/* Action Cards Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.25rem',
                  textAlign: 'left',
                  margin: '0 0 2rem',
                }}
              >
                {/* Card 1: Accepted Authors Full Paper */}
                <div
                  style={{
                    border: '1px solid rgba(51, 85, 255, 0.25)',
                    background: 'linear-gradient(180deg, rgba(51, 85, 255, 0.04) 0%, rgba(255, 255, 255, 0.9) 100%)',
                    borderRadius: '14px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: 'rgba(51, 85, 255, 0.12)',
                        color: '#3355ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.85rem',
                      }}
                    >
                      <FileText size={20} />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', color: '#0b1b33', margin: '0 0 0.4rem', fontWeight: 700 }}>
                      Accepted Authors
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                      Authors of accepted abstracts can verify their registered email address to submit their paper.
                    </p>
                  </div>
                  <div style={{ marginTop: '1.25rem' }}>
                    <Link
                      to={fullPaperPath}
                      className="icrast-btn icrast-btn--primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <span>Submit Paper</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>

                {/* Card 2: Delegate Attendee Registration */}
                <div
                  style={{
                    border: '1px solid rgba(15, 23, 42, 0.12)',
                    background: '#f8fafc',
                    borderRadius: '14px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: 'rgba(15, 23, 42, 0.08)',
                        color: '#0b1b33',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.85rem',
                      }}
                    >
                      <Users size={20} />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', color: '#0b1b33', margin: '0 0 0.4rem', fontWeight: 700 }}>
                      Conference Attendees
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                      Attend keynotes and presentations in hybrid mode (on-campus at Aryabhata Hall or online). Free entry.
                    </p>
                  </div>
                  <div style={{ marginTop: '1.25rem' }}>
                    <Link
                      to={registerPath}
                      className="icrast-btn icrast-btn--outline-navy"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <span>Register to Attend</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Return to Home link */}
              <div style={{ paddingTop: '0.5rem' }}>
                <Link
                  to={homePath}
                  className="icrast-btn icrast-btn--ghost"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Home size={15} />
                  <span>Return to ICRAST-26 Home</span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </IcrastLayout>
  );
}
