import { Section } from '../kit';
import { Logo, LogoMark } from '../../components/ui/Logo';

const CONTEXTS = ['Website header', 'Social media', 'Event posters', 'Certificates', 'Documents', 'Watermarks'];

const DO_NOT = ['Detailed planets', 'Complex illustrations', 'Direct generic atom', 'Excessive gradients', 'Overly decorative symbols'];

/**
 * 04 · LOGO / WORDMARK
 */
export function LogoSection() {
  return (
    <Section
      id="logo"
      index="04"
      title="Logo & wordmark"
      lede="A minimal orbital symbol: one ring, one tilted orbital path, a central node and two constellation nodes. Abstract and geometric — never a literal planet. It reads consistently on light and dark surfaces and scales from a 16px social avatar to a large poster mark."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-6)', marginTop: 'var(--space-7)' }}>
        <div className="gallery__item">
          <p className="eyebrow">Horizontal lockup (primary)</p>
          <div style={{ padding: 'var(--space-7)', background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginTop: 'var(--space-3)' }}>
            <Logo size={48} />
          </div>
          <p className="type-line__label" style={{ marginTop: 'var(--space-3)' }}>
            Mark + “SCIENCE ORBIT FORUM” + department line
          </p>
        </div>

        <div className="gallery__item gallery__item--dark">
          <p className="eyebrow eyebrow--light">On dark</p>
          <div style={{ padding: 'var(--space-7)', background: 'linear-gradient(180deg, #0A1A33, #071A2F)', borderRadius: 'var(--radius-lg)', border: '1px solid rgb(244 248 252 / 0.1)', marginTop: 'var(--space-3)' }}>
            <Logo size={48} tone="dark" />
          </div>
          <p className="type-line__label" style={{ color: 'var(--color-text-inverse-muted)', marginTop: 'var(--space-3)' }}>
            Light mark, cyan path, inverse words
          </p>
        </div>

        <div className="gallery__item">
          <p className="eyebrow">Icon / mark only</p>
          <div style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'center', marginTop: 'var(--space-3)' }}>
            <LogoMark size={64} tone="light" />
            <LogoMark size={64} tone="light" />
          </div>
          <p className="type-line__label" style={{ marginTop: 'var(--space-3)' }}>
            Favicon, avatars, app icon, stickers
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            {[20, 32, 48].map((s) => (
              <span key={s} style={{ width: s, height: s }}><LogoMark size={s} tone="light" /></span>
            ))}
          </div>
        </div>

        <div className="gallery__item gallery__item--dark">
          <p className="eyebrow eyebrow--light">Mark on dark</p>
          <div style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'center', marginTop: 'var(--space-3)' }}>
            <LogoMark size={64} tone="dark" />
            <LogoMark size={64} tone="dark" />
          </div>
          <p className="type-line__label" style={{ color: 'var(--color-text-inverse-muted)', marginTop: 'var(--space-3)' }}>
            Certificates, posters, dark headers
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-7)' }}>
        <div className="gallery__item">
          <p className="eyebrow">Usage contexts</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
            {CONTEXTS.map((c) => (
              <span key={c} className="tag tag--accent">{c}</span>
            ))}
          </div>
        </div>
        <div className="gallery__item" style={{ background: 'var(--color-surface-blue)' }}>
          <p className="eyebrow">Never</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-3) 0 0', display: 'grid', gap: 'var(--space-2)', color: 'var(--color-text-muted)' }}>
            {DO_NOT.map((d) => (
              <li key={d}>✕ {d}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}