import { useState } from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ButtonLink } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { PageHero } from '../components/site/PageHero';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  background: string;
  interest: string;
  introduction: string;
  profileLink: string;
  consent: boolean;
}

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    background: '',
    interest: '',
    introduction: '',
    profileLink: '',
    consent: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend when available
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (submitted) {
    return (
      <div className="container section" style={{ textAlign: 'center', maxWidth: 680 }}>
        <Reveal>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'var(--color-surface-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-6)',
            fontSize: 40,
          }}>
            ✓
          </div>
          <SectionHeading
            eyebrow="Thank You"
            title="Your application has been submitted."
            align="center"
          />
          <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>
            We have received your membership application. The Science Orbit Forum team will review your information and get in touch with you soon.
          </p>
          <div style={{ marginTop: 'var(--space-6)' }}>
            <ButtonLink href="/" withArrow>Return to Homepage</ButtonLink>
          </div>
        </Reveal>
      </div>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Join Science Orbit Forum"
        title="Become Part of the Orbit"
        lede="Become part of a growing community of curious minds exploring science, research and innovation."
        roomy
      />

      <section className="container section">
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <SectionHeading
            eyebrow="Who Can Participate"
            title="Science Orbit Forum welcomes curious minds from all backgrounds."
          />
          <ul style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-4)', paddingLeft: 'var(--space-5)' }}>
            <li>Students</li>
            <li>Researchers</li>
            <li>Educators</li>
            <li>Science enthusiasts</li>
            <li>Innovators</li>
            <li>Anyone genuinely interested in science and learning</li>
          </ul>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-surface-muted)' }}>
        <div className="container">
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <SectionHeading
              eyebrow="Membership Application"
              title="Tell us about yourself"
              align="center"
            />
            
            <form onSubmit={handleSubmit} style={{ marginTop: 'var(--space-6)' }}>
              <Reveal>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  <div>
                    <label htmlFor="fullName" style={{ display: 'block', fontWeight: 600, marginBottom: 'var(--space-2)', fontSize: 'var(--text-body-small)' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: 'var(--space-3)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-body)',
                        fontFamily: 'inherit',
                      }}
                      placeholder="Your full name"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <div>
                      <label htmlFor="email" style={{ display: 'block', fontWeight: 600, marginBottom: 'var(--space-2)', fontSize: 'var(--text-body-small)' }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: 'var(--space-3)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 'var(--text-body)',
                          fontFamily: 'inherit',
                        }}
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" style={{ display: 'block', fontWeight: 600, marginBottom: 'var(--space-2)', fontSize: 'var(--text-body-small)' }}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: 'var(--space-3)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 'var(--text-body)',
                          fontFamily: 'inherit',
                        }}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="location" style={{ display: 'block', fontWeight: 600, marginBottom: 'var(--space-2)', fontSize: 'var(--text-body-small)' }}>
                      Location *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: 'var(--space-3)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-body)',
                        fontFamily: 'inherit',
                      }}
                      placeholder="City, State/Country"
                    />
                  </div>

                  <div>
                    <label htmlFor="background" style={{ display: 'block', fontWeight: 600, marginBottom: 'var(--space-2)', fontSize: 'var(--text-body-small)' }}>
                      Educational / Professional Background *
                    </label>
                    <textarea
                      id="background"
                      name="background"
                      value={formData.background}
                      onChange={handleChange}
                      required
                      rows={3}
                      style={{
                        width: '100%',
                        padding: 'var(--space-3)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-body)',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                      }}
                      placeholder="Tell us about your educational or professional background..."
                    />
                  </div>

                  <div>
                    <label htmlFor="interest" style={{ display: 'block', fontWeight: 600, marginBottom: 'var(--space-2)', fontSize: 'var(--text-body-small)' }}>
                      Area of Interest *
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: 'var(--space-3)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-body)',
                        fontFamily: 'inherit',
                        backgroundColor: 'var(--color-surface)',
                      }}
                    >
                      <option value="">Select your area of interest</option>
                      <option value="physics">Physics</option>
                      <option value="chemistry">Chemistry</option>
                      <option value="biology">Biology</option>
                      <option value="mathematics">Mathematics</option>
                      <option value="computer-science">Computer Science</option>
                      <option value="engineering">Engineering</option>
                      <option value="environmental-science">Environmental Science</option>
                      <option value="astronomy">Astronomy</option>
                      <option value="general-science">General Science</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="introduction" style={{ display: 'block', fontWeight: 600, marginBottom: 'var(--space-2)', fontSize: 'var(--text-body-small)' }}>
                      Short Introduction *
                    </label>
                    <textarea
                      id="introduction"
                      name="introduction"
                      value={formData.introduction}
                      onChange={handleChange}
                      required
                      rows={4}
                      style={{
                        width: '100%',
                        padding: 'var(--space-3)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-body)',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                      }}
                      placeholder="Tell us briefly about yourself and why you want to join Science Orbit Forum..."
                    />
                  </div>

                  <div>
                    <label htmlFor="profileLink" style={{ display: 'block', fontWeight: 600, marginBottom: 'var(--space-2)', fontSize: 'var(--text-body-small)' }}>
                      Social / Profile Link (Optional)
                    </label>
                    <input
                      type="url"
                      id="profileLink"
                      name="profileLink"
                      value={formData.profileLink}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: 'var(--space-3)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-body)',
                        fontFamily: 'inherit',
                      }}
                      placeholder="LinkedIn, personal website, or other profile"
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      required
                      style={{ marginTop: 4, width: 18, height: 18 }}
                    />
                    <label htmlFor="consent" style={{ fontSize: 'var(--text-body-small)', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                      I agree that the information provided is accurate and I consent to Science Orbit Forum contacting me regarding my membership application. I understand that my data will be processed in accordance with the Privacy Policy.
                    </label>
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      height: 'var(--button-height-lg)',
                      backgroundColor: 'var(--color-secondary)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all var(--duration-base) var(--ease-standard)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-secondary-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-secondary)';
                    }}
                  >
                    Become a Science Orbit Forum Member
                  </button>
                </div>
              </Reveal>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
