import type {ImageURISource} from 'react-native';

// RN warns on an empty uri; no source leaves the placeholder background showing
export const toImageSource = (url: string): ImageURISource | undefined =>
  url ? {uri: url} : undefined;
