import {StorageKeys} from './keys';
import {getObject, setObject, subscribe} from './storage';

export const readRecentlyPlayed = <T>(): T[] => getObject<T[]>(StorageKeys.recentlyPlayed) ?? [];

export const writeRecentlyPlayed = <T>(items: T[]): void => {
  setObject(StorageKeys.recentlyPlayed, items);
};

export const subscribeRecentlyPlayed = (onChange: () => void): (() => void) =>
  subscribe(StorageKeys.recentlyPlayed, onChange);
