export const palette = {
  black: '#000000',
  white: '#FFFFFF',
  ink900: '#0E0E12',
  ink800: '#16161C',
  ink700: '#1F1F27',
  ink500: '#3A3A46',
  ink300: '#8E8E9E',
  ink100: '#C9C9D4',
  accent: '#7C4DFF',
  accentSoft: '#B39DFF',
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
    caption: 12,
    body: 14,
    subtitle: 16,
    title: 20,
    heading: 28,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;
