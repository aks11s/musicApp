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
    hasRecentlyPlayed,
    artists,
    isArtistsLoading,
    isArtistsError,
    mostPlayed,
    isMostPlayedLoading,
    isMostPlayedError,
    underground,
    isUndergroundLoading,
    isUndergroundError,
  } = useSuggestedViewModel();

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {hasRecentlyPlayed ? (
        <HorizontalSection title="Recently Played" gap={theme.spacing.md + 2} isFirst>
          {recentlyPlayed.map(track => (
            <TrackCard key={track.id} track={track} size={RECENTLY_PLAYED_CARD_SIZE} />
          ))}
        </HorizontalSection>
      ) : null}

      <HorizontalSection
        title="Most Played"
        gap={theme.spacing.md + 2}
        isLoading={isMostPlayedLoading}
        skeleton={<TrackCardSkeletonRow />}
        isError={isMostPlayedError}
        errorText="Couldn't load tracks"
        isEmpty={mostPlayed.length === 0}
        empty={<EmptyState icon="musical-note-outline" text="No tracks right now" />}
        isFirst={!hasRecentlyPlayed}>
        {mostPlayed.map(track => (
          <TrackCard key={track.id} track={track} size={TRACK_CARD_SIZE} />
        ))}
      </HorizontalSection>

      <HorizontalSection
        title="Artists"
        gap={theme.spacing.lg + 2}
        isLoading={isArtistsLoading}
        skeleton={<ArtistAvatarSkeletonRow />}
        isError={isArtistsError}
        errorText="Couldn't load artists"
        isEmpty={artists.length === 0}
        empty={<EmptyState icon="person-outline" text="No artists right now" />}>
        {artists.map(artist => (
          <ArtistAvatar key={artist.id} artist={artist} />
        ))}
      </HorizontalSection>

      <HorizontalSection
        title="Fresh Finds"
        gap={theme.spacing.md + 2}
        isLoading={isUndergroundLoading}
        skeleton={<TrackCardSkeletonRow />}
        isError={isUndergroundError}
        errorText="Couldn't load tracks"
        isEmpty={underground.length === 0}
        empty={<EmptyState icon="musical-note-outline" text="No tracks right now" />}
        hideSeeAll>
        {underground.map(track => (
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
