import React, {useCallback} from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import type {Track} from '../../../../domain/types';
import {formatDuration} from '../../../../shared/lib/formatDuration';
import {EmptyState} from '../../../../shared/ui/EmptyState';
import {TrackRow} from '../../../../shared/ui/TrackRow';
import {TRACK_ROW_HEIGHT} from '../../models/constants';
import {useSongsViewModel} from '../../viewmodels/useSongsViewModel';
import {SongsHeader} from '../components/SongsHeader';
import {TrackRowSkeletonList} from '../loaders/TrackRowSkeleton';

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
  const {styles, theme} = useStyles(stylesheet);
  
  const {
    songs,
    songCount,
    sort,
    toggleSortField,
    isLoading,
    isError,
    isLoadingMore,
    loadMore,
  } = useSongsViewModel();

  const header = useCallback(
    () => (
      <SongsHeader songCount={songCount} sort={sort} onSortFieldPress={toggleSortField} />
    ),
    [songCount, sort, toggleSortField],
  );

  const footer = useCallback(
    () =>
      isLoadingMore ? (
        <ActivityIndicator style={styles.footer} color={theme.colors.accent} />
      ) : null,
    [isLoadingMore, styles.footer, theme.colors.accent],
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <TrackRowSkeletonList />
      </View>
    );
  }

  if (isError) {
    return <EmptyState icon="cloud-offline-outline" text="Couldn't load songs" />;
  }

  return (
    <FlatList
      data={songs}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      onEndReached={loadMore}
      onEndReachedThreshold={0.4}
      initialNumToRender={12}
      maxToRenderPerBatch={10}
      windowSize={9}
      removeClippedSubviews
      ListHeaderComponent={header}
      ListFooterComponent={footer}
    />
  );
};

const stylesheet = createStyleSheet(theme => ({
  list: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  loadingContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xl,
  },
  footer: {
    paddingVertical: theme.spacing.lg,
  },
}));
