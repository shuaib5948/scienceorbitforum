import { PageHero } from '../components/site/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        lede="How Science Orbit Forum handles the information shared with the forum."
        roomy
      />

      <section className="container section" style={{ maxWidth: 760 }}>
        <div style={{ marginTop: 'var(--space-2)' }}>
        <h2 style={{ fontSize: 'var(--text-h3)', marginTop: 'var(--space-6)' }}>Introduction</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          Science Orbit Forum ("we", "our", or "the forum") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect the information you provide when you interact with our website, participate in our programmes, or apply for membership.
        </p>

        <h2 style={{ fontSize: 'var(--text-h3)', marginTop: 'var(--space-6)' }}>Information We Collect</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          We may collect the following types of information:
        </p>
        <ul style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, paddingLeft: 'var(--space-5)' }}>
          <li><strong>Personal Information:</strong> Name, email address, phone number, location, educational/professional background, and area of interest provided through membership applications.</li>
          <li><strong>Optional Information:</strong> Social or profile links, short introductions, and other voluntarily shared details.</li>
          <li><strong>Usage Data:</strong> Website usage information, such as pages visited, time spent, and browser type, collected through standard web analytics.</li>
        </ul>

        <h2 style={{ fontSize: 'var(--text-h3)', marginTop: 'var(--space-6)' }}>How We Use Your Information</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          We use the information we collect for the following purposes:
        </p>
        <ul style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, paddingLeft: 'var(--space-5)' }}>
          <li>To process and respond to membership applications.</li>
          <li>To communicate with you about events, programmes, and activities.</li>
          <li>To improve our website and services.</li>
          <li>To understand how our community engages with Science Orbit Forum.</li>
        </ul>

        <h2 style={{ fontSize: 'var(--text-h3)', marginTop: 'var(--space-6)' }}>Data Security</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          We take reasonable measures to protect the information you share with us. However, no method of transmission over the internet is completely secure. While we strive to protect your personal information, we cannot guarantee absolute security.
        </p>

        <h2 style={{ fontSize: 'var(--text-h3)', marginTop: 'var(--space-6)' }}>Data Sharing</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          We do not sell, trade, or rent your personal information to third parties. We may share information only when necessary to:
        </p>
        <ul style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, paddingLeft: 'var(--space-5)' }}>
          <li>Comply with legal obligations.</li>
          <li>Protect our rights and the rights of our community members.</li>
          <li>Prevent fraud or abuse of our services.</li>
        </ul>

        <h2 style={{ fontSize: 'var(--text-h3)', marginTop: 'var(--space-6)' }}>Your Rights</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          You have the right to:
        </p>
        <ul style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, paddingLeft: 'var(--space-5)' }}>
          <li>Access the personal information we hold about you.</li>
          <li>Request correction of inaccurate information.</li>
          <li>Request deletion of your personal information.</li>
          <li>Withdraw consent for future communications.</li>
        </ul>

        <h2 style={{ fontSize: 'var(--text-h3)', marginTop: 'var(--space-6)' }}>Cookies</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          Our website may use cookies to enhance user experience. Cookies are small files stored on your device that help us understand how you use our site. You can choose to accept or decline cookies through your browser settings.
        </p>

        <h2 style={{ fontSize: 'var(--text-h3)', marginTop: 'var(--space-6)' }}>Changes to This Policy</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page.
        </p>

        <h2 style={{ fontSize: 'var(--text-h3)', marginTop: 'var(--space-6)' }}>Contact Us</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          If you have questions about this Privacy Policy or how we handle your information, please contact us at:
        </p>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          <strong>Email:</strong> info@scienceorbitforum.org
        </p>

        <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-6)', fontSize: 'var(--text-body-small)' }}>
          Last updated: August 2026
        </p>
        </div>
      </section>
    </>
  );
}
