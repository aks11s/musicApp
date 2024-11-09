import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TAB_BAR_CONTENT_HEIGHT, TAB_BAR_TOP_PADDING} from './constants';

export function useTabBarHeight(): number {
  const insets = useSafeAreaInsets();
  return TAB_BAR_TOP_PADDING + TAB_BAR_CONTENT_HEIGHT + insets.bottom;
}
