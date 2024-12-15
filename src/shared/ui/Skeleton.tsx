import React, {useEffect, useRef} from 'react';
import {Animated, type ViewStyle, type StyleProp} from 'react-native';
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
  const opacity = useRef(new Animated.Value(MIN_OPACITY)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: PULSE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: MIN_OPACITY,
          duration: PULSE_DURATION,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.block,
        {width, height, borderRadius: radius ?? theme.radii.sm, opacity},
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
