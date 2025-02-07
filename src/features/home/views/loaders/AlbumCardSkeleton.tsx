import React from 'react';
import {useWindowDimensions, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {Skeleton} from '../../../../shared/ui/Skeleton';
import {
  ALBUM_GRID_GAP,
  ALBUM_GRID_PADDING,
  ALBUMS_SKELETON_COUNT,
} from '../../models/constants';

const AlbumCardSkeleton = ({size}: {size: number}): React.JSX.Element => {
  const {styles, theme} = useStyles(stylesheet);

  return (
    <View style={styles.card(size)}>
      <Skeleton width={size} height={size} radius={theme.radii.lg} />
      <Skeleton width={size * 0.7} height={14} style={styles.title} />
      <Skeleton width={size * 0.55} height={11} style={styles.line} />
      <Skeleton width={size * 0.35} height={11} style={styles.line} />
    </View>
  );
};

export const AlbumCardSkeletonGrid = (): React.JSX.Element => {
  const {styles} = useStyles(stylesheet);
  const {width} = useWindowDimensions();
  const size = (width - ALBUM_GRID_PADDING * 2 - ALBUM_GRID_GAP) / 2;

  return (
    <View style={styles.grid}>
      {Array.from({length: ALBUMS_SKELETON_COUNT}, (_, i) => (
        <AlbumCardSkeleton key={i} size={size} />
      ))}
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: ALBUM_GRID_GAP,
    rowGap: theme.spacing.lg,
    paddingHorizontal: ALBUM_GRID_PADDING,
    paddingTop: theme.spacing.xs,
  },
  card: (size: number) => ({
    width: size,
  }),
  title: {
    marginTop: theme.spacing.md + 2,
  },
  line: {
    marginTop: theme.spacing.sm,
  },
}));
