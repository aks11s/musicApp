import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type {Track} from '../../../../domain/types';
import {toImageSource} from '../../../../shared/lib/imageSource';
import {RECENT_TRACK_ARTWORK_SIZE, RECENT_TRACK_CARD_WIDTH} from '../../models/constants';

type RecentTrackCardProps = {
  track: Track;
  onPress: () => void;
};

export const RecentTrackCard = React.memo(({track, onPress}: RecentTrackCardProps): React.JSX.Element => {
  const {styles, theme} = useStyles(stylesheet);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={toImageSource(track.artworkUrl)} style={styles.artwork} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {track.artist}
        </Text>
      </View>
      <Ionicons name="play" size={16} color={theme.colors.accent} style={styles.play} />
    </TouchableOpacity>
  );
});

RecentTrackCard.displayName = 'RecentTrackCard';

const stylesheet = createStyleSheet(theme => ({
  card: {
    width: RECENT_TRACK_CARD_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.sm,
    borderRadius: theme.radii.md + 4,
    backgroundColor: theme.colors.surface,
  },
  artwork: {
    width: RECENT_TRACK_ARTWORK_SIZE,
    height: RECENT_TRACK_ARTWORK_SIZE,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.border,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text,
  },
  artist: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.textMuted,
    paddingTop: 2,
  },
  play: {
    marginRight: theme.spacing.sm,
    marginLeft: 2,
  },
}));
