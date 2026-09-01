import { PageHero } from '../components/site/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        lede="The terms that apply when you use the Science Orbit Forum website."
        roomy
      />

      <section className="container section" style={{ maxWidth: 760 }}>
        <div style={{ marginTop: 'var(--space-2)' }}>
        <h2 style={{ fontSize: 'var(--text-h3)', marginTop: 'var(--space-6)' }}>Introduction</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          Welcome to Science Orbit Forum. By accessing or using our website, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our website.
        </p>

        <h2 style={{ fontSize: 'var(--text-h3)', marginTop: 'var(--space-6)' }}>Acceptance of Terms</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          By accessing this website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to any part of these terms, you must not use our website.
        </p>

        <h2 style={{ fontSize: 'var(--text-h3)', marginTop: 'var(--space-6)' }}>Changes to Terms</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          Science Orbit Forum reserves the right to modify these Terms of Use at any time. We will notify users of significant changes by posting the updated terms on this page. Your continued use of the website after such modifications constitutes your acceptance of the updated terms.
        </p>

        <h2 style={{ fontSize: 'var(--text-h3)', marginTop: 'var(--space-6)' }}>Use of the Website</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          You agree to use this website for lawful purposes only. You may not:
        </p>
        <ul style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, paddingLeft: 'var(--space-5)' }}>
          <li>Use the website for any illegal or unauthorized purpose.</li>
          <li>Attempt to gain unauthorized access to any portion of the website.</li>
          <li>Interfere with or disrupt the website or servers connected to the website.</li>
          <li>Use the website to harass, abuse, or harm others.</li>
          <li>Post or transmit any content that is harmful, threatening, abusive, defamatory, or otherwise objectionable.</li>
        </ul>

        <h2 style={{ fontSize: 'var(--text-h3)', marginTop: 'var(--space-6)' }}>Membership</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          By applying for membership with Science Orbit Forum, you agree to provide accurate and complete information. Science Orbit Forum reserves the right to approve or decline membership applications at its discretion. Membership does not confer any proprietary rights to Science Orbit Forum content or resources.
        </p>

        <h2 style={{ fontSize: 'var(--text-h3)', marginTop: 'var(--space-6)' }}>Intellectual Property</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          All content on this website, including text, graphics, logos, images, and software, is the property of Science Orbit Forum or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from any content without explicit written permission.
        </p>

        <h2 style={{ fontSize: 'var(--text-h3)', marginTop: 'var(--space-6)' }}>User-Generated Content</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          If you submit content to Science Orbit Forum (such as through membership applications, event registrations, or other interactions), you grant Science Orbit Forum a non-exclusive, royalty-free license to use, display, and distribute such content for the purposes of operating and promoting the forum.
        </p>

        <h2 style={{ fontSize: 'var(--text-h3)', marginTop: 'var(--space-6)' }}>Disclaimer of Warranties</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          The website and its content are provided "as is" without any warranties, express or implied. Science Orbit Forum does not warrant that the website will be uninterrupted, timely, secure, or error-free.
        </p>

        <h2 style={{ fontSize: 'var(--text-h3)', marginTop: 'var(--space-6)' }}>Limitation of Liability</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          Science Orbit Forum shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the website. In no event shall Science Orbit Forum's total liability exceed the amount you paid, if any, for accessing the website.
        </p>

        <h2 style={{ fontSize: 'var(--text-h3)', marginTop: 'var(--space-6)' }}>Indemnification</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          You agree to indemnify and hold Science Orbit Forum harmless from any claims, damages, or expenses arising from your use of the website or your violation of these Terms of Use.
        </p>

        <h2 style={{ fontSize: 'var(--text-h3)', marginTop: 'var(--space-6)' }}>Governing Law</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          These Terms of Use shall be governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Kerala, India.
        </p>

        <h2 style={{ fontSize: 'var(--text-h3)', marginTop: 'var(--space-6)' }}>Contact Information</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          If you have questions about these Terms of Use, please contact us at:
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
