import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {Skeleton} from '../../../../shared/ui/Skeleton';
import {
  ARTIST_ROW_AVATAR_SIZE,
  ARTIST_ROW_HEIGHT,
  ARTISTS_SKELETON_COUNT,
} from '../../models/constants';

const ArtistRowSkeleton = (): React.JSX.Element => {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.row}>
      <Skeleton
        width={ARTIST_ROW_AVATAR_SIZE}
        height={ARTIST_ROW_AVATAR_SIZE}
        radius={ARTIST_ROW_AVATAR_SIZE / 2}
      />
      <View style={styles.texts}>
        <Skeleton width={132} height={12} />
        <Skeleton width={104} height={10} />
      </View>
    </View>
  );
};

export const ArtistRowSkeletonList = (): React.JSX.Element => (
  <>
    {Array.from({length: ARTISTS_SKELETON_COUNT}, (_, i) => (
      <ArtistRowSkeleton key={i} />
    ))}
  </>
);

const stylesheet = createStyleSheet(theme => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ARTIST_ROW_HEIGHT,
    gap: theme.spacing.md + 2,
    paddingHorizontal: theme.spacing.sm,
  },
  texts: {
    flex: 1,
    gap: theme.spacing.sm,
  },
}));
