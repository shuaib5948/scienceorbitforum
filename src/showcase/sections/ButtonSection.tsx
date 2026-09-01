import { Section } from '../kit';
import { Button, ButtonLink } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';

/**
 * 07 · BUTTON SYSTEM
 */
export function ButtonSection() {
  return (
    <Section
      id="buttons"
      index="07"
      title="Buttons"
      lede="Four compact, elegant button styles. Defaults reset to a calm state; arrows nudge forward on hover. Every state — hover, active, focus and disabled — is defined below."
    >
      <div className="gallery" style={{ marginTop: 'var(--space-7)' }}>
        <div className="gallery__item">
          <p className="eyebrow">Variants</p>
          <div className="gallery__row" style={{ marginTop: 'var(--space-4)' }}>
            <Button variant="primary" withArrow>Explore Events</Button>
            <Button variant="navy">Discover Science Orbit Forum</Button>
            <Button variant="secondary" withArrow>View Event</Button>
            <Button variant="ghost" withArrow>Read More</Button>
          </div>
        </div>

        <div className="gallery__item gallery__item--dark">
          <p className="eyebrow eyebrow--light">On dark</p>
          <div className="gallery__row" style={{ marginTop: 'var(--space-4)' }}>
            <Button variant="primary">Explore Events</Button>
            <Button variant="inverse">Discover Science Orbit Forum</Button>
            <Button variant="ghost">Read More</Button>
          </div>
        </div>

        <div className="gallery__item">
          <p className="eyebrow">Sizes</p>
          <div className="gallery__row" style={{ marginTop: 'var(--space-4)' }}>
            <Button size="sm" variant="primary">Small · 36</Button>
            <Button size="md" variant="primary">Medium · 44</Button>
            <Button size="lg" variant="primary">Large · 52</Button>
          </div>
        </div>

        <div className="gallery__item">
          <p className="eyebrow">States</p>
          <div className="gallery__row" style={{ marginTop: 'var(--space-4)' }}>
            <Button variant="secondary">Default</Button>
            <Button variant="secondary" disabled>Disabled</Button>
          </div>
          <div style={{ marginTop: 'var(--space-4)', display: 'grid', gap: 'var(--space-2)', fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>
            <span>Hover → lifts 1px, deepens colour, arrow nudges →</span>
            <span>Active → flat press, darker fill</span>
            <span>Focus → 2px cyan outline</span>
          </div>
        </div>
      </div>

      <div className="gallery__row" style={{ marginTop: 'var(--space-7)', alignItems: 'center' }}>
        <ButtonLink href="#events" variant="primary" withArrow>Explore Events</ButtonLink>
        <ButtonLink href="#about" variant="secondary">Discover Science Orbit Forum</ButtonLink>
        <ButtonLink href="#updates" variant="ghost" withArrow>Read More</ButtonLink>
        <Button variant="primary" withArrow>
          <Icon name="calendar" size={18} />
          Sessions
        </Button>
      </div>
    </Section>
  );
}