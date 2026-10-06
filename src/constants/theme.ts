/**
 * Design tokens extracted directly from the Figma file
 * (Prototyping-6, node 926-19672) for the Saved Receipts flow.
 * This is a single fixed visual design (no dark mode in the source design).
 */

export const Colors = {
  // Backgrounds
  canvas: '#ffffff',
  module: '#f7f9fa',
  darkBackground: '#142641',
  border1: '#e5e9f0',
  border2: '#eef1f4',
  border: '#b8bfcc',
  accentContainer: '#e8f0fe',
  accentActive: '#3f68ff',
  overlayPopupBg: 'rgba(15, 22, 33, 0.5)',

  // Text
  textTitle: '#0f1621',
  textBody: '#0f1621',
  textSecondary: '#6b7485',
  textDisabled: '#9ba3b3',
  textOnColor: '#ffffff',
  textAccent: '#3f68ff',

  // Buttons
  buttonPrimaryDefault: '#3f68ff',
  buttonPrimaryActive: '#093999',
  buttonPrimaryDisabled: '#e5e9f0',
  buttonSecondaryBorder: '#3f68ff',
  buttonTertiaryHover: '#e8f0fe',

  // Feedback
  success: '#19b269',
  danger: '#e72626',

  // My Documents folder tints
  receiptsTint: '#f2f8f9',
  lmnTint: '#f3f2f9',
  statementsTint: '#f9fbf4',
  taxFormsTint: '#faf2f7',

  // Transaction category tiles (used on Associate With Claim)
  medical: '#00c3b3',
  pharmacy: '#d83b00',
  dental: '#176af6',
  vision: '#481a54',
} as const;

export const Typography = {
  h2Bold24: { fontSize: 24, lineHeight: 32, fontWeight: '700' as const },
  oswaldBold52: { fontSize: 36, lineHeight: 40, fontWeight: '700' as const }, // scaled down from 52/32 header display for mobile viewport fit
  body1Regular16: { fontSize: 16, lineHeight: 22, fontWeight: '400' as const },
  body1Bold16: { fontSize: 16, lineHeight: 22, fontWeight: '700' as const },
  body2Regular14: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  body2Bold14: { fontSize: 14, lineHeight: 20, fontWeight: '700' as const },
  captionMedium12: { fontSize: 12, lineHeight: 18, fontWeight: '500' as const },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 999,
} as const;
