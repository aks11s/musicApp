import React from 'react';
import {FlatList, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {EmptyState} from '../../../../shared/ui/EmptyState';
import {SortHeader} from '../../../../shared/ui/SortHeader';
import {
  ARTIST_ROW_HEIGHT,
  ARTIST_SORT_FIELDS,
  ARTIST_SORT_LABELS,
} from '../../models/constants';
import {
  type ArtistRowItem,
  useArtistsViewModel,
} from '../../viewmodels/useArtistsViewModel';
import {ArtistRow} from '../components/ArtistRow';
import {ArtistRowSkeletonList} from '../loaders/ArtistRowSkeleton';

const keyExtractor = (artist: ArtistRowItem): string => artist.id;

const getItemLayout = (
  _: ArrayLike<ArtistRowItem> | null | undefined,
  index: number,
) => ({
  length: ARTIST_ROW_HEIGHT,
  offset: ARTIST_ROW_HEIGHT * index,
  index,
});

const renderItem = ({item}: {item: ArtistRowItem}): React.JSX.Element => (
  <ArtistRow name={item.name} stats={item.stats} avatarUrl={item.avatarUrl} />
);

export const ArtistsTab = (): React.JSX.Element => {
  const {styles} = useStyles(stylesheet);

  const {
    artists,
    artistCount,
    isCountLoading,
    sort,
    setSortField,
    toggleSortDirection,
    isLoading,
    isError,
  } = useArtistsViewModel();

  return (
    <View style={styles.container}>
      <SortHeader
        countLabel={`${artistCount} artists`}
        isCountLoading={isCountLoading}
        fields={ARTIST_SORT_FIELDS}
        labels={ARTIST_SORT_LABELS}
        activeField={sort.field}
        isAscending={sort.isAscending}
        onSortFieldChange={setSortField}
        onDirectionPress={toggleSortDirection}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ArtistRowSkeletonList />
        </View>
      ) : isError ? (
        <EmptyState icon="cloud-offline-outline" text="Couldn't load artists" />
      ) : (
        <FlatList
          data={artists}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          initialNumToRender={12}
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
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xxl,
  },
  loadingContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xs,
  },
}));
