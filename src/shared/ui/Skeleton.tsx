import React, {useEffect} from 'react';
import {type ViewStyle, type StyleProp} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

const PULSE_DURATION = 700;
const MIN_OPACITY = 0.35;

type SkeletonProps = {
  width: number;
  height: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

export const Skeleton = ({width, height, radius, style}: SkeletonProps): React.JSX.Element => {
  const {styles, theme} = useStyles(stylesheet);
  const opacity = useSharedValue(MIN_OPACITY);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, {duration: PULSE_DURATION}), -1, true);
  }, [opacity]);

  const pulse = useAnimatedStyle(() => ({opacity: opacity.value}));

  return (
    <Animated.View
      style={[
        styles.block,
        {width, height, borderRadius: radius ?? theme.radii.sm},
        pulse,
        style,
      ]}
    />
  );
};

const stylesheet = createStyleSheet(theme => ({
  block: {
    backgroundColor: theme.colors.surface,
  },
}));
