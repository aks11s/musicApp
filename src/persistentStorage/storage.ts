import {MMKV} from 'react-native-mmkv';
import type {StorageKey} from './keys';

const mmkv = new MMKV();

export const getObject = <T>(key: StorageKey): T | null => {
  const raw = mmkv.getString(key);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    // corrupted entry — drop it rather than crashing on every read
    mmkv.delete(key);
    return null;
  }
};

export const setObject = <T>(key: StorageKey, value: T): void => {
  mmkv.set(key, JSON.stringify(value));
};

export const remove = (key: StorageKey): void => {
  mmkv.delete(key);
};
