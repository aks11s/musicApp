import React from 'react';
import {Text, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import LinearGradient from 'react-native-linear-gradient';
import type {HomeTrackCard} from '../../models/types';

type TrackCardProps = {track: HomeTrackCard};

export const TrackCard = ({track}: TrackCardProps): React.JSX.Element => {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.trackCard}>
      <LinearGradient
        colors={track.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.trackArtwork}
      />
      <Text style={styles.trackTitle} numberOfLines={1}>
        {track.title}
      </Text>
      <Text style={styles.trackArtist} numberOfLines={1}>
        {track.artist}
      </Text>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  trackCard: {
    width: 128,
  },
  trackArtwork: {
    width: 128,
    height: 128,
    borderRadius: theme.radii.lg,
  },
  trackTitle: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text,
    paddingTop: theme.spacing.sm + 1,
  },
  trackArtist: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.textMuted,
  },
}));
