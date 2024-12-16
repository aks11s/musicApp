import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {Skeleton} from '../../../../shared/ui/Skeleton';
import {SKELETON_COUNT} from '../../models/constants';

const TrackCardSkeleton = (): React.JSX.Element => {
  const {styles, theme} = useStyles(stylesheet);

  return (
    <View style={styles.card}>
      <Skeleton width={128} height={128} radius={theme.radii.lg} />
      <Skeleton width={104} height={11} style={styles.title} />
      <Skeleton width={72} height={9} style={styles.artist} />
    </View>
  );
};

export const TrackCardSkeletonRow = (): React.JSX.Element => (
  <>
    {Array.from({length: SKELETON_COUNT}, (_, i) => (
      <TrackCardSkeleton key={i} />
    ))}
  </>
);

const stylesheet = createStyleSheet(theme => ({
  card: {
    width: 128,
  },
  title: {
    marginTop: theme.spacing.sm + 3,
  },
  artist: {
    marginTop: theme.spacing.xs + 2,
  },
}));
