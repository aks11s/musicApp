import React, {useCallback} from 'react';
import {FlatList, View} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import type {Track} from '../../../../domain/types';
import {formatDuration} from '../../../../shared/lib/formatDuration';
import {EmptyState} from '../../../../shared/ui/EmptyState';
import {SortHeader} from '../../../../shared/ui/SortHeader';
import {TrackRow} from '../../../../shared/ui/TrackRow';
import {
  SONG_SORT_FIELDS,
  SONG_SORT_LABELS,
  SONGS_PULL_TRIGGER,
  TRACK_ROW_HEIGHT,
} from '../../models/constants';
import {useSongsViewModel} from '../../viewmodels/songs/useSongsViewModel';
import {SongsLoadMoreFooter} from '../components/SongsLoadMoreFooter';
import {TrackRowSkeletonList} from '../loaders/TrackRowSkeleton';

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList<Track>,
);

const keyExtractor = (track: Track): string => track.id;

const getItemLayout = (_: ArrayLike<Track> | null | undefined, index: number) => ({
  length: TRACK_ROW_HEIGHT,
  offset: TRACK_ROW_HEIGHT * index,
  index,
});

const renderItem = ({item}: {item: Track}): React.JSX.Element => (
  <TrackRow
    title={item.title}
    subtitle={`${item.artist} · ${formatDuration(item.durationSeconds)}`}
    artworkUrl={item.artworkUrl}
  />
);

export const SongsTab = (): React.JSX.Element => {
  const {styles} = useStyles(stylesheet);

  const {
    songs,
    songCount,
    isCountLoading,
    sort,
    setSortField,
    toggleSortDirection,
    isLoading,
    isError,
    isLoadingMore,
    loadMore,
    allowLoadMore,
    hasMore,
  } = useSongsViewModel();

  const overscroll = useSharedValue(0);
  const hasFired = useSharedValue(false);

  const handleScroll = useAnimatedScrollHandler(event => {
    const pulled =
      event.contentOffset.y + event.layoutMeasurement.height - event.contentSize.height;
    overscroll.value = Math.max(pulled, 0);

    if (pulled >= SONGS_PULL_TRIGGER && !hasFired.value) {
      hasFired.value = true;
      runOnJS(loadMore)();
    } else if (pulled <= 0) {
      hasFired.value = false;
    }
  });

  const footer = useCallback(
    () => (hasMore ? <SongsLoadMoreFooter overscroll={overscroll} /> : null),
    [hasMore, overscroll],
  );

  return (
    <View style={styles.container}>
      {/* outside the list so the count and sort control stay put while scrolling */}
      <SortHeader
        countLabel={`${songCount} songs`}
        isCountLoading={isCountLoading}
        fields={SONG_SORT_FIELDS}
        labels={SONG_SORT_LABELS}
        activeField={sort.field}
        isAscending={sort.isAscending}
        onSortFieldChange={setSortField}
        onDirectionPress={toggleSortDirection}
      />

      {isLoading || isLoadingMore ? (
        <View style={styles.loadingContainer}>
          <TrackRowSkeletonList />
        </View>
      ) : isError ? (
        <EmptyState icon="cloud-offline-outline" text="Couldn't load songs" />
      ) : (
        <AnimatedFlatList
          data={songs}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onScrollBeginDrag={allowLoadMore}
          initialNumToRender={12}
          maxToRenderPerBatch={6}
          updateCellsBatchingPeriod={60}
          windowSize={7}
          removeClippedSubviews
          ListFooterComponent={footer}
        />
      )}
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  loadingContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xl,
  },
}));
