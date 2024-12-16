import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {Skeleton} from '../../../../shared/ui/Skeleton';
import {SKELETON_COUNT} from '../../models/constants';

const ArtistAvatarSkeleton = (): React.JSX.Element => {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.card}>
      <Skeleton width={96} height={96} radius={48} />
      <Skeleton width={64} height={10} />
    </View>
  );
};

export const ArtistAvatarSkeletonRow = (): React.JSX.Element => (
  <>
    {Array.from({length: SKELETON_COUNT}, (_, i) => (
      <ArtistAvatarSkeleton key={i} />
    ))}
  </>
);

const stylesheet = createStyleSheet(theme => ({
  card: {
    width: 96,
    alignItems: 'center',
    gap: theme.spacing.sm + 1,
  },
}));
