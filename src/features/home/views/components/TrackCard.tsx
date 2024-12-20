import React from 'react';
import {Image, Text, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import type {Track} from '../../models/types';

type TrackCardProps = {
  track: Track;
  size: number;
};

export const TrackCard = React.memo(({track, size}: TrackCardProps): React.JSX.Element => {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.card(size)}>
      <Image source={{uri: track.artworkUrl}} style={styles.artwork(size)} />
      <Text style={styles.title} numberOfLines={1}>
        {track.title}
      </Text>
      <Text style={styles.artist} numberOfLines={1}>
        {track.artist}
      </Text>
    </View>
  );
});

TrackCard.displayName = 'TrackCard';

const stylesheet = createStyleSheet(theme => ({
  card: (size: number) => ({
    width: size,
  }),
  artwork: (size: number) => ({
    width: size,
    height: size,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.surface,
  }),
  title: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text,
    paddingTop: theme.spacing.sm + 1,
  },
  artist: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.textMuted,
  },
}));
