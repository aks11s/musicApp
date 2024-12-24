import React, {useCallback} from 'react';
import {ActivityIndicator, FlatList, Text, TouchableOpacity, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {EmptyState} from '../../../../shared/ui/EmptyState';
import {TrackRow} from '../../../../shared/ui/TrackRow';
import {formatDuration} from '../../../../shared/lib/formatDuration';
import {SONG_SORT_FIELDS} from '../../models/constants';
import type {Track} from '../../models/types';
import {useSongsViewModel} from '../../viewmodels/useSongsViewModel';
import {TrackRowSkeletonList} from '../loaders/TrackRowSkeleton';

const SORT_LABELS = {title: 'Title', duration: 'Duration'} as const;

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

  // stable identity, otherwise TrackRow's memo never holds
  const renderItem = useCallback(
    ({item}: {item: Track}) => (
      <TrackRow
        title={item.title}
        subtitle={`${item.artist} · ${formatDuration(item.durationSeconds)}`}
        artworkUrl={item.artworkUrl}
      />
    ),
    [],
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
      keyExtractor={track => track.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      onEndReached={loadMore}
      onEndReachedThreshold={0.4}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.count}>{songCount} songs</Text>

          <View style={styles.sortGroup}>
            {SONG_SORT_FIELDS.map(field => {
              const isActive = sort.field === field;
              return (
                <TouchableOpacity key={field} onPress={() => toggleSortField(field)}>
                  <Text style={[styles.sortLabel, isActive && styles.sortLabelActive]}>
                    {SORT_LABELS[field]}
                    {isActive ? (sort.isAscending ? ' ↑' : ' ↓') : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      }
      ListFooterComponent={
        isLoadingMore ? (
          <ActivityIndicator style={styles.footer} color={theme.colors.accent} />
        ) : null
      }
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  count: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.label,
    color: theme.colors.text,
  },
  sortGroup: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  sortLabel: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textMuted,
  },
  sortLabelActive: {
    color: theme.colors.accent,
  },
  footer: {
    paddingVertical: theme.spacing.lg,
  },
}));
