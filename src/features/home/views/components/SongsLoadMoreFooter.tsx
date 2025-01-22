import React from 'react';
import Animated, {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SONGS_PULL_TRIGGER} from '../../models/constants';

const ICON_SIZE = 18;
const MAX_HEIGHT = 56;

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

type SongsLoadMoreFooterProps = {
  overscroll: SharedValue<number>;
};

export const SongsLoadMoreFooter = ({
  overscroll,
}: SongsLoadMoreFooterProps): React.JSX.Element => {
  const {styles, theme} = useStyles(stylesheet);

  const container = useAnimatedStyle(() => ({
    height: interpolate(overscroll.value, [0, SONGS_PULL_TRIGGER], [0, MAX_HEIGHT], 'clamp'),
    opacity: interpolate(overscroll.value, [0, SONGS_PULL_TRIGGER], [0, 1], 'clamp'),
  }));

  const spin = useAnimatedStyle(() => ({
    transform: [
      {rotate: `${interpolate(overscroll.value, [0, SONGS_PULL_TRIGGER], [0, 360], 'clamp')}deg`},
    ],
  }));

  return (
    <Animated.View style={[styles.footer, container]}>
      <AnimatedIcon
        name="sync-outline"
        size={ICON_SIZE}
        color={theme.colors.accent}
        style={spin}
      />
      <Animated.Text style={styles.label}>Load more</Animated.Text>
    </Animated.View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    overflow: 'hidden',
  },
  label: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.accent,
  },
}));
