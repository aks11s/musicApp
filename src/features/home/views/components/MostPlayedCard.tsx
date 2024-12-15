import React from 'react';
import {Image, Text, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import type {Track} from '../../models/types';

type MostPlayedCardProps = {track: Track};

export const MostPlayedCard = ({track}: MostPlayedCardProps): React.JSX.Element => {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.mostPlayedCard}>
      <Image source={{uri: track.artworkUrl}} style={styles.mostPlayedArtwork} />
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
  mostPlayedCard: {
    width: 128,
  },
  mostPlayedArtwork: {
    width: 128,
    height: 128,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.surface,
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
