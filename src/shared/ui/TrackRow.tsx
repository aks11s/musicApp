import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ROW_HEIGHT = 70;
const ARTWORK_SIZE = 52;
const PLAY_SIZE = 34;
const PLAY_ICON_SIZE = 14;
const MENU_ICON_SIZE = 17;

type TrackRowProps = {
  title: string;
  subtitle: string;
  artworkUrl: string;
  onPress?: () => void;
  onPlay?: () => void;
  onMenu?: () => void;
};

export const TrackRow = React.memo(({
  title,
  subtitle,
  artworkUrl,
  onPress,
  onPlay,
  onMenu,
}: TrackRowProps): React.JSX.Element => {
    const {styles, theme} = useStyles(stylesheet);
    // a fresh uri object on every render remounts the image
    const source = React.useMemo(() => ({uri: artworkUrl}), [artworkUrl]);

    const Row = onPress ? TouchableOpacity : View;
    const Play = onPlay ? TouchableOpacity : View;
    const Menu = onMenu ? TouchableOpacity : View;

    return (
      <Row style={styles.row} onPress={onPress}>
        <Image source={source} style={styles.artwork} />

        <View style={styles.texts}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>

        <Play style={styles.play} onPress={onPlay}>
          <Ionicons name="play" size={PLAY_ICON_SIZE} color={theme.colors.background} />
        </Play>

        <Menu style={styles.menu} onPress={onMenu}>
          <Ionicons
            name="ellipsis-vertical"
            size={MENU_ICON_SIZE}
            color={theme.colors.textMuted}
          />
        </Menu>
      </Row>
    );
  },
);

TrackRow.displayName = 'TrackRow';

const stylesheet = createStyleSheet(theme => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ROW_HEIGHT,
    gap: theme.spacing.md + 1,
    paddingHorizontal: theme.spacing.sm,
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.surface,
  },
  texts: {
    flex: 1,
  },
  title: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.row,
    color: theme.colors.text,
  },
  subtitle: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textMuted,
  },
  play: {
    width: PLAY_SIZE,
    height: PLAY_SIZE,
    borderRadius: PLAY_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.accent,
  },
  menu: {
    width: 24,
    alignItems: 'center',
  },
}));
