import {palette, radii, spacing, typography} from './tokens';

const shared = {spacing, radii, typography};

export const lightTheme = {
  ...shared,
  colors: {
    background: palette.white,
    surface: palette.surfaceMuted,
    text: palette.textPrimary,
    textMuted: palette.textMuted,
    accent: palette.accent,
    border: palette.hairline,
    danger: palette.danger,
    tabBar: palette.white,
    tabActive: palette.accent,
    tabInactive: palette.textFaint,
  },
} as const;

export const darkTheme = {
  ...shared,
  colors: {
    background: palette.night900,
    surface: palette.night800,
    text: palette.white,
    textMuted: palette.textFaint,
    accent: palette.accentSoft,
    border: palette.night700,
    danger: palette.danger,
    tabBar: palette.night800,
    tabActive: palette.accentSoft,
    tabInactive: palette.night500,
  },
} as const;
