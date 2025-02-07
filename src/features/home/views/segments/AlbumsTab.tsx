import React from 'react';
import {FlatList, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {EmptyState} from '../../../../shared/ui/EmptyState';
import {SortHeader} from '../../../../shared/ui/SortHeader';
import {
  ALBUM_GRID_GAP,
  ALBUM_GRID_PADDING,
  ALBUM_SORT_FIELDS,
  ALBUM_SORT_LABELS,
} from '../../models/constants';
import {type AlbumCardItem, useAlbumsViewModel} from '../../viewmodels/useAlbumsViewModel';
import {AlbumCard} from '../components/AlbumCard';
import {AlbumCardSkeletonGrid} from '../loaders/AlbumCardSkeleton';

const keyExtractor = (album: AlbumCardItem): string => album.id;

const renderItem = ({item}: {item: AlbumCardItem}): React.JSX.Element => (
  <AlbumCard
    title={item.title}
    subtitle={item.subtitle}
    songCount={item.songCount}
    artworkUrl={item.artworkUrl}
  />
);

export const AlbumsTab = (): React.JSX.Element => {
  const {styles} = useStyles(stylesheet);

  const {
    albums,
    albumCount,
    isCountLoading,
    sort,
    setSortField,
    toggleSortDirection,
    isLoading,
    isError,
  } = useAlbumsViewModel();

  return (
    <View style={styles.container}>
      <SortHeader
        countLabel={`${albumCount} albums`}
        isCountLoading={isCountLoading}
        fields={ALBUM_SORT_FIELDS}
        labels={ALBUM_SORT_LABELS}
        activeField={sort.field}
        isAscending={sort.isAscending}
        onSortFieldChange={setSortField}
        onDirectionPress={toggleSortDirection}
      />

      {isLoading ? (
        <AlbumCardSkeletonGrid />
      ) : isError ? (
        <EmptyState icon="cloud-offline-outline" text="Couldn't load albums" />
      ) : (
        <FlatList
          data={albums}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={7}
          removeClippedSubviews
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
    paddingHorizontal: ALBUM_GRID_PADDING,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xxl,
    rowGap: theme.spacing.lg,
  },
  row: {
    columnGap: ALBUM_GRID_GAP,
  },
}));
