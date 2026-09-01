import { Section } from '../kit';
import { Icon } from '../../components/ui/Icon';

const SHOTS: Array<{ icon: 'microscope' | 'presentation' | 'users' | 'research' | 'code' | 'telescope'; label: string; note: string; bg: string }> = [
  { icon: 'microscope', label: 'Laboratory work', note: 'Students at benches, instruments in frame', bg: '#0E4F86' },
  { icon: 'presentation', label: 'Presentations', note: 'Academic gatherings and talks', bg: '#123B63' },
  { icon: 'users', label: 'Collaboration', note: 'Students working together on projects', bg: '#0B4A7D' },
  { icon: 'research', label: 'Exhibitions', note: 'Models, posters and science fairs', bg: '#17B6D9' },
  { icon: 'code', label: 'Technology', note: 'Code, sensors and instrumentation', bg: '#0A87A8' },
  { icon: 'telescope', label: 'Observations', note: 'Fieldwork and astronomy sessions', bg: '#06223E' },
];

const AVOID = ['Generic corporate office photos', 'Overused stock scientist imagery', 'Artificial AI-generated people', 'Excessive space imagery'];

/**
 * 10 · IMAGE DIRECTION
 */
export function ImageSection() {
  return (
    <Section
      id="imagery"
      index="10"
      title="Image direction"
      lede="Authentic Science Orbit Forum photography first — real students at real events. When placeholders are needed, use high-quality editorial scientific photography. Warm, documentary, human and precise; never corporate or artificial."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-5)', marginTop: 'var(--space-7)' }}>
        {SHOTS.map((s) => (
          <div key={s.label} className="image-card" style={{ aspectRatio: '4 / 3' }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(160deg, ${s.bg}, #06101F)`,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <span style={{ color: 'rgba(244,248,252,0.9)', display: 'inline-flex' }}>
                <Icon name={s.icon} size={40} strokeWidth={1.3} />
              </span>
            </div>
            <div className="image-card__caption">
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>{s.label}</div>
              <div style={{ fontWeight: 400, opacity: 0.85, fontSize: 13, marginTop: 4 }}>{s.note}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-6)', marginTop: 'var(--space-7)' }}>
        <div className="gallery__item">
          <p className="eyebrow">Preferred tone</p>
          <ul style={{ margin: 'var(--space-3) 0 0', color: 'var(--color-text-muted)', listStyle: 'none', padding: 0, display: 'grid', gap: 'var(--space-2)' }}>
            <li>✓ Real student activities & exhibitions</li>
            <li>✓ Lab work, instruments & workshops</li>
            <li>✓ Academic gatherings & presentations</li>
            <li>✓ Consistent cool / neutral edit</li>
            <li>✓ Placeholders: editorial scientific shots</li>
          </ul>
        </div>
        <div className="gallery__item" style={{ background: 'var(--color-surface-blue)' }}>
          <p className="eyebrow">Avoid</p>
          <ul style={{ margin: 'var(--space-3) 0 0', color: 'var(--color-text-muted)', listStyle: 'none', padding: 0, display: 'grid', gap: 'var(--space-2)' }}>
            {AVOID.map((a) => (
              <li key={a}>✕ {a}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}