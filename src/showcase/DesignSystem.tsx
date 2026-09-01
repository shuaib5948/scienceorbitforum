import { HeroSection } from './sections/HeroSection';
import { BrandSection } from './sections/BrandSection';
import { ColorSection } from './sections/ColorSection';
import { TypographySection } from './sections/TypographySection';
import { LogoSection } from './sections/LogoSection';
import { SpacingSection } from './sections/SpacingSection';
import { GridSection } from './sections/GridSection';
import { ButtonSection } from './sections/ButtonSection';
import { CardSection } from './sections/CardSection';
import { IconSection } from './sections/IconSection';
import { ImageSection } from './sections/ImageSection';
import { MotionSection } from './sections/MotionSection';
import { ResponsiveSection } from './sections/ResponsiveSection';
import { ComponentSection } from './sections/ComponentSection';
import { TokenSection } from './sections/TokenSection';

const JUMPS: Array<readonly [string, string]> = [
  ['#', 'Cover'],
  ['#brand', '01 Brand'],
  ['#colour', '02 Colour'],
  ['#typography', '03 Type'],
  ['#logo', '04 Logo'],
  ['#spacing', '05 Spacing'],
  ['#grid', '06 Grid'],
  ['#buttons', '07 Buttons'],
  ['#cards', '08 Cards'],
  ['#icons', '09 Icons'],
  ['#imagery', '10 Imagery'],
  ['#motion', '11 Motion'],
  ['#responsive', '12 Responsive'],
  ['#components', '13 Components'],
  ['#tokens', '14 Tokens'],
];

/**
 * SCIENCE ORBIT FORUM — living design-system showcase (Phase 1).
 * Illustrates all 14 deliverables. No page-level content.
 */
export function DesignSystem() {
  return (
    <>
      <nav className="ds-jump" aria-label="Design system sections">
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          {JUMPS.map(([href, label]) => (
            <a key={href + label} className="ds-jump__link" href={href}>
              {label}
            </a>
          ))}
        </div>
      </nav>

      <HeroSection />

      <div id="brand" style={{ scrollMarginTop: 'var(--header-height)' }}>
        <BrandSection />
      </div>
      <ColorSection />
      <TypographySection />
      <LogoSection />
      <SpacingSection />
      <GridSection />
      <ButtonSection />
      <CardSection />
      <IconSection />
      <ImageSection />
      <MotionSection />
      <ResponsiveSection />
      <ComponentSection />
      <TokenSection />
    </>
  );
}