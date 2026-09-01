import tokens from './design-tokens.json' with { type: 'json' };

/**
 * SCIENCE ORBIT FORUM — design tokens (typed export).
 *
 * This file re-exports the machine-readable token set so components and
 * future pages can consume the same source of truth as the CSS custom
 * properties in `src/styles/tokens.css`.
 */

export interface TypeToken {
  size: number;
  lineHeight?: number;
  tracking?: string;
  weight: number;
  uppercase?: boolean;
}

export interface ButtonSize {
  height: number;
  padX: number;
  font: number;
}

export type DesignTokens = typeof tokens;

export const designTokens: DesignTokens = tokens;

export const brand = tokens.brand;
export const colors = tokens.color;
export const typeScale = tokens.typography.typeScale;
export const spacingScale = tokens.spacing.scale;
export const radius = tokens.radius;
export const shadows = tokens.shadow;
export const grid = tokens.gridSystem;
export const buttons = tokens.button;
export const icons = tokens.icon;
export const motion = tokens.motion;
export const responsive = tokens.responsive;

export const toPx = (value: number): string => `${value}px`;

/** Convert a type token into a CSS font-size declaration helper. */
export const fontSize = (key: keyof DesignTokens['typography']['typeScale']): string =>
  toPx(typeScale[key].size);