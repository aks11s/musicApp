// Every storage key in the app is declared here — prevents collisions between features.
export const StorageKeys = {
  recentlyPlayed: 'recentlyPlayed',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
