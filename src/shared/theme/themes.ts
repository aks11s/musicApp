import {palette, radii, spacing, typography} from './tokens';

const shared = {spacing, radii, typography};

export const lightTheme = {
  ...shared,
  colors: {
    background: palette.white,
    surface: '#F5F5F8',
    text: palette.ink900,
    textMuted: palette.ink500,
    accent: palette.accent,
    border: palette.ink100,
    danger: palette.danger,
    tabBar: palette.white,
    tabActive: palette.accent,
    tabInactive: palette.ink300,
  },
} as const;

export const darkTheme = {
  ...shared,
  colors: {
    background: palette.ink900,
    surface: palette.ink800,
    text: palette.white,
    textMuted: palette.ink300,
    accent: palette.accentSoft,
    border: palette.ink700,
    danger: palette.danger,
    tabBar: palette.ink800,
    tabActive: palette.accentSoft,
    tabInactive: palette.ink500,
  },
} as const;
