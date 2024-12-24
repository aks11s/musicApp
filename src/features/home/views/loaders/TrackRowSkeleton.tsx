import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {Skeleton} from '../../../../shared/ui/Skeleton';
import {SONGS_SKELETON_COUNT, TRACK_ROW_ARTWORK_SIZE} from '../../models/constants';

const TrackRowSkeleton = (): React.JSX.Element => {
  const {styles, theme} = useStyles(stylesheet);

  return (
    <View style={styles.row}>
      <Skeleton
        width={TRACK_ROW_ARTWORK_SIZE}
        height={TRACK_ROW_ARTWORK_SIZE}
        radius={theme.radii.md}
      />
      <View style={styles.texts}>
        <Skeleton width={148} height={12} />
        <Skeleton width={96} height={10} style={styles.subtitle} />
      </View>
    </View>
  );
};

export const TrackRowSkeletonList = (): React.JSX.Element => (
  <>
    {Array.from({length: SONGS_SKELETON_COUNT}, (_, i) => (
      <TrackRowSkeleton key={i} />
    ))}
  </>
);

const stylesheet = createStyleSheet(theme => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md + 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm + 1,
  },
  texts: {
    flex: 1,
  },
  subtitle: {
    marginTop: theme.spacing.xs + 2,
  },
}));
