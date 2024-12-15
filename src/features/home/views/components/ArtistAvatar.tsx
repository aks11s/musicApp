import React from 'react';
import {Image, Text, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import type {Artist} from '../../models/types';

type ArtistAvatarProps = {artist: Artist};

export const ArtistAvatar = ({artist}: ArtistAvatarProps): React.JSX.Element => {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.artistCard}>
      <Image source={{uri: artist.avatarUrl}} style={styles.artistAvatar} />
      <Text style={styles.artistName} numberOfLines={1}>
        {artist.name}
      </Text>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  artistCard: {
    width: 96,
    alignItems: 'center',
    gap: theme.spacing.sm + 1,
  },
  artistAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  artistName: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text,
    textAlign: 'center',
  },
}));
