import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
  onMenu
}: TrackRowProps): React.JSX.Element => {
    const {styles, theme} = useStyles(stylesheet);

    return (
      <TouchableOpacity style={styles.row} onPress={onPress} disabled={!onPress}>
        <Image source={{uri: artworkUrl}} style={styles.artwork} />

        <View style={styles.texts}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>

        <TouchableOpacity style={styles.play} onPress={onPlay} disabled={!onPlay}>
          <Ionicons name="play" size={PLAY_ICON_SIZE} color={theme.colors.background} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menu} onPress={onMenu} disabled={!onMenu}>
          <Ionicons
            name="ellipsis-vertical"
            size={MENU_ICON_SIZE}
            color={theme.colors.textMuted}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  },
);

TrackRow.displayName = 'TrackRow';

const stylesheet = createStyleSheet(theme => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md + 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm + 1,
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
