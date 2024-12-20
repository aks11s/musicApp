import React from 'react';
import {ScrollView} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {EmptyState} from '../../../../shared/ui/EmptyState';
import {HorizontalSection} from '../../../../shared/ui/HorizontalSection';
import {RECENTLY_PLAYED_CARD_SIZE, TRACK_CARD_SIZE} from '../../models/constants';
import {useSuggestedViewModel} from '../../viewmodels/useSuggestedViewModel';
import {ArtistAvatar} from '../components/ArtistAvatar';
import {ArtistAvatarSkeletonRow} from '../loaders/ArtistAvatarSkeleton';
import {TrackCard} from '../components/TrackCard';
import {TrackCardSkeletonRow} from '../loaders/TrackCardSkeleton';

export const SuggestedTab = (): React.JSX.Element => {
  const {styles, theme} = useStyles(stylesheet);
  const {
    recentlyPlayed,
    artists,
    isArtistsLoading,
    isArtistsError,
    mostPlayed,
    isMostPlayedLoading,
    isMostPlayedError,
  } = useSuggestedViewModel();

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <HorizontalSection
        title="Recently Played"
        gap={theme.spacing.md + 2}
        isEmpty={recentlyPlayed.length === 0}
        empty={
          <EmptyState
            icon="musical-note-outline"
            text="Nothing played yet"
            minHeight={RECENTLY_PLAYED_CARD_SIZE}
          />
        }
        isFirst>
        {recentlyPlayed.map(track => (
          <TrackCard key={track.id} track={track} size={RECENTLY_PLAYED_CARD_SIZE} />
        ))}
      </HorizontalSection>

      <HorizontalSection
        title="Artists"
        gap={theme.spacing.lg + 2}
        isLoading={isArtistsLoading}
        skeleton={<ArtistAvatarSkeletonRow />}
        isError={isArtistsError}
        errorText="Couldn't load artists">
        {artists.map(artist => (
          <ArtistAvatar key={artist.id} artist={artist} />
        ))}
      </HorizontalSection>

      <HorizontalSection
        title="Most Played"
        gap={theme.spacing.md + 2}
        isLoading={isMostPlayedLoading}
        skeleton={<TrackCardSkeletonRow />}
        isError={isMostPlayedError}
        errorText="Couldn't load tracks">
        {mostPlayed.map(track => (
          <TrackCard key={track.id} track={track} size={TRACK_CARD_SIZE} />
        ))}
      </HorizontalSection>
    </ScrollView>
  );
};

const stylesheet = createStyleSheet(theme => ({
  content: {
    paddingTop: theme.spacing.xl - 2,
    paddingBottom: theme.spacing.xxl,
  },
}));
