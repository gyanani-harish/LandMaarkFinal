/**
 * Typography System Scale
 * Limits font sizes, font weights, and couples sizes with their standard line heights.
 */

export const FONT_SIZES = {
  12: { px: '12px', rem: '0.75rem', lineHeight: '1rem' },
  14: { px: '14px', rem: '0.875rem', lineHeight: '1.25rem' },
  16: { px: '16px', rem: '1rem', lineHeight: '1.5rem' },
  18: { px: '18px', rem: '1.125rem', lineHeight: '1.75rem' },
  20: { px: '20px', rem: '1.25rem', lineHeight: '1.75rem' },
  24: { px: '24px', rem: '1.5rem', lineHeight: '2rem' },
  30: { px: '30px', rem: '1.875rem', lineHeight: '2.25rem' },
  36: { px: '36px', rem: '2.25rem', lineHeight: '2.5rem' },
} as const;

export const FONT_WEIGHTS = {
  400: '400',
  500: '500',
  600: '600',
  700: '700',
} as const;

export type FontSizes = typeof FONT_SIZES;
export type FontWeights = typeof FONT_WEIGHTS;
