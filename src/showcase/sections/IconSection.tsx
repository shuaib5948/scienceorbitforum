import { Section } from '../kit';
import { Icon, type IconName } from '../../components/ui/Icon';

const ICONS: Array<[IconName, string]> = [
  ['orbit', 'Orbit'],
  ['microscope', 'Microscope'],
  ['atom', 'Atom'],
  ['dna', 'DNA'],
  ['telescope', 'Telescope'],
  ['code', 'Code'],
  ['lightbulb', 'Lightbulb'],
  ['research', 'Research'],
  ['presentation', 'Presentation'],
  ['innovation', 'Innovation'],
  ['users', 'Collaboration'],
  ['calendar', 'Calendar'],
  ['clock', 'Time'],
  ['pin', 'Location'],
  ['docs', 'Documents'],
  ['arrow-right', 'Arrow'],
];

const RULES = [
  'One line-icon family only — never mixed',
  'Consistent 1.5px stroke',
  'Geometric, minimal, rounded caps',
  'Colour inherits from currentColor',
  'Optional with text, never oversized',
];

/**
 * 09 · ICON SYSTEM
 */
export function IconSection() {
  return (
    <Section
      id="icons"
      index="09"
      title="Iconography"
      lede="A clean modern line-icon set drawn on a consistent 24px grid with a 1.5px stroke. Icons are used sparingly as amplification, never as decoration. They remain minimal, consistent and scientific."
    >
      <div className="swatch__grid" style={{ marginTop: 'var(--space-7)', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {ICONS.map(([name, label]) => (
          <div key={name} className="swatch">
            <div
              className="swatch__chip"
              style={{ display: 'grid', placeItems: 'center', background: 'var(--color-surface-muted)' }}
            >
              <Icon name={name} size={32} strokeWidth={1.5} />
            </div>
            <div style={{ padding: 'var(--space-3) var(--space-4)' }}>
              <div className="swatch__name">{label}</div>
              <div className="swatch__hex">{name}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="gallery" style={{ marginTop: 'var(--space-7)' }}>
        <div className="gallery__item">
          <p className="eyebrow">Usage rules</p>
          <ul style={{ margin: 'var(--space-3) 0 0', color: 'var(--color-text-muted)', display: 'grid', gap: 'var(--space-2)', listStyle: 'none', padding: 0 }}>
            {RULES.map((r) => (
              <li key={r}>• {r}</li>
            ))}
          </ul>
        </div>
        <div className="gallery__item gallery__item--dark">
          <p className="eyebrow eyebrow--light">Inline & contextual</p>
          <div className="gallery__row" style={{ marginTop: 'var(--space-4)' }}>
            <Icon name="calendar" size={18} />
            <Icon name="microscope" size={18} />
            <Icon name="atom" size={18} />
            <Icon name="telescope" size={18} />
            <Icon name="lightbulb" size={18} />
          </div>
          <p className="type-line__label" style={{ color: 'var(--color-text-inverse-muted)', marginTop: 'var(--space-3)' }}>
            16 / 20 / 24 / 32px — never stretched
          </p>
        </div>
      </div>
    </Section>
  );
}