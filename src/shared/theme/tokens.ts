export const palette = {
  black: '#000000',
  white: '#FFFFFF',
  // dark-mode surfaces
  night900: '#0E0E12',
  night800: '#16161C',
  night700: '#1F1F27',
  night500: '#3A3A46',
  // neutrals (light theme, matches Figma)
  textPrimary: '#1A1B1E',
  textMuted: '#8A8B90',
  textFaint: '#BFC0C4',
  surfaceMuted: '#F5F5F6',
  hairline: 'rgba(0,0,0,0.06)',
  // brand
  accent: '#F5871F',
  accentSoft: '#FFA351',
  danger: '#FF5470',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

export const typography = {
  sizes: {
    micro: 10.5,
    caption: 11.5,
    small: 12.5,
    body: 13,
    subtitle: 15,
    title: 16,
    heading: 21,
  },
  weights: {
    regular: '400',
    semibold: '600',
    bold: '700',
  },
  // static font instances — pair with fontFamily, not fontWeight, to avoid synthetic bold
  families: {
    regular: 'Sora-Regular',
    semibold: 'Sora-SemiBold',
    bold: 'Sora-Bold',
  },
} as const;
