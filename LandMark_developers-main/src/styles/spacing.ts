/**
 * Spacing System Scale
 * Limits spacing values to the allowed 11 steps: 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 (px)
 */

export const SPACING = {
  0: { px: '0px', rem: '0rem' },
  4: { px: '4px', rem: '0.25rem' },
  8: { px: '8px', rem: '0.5rem' },
  12: { px: '12px', rem: '0.75rem' },
  16: { px: '16px', rem: '1rem' },
  20: { px: '20px', rem: '1.25rem' },
  24: { px: '24px', rem: '1.5rem' },
  32: { px: '32px', rem: '2rem' },
  40: { px: '40px', rem: '2.5rem' },
  48: { px: '48px', rem: '3rem' },
  64: { px: '64px', rem: '4rem' },
} as const;

export type SpacingScale = typeof SPACING;
export type SpacingValue = keyof SpacingScale;
