import { Section } from '../kit';
import { Icon } from '../../components/ui/Icon';

const MOTIONS = [
  ['Fade', '200–500ms, opacity', 'All reveals & transitions'],
  ['Slide', '16–24px, upward', 'Entrance of cards and sections'],
  ['Scale', 'Subtle 1–4%', 'Image hover zoom, focus states'],
  ['Arial reveal', '600ms ease-out', 'Media cropping into place'],
  ['Hover movement', '−4px lift', 'Cards and buttons'],
  ['Orbital drift', '60–90s loop', 'Decorative ring + dot rotation'],
];

const AVOID = ['Flashing', 'Excessive particles', 'Constant spinning', 'Aggressive parallax', 'Heavy 3D'];

/**
 * 11 · MOTION PRINCIPLES
 */
export function MotionSection() {
  return (
    <Section
      id="motion"
      index="11"
      title="Motion"
      lede="Calm, intelligent and premium. Motion supports readability with fade, subtle slide and gentle scale — plus a slow orbital drift for selected decorative elements. Nothing flashes, spins constantly or distracts."
      tone="dark"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-7)' }}>
        <div className="gallery__item gallery__item--dark" style={{ background: 'rgba(244,248,252,0.04)', borderColor: 'rgb(244 248 252 / 0.12)' }}>
          <p className="eyebrow eyebrow--light">Transitions</p>
          <div style={{ display: 'grid', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            {MOTIONS.map(([name, timing, use]) => (
              <div key={name} style={{ display: 'grid', gridTemplateColumns: '150px 190px 1fr', gap: 'var(--space-3)', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: '#fff' }}>{name}</span>
                <span style={{ fontSize: 13, color: 'var(--color-text-inverse-muted)', fontVariantNumeric: 'tabular-nums' }}>{timing}</span>
                <span style={{ fontSize: 13, color: 'var(--color-text-inverse-muted)' }}>{use}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="gallery__item gallery__item--dark" style={{ background: 'rgba(244,248,252,0.04)', borderColor: 'rgb(244 248 252 / 0.12)' }}>
          <p className="eyebrow eyebrow--light">Durations & easing</p>
          <div style={{ display: 'grid', gap: 'var(--space-3)', marginTop: 'var(--space-4)', color: 'var(--color-text-inverse-muted)' }}>
            {[['150ms', 'fast · micro-interactions'], ['250ms', 'base · hovers, states'], ['500ms', 'slow · panels, overlays']].map(([t, l]) => (
              <div key={t}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', fontSize: 20 }}>{t}</span>
                <div style={{ fontSize: 13 }}>{l}</div>
              </div>
            ))}
            <div style={{ marginTop: 'var(--space-2)' }}>
              <div style={{ fontSize: 13 }}>Easing</div>
              <code style={{ fontSize: 12, color: 'var(--color-accent)' }}>cubic-bezier(0.22,1,0.36,1)</code>
            </div>
          </div>
        </div>
      </div>

      <div className="gallery" style={{ marginTop: 'var(--space-7)' }}>
        <div className="gallery__item gallery__item--dark" style={{ background: 'rgba(244,248,252,0.04)', borderColor: 'rgb(244 248 252 / 0.12)' }}>
          <p className="eyebrow eyebrow--light">Live · subtle orbital drift</p>
          <div style={{ position: 'relative', height: 200, marginTop: 'var(--space-3)', overflow: 'hidden', borderRadius: 'var(--radius-lg)', background: 'radial-gradient(120% 120% at 20% 0%, #123B63, #06101F)' }}>
            <span className="orb-ring" style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)', borderColor: 'rgb(24 182 217 / 0.3)' }} />
            <span className="orb-ring--accent" style={{ left: '50%', top: '60%', borderColor: 'rgb(24 182 217 / 0.4)' }} />
            <span className="orb-dot" style={{ top: '22%', right: '28%' }} />
            <span className="orb-dot--soft" style={{ bottom: '28%', left: '24%' }} />
            <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'rgba(244,248,252,0.9)' }}>
              <Icon name="orbit" size={64} strokeWidth={1.2} />
            </span>
          </div>
          <p className="type-line__label" style={{ color: 'var(--color-text-inverse-muted)', marginTop: 'var(--space-3)' }}>
            Rings rotate 60–90s · respects prefers-reduced-motion
          </p>
        </div>

        <div className="gallery__item gallery__item--dark" style={{ background: 'rgba(244,248,252,0.04)', borderColor: 'rgb(244 248 252 / 0.12)' }}>
          <p className="eyebrow eyebrow--light">Never</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-3) 0 0', color: 'var(--color-text-inverse-muted)', display: 'grid', gap: 'var(--space-2)' }}>
            {AVOID.map((a) => (
              <li key={a}>✕ {a}</li>
            ))}
          </ul>
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {['CALM', 'INTELLIGENT', 'PREMIUM'].map((w) => (
              <span key={w} className="tag" style={{ background: 'rgba(24,182,217,0.14)', color: '#C8ECFB', borderColor: 'transparent' }}>{w}</span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}