import React from 'react';
import {ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useHomeViewModel, type HomeTrackCard} from '../viewmodels/useHomeViewModel';
import {HOME_SEGMENTS} from '../models/constants';
import type {Artist, Track} from '../models/types';

type TrackCardProps = {track: HomeTrackCard};

function TrackCard({track}: TrackCardProps): React.JSX.Element {
  const {styles} = useStyles(stylesheet);
  return (
    <View style={styles.trackCard}>
      <LinearGradient
        colors={track.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.trackArtwork}
      />
      <Text style={styles.trackTitle} numberOfLines={1}>
        {track.title}
      </Text>
      <Text style={styles.trackArtist} numberOfLines={1}>
        {track.artist}
      </Text>
    </View>
  );
}

type MostPlayedCardProps = {track: Track};

const MostPlayedCard = ({track}: MostPlayedCardProps): React.JSX.Element => {
  const {styles} = useStyles(stylesheet);
  return (
    <View style={styles.mostPlayedCard}>
      <Image source={{uri: track.artworkUrl}} style={styles.mostPlayedArtwork} />
      <Text style={styles.trackTitle} numberOfLines={1}>
        {track.title}
      </Text>
      <Text style={styles.trackArtist} numberOfLines={1}>
        {track.artist}
      </Text>
    </View>
  );
};

type ArtistAvatarProps = {artist: Artist};

function ArtistAvatar({artist}: ArtistAvatarProps): React.JSX.Element {
  const {styles} = useStyles(stylesheet);
  return (
    <View style={styles.artistCard}>
      <Image source={{uri: artist.avatarUrl}} style={styles.artistAvatar} />
      <Text style={styles.artistName} numberOfLines={1}>
        {artist.name}
      </Text>
    </View>
  );
}

export const HomeScreen = (): React.JSX.Element => {
  const {styles, theme} = useStyles(stylesheet);
  const {
    activeSegment,
    setActiveSegment,
    recentlyPlayed,
    artists,
    isArtistsLoading,
    isArtistsError,
    mostPlayed,
    isMostPlayedLoading,
    isMostPlayedError,
  } = useHomeViewModel();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.brand}>
          <View style={styles.logoBadge}>
            <Ionicons name="musical-notes" color={theme.colors.background} size={16} />
          </View>
          <Text style={styles.brandText}>Mivo</Text>
        </View>
        <TouchableOpacity style={styles.searchButton} accessibilityLabel="Search">
          <Ionicons name="search" color={theme.colors.text} size={19} />
        </TouchableOpacity>
      </View>

      <View style={styles.segmentBar}>
        {HOME_SEGMENTS.map(segment => {
          const isActive = segment === activeSegment;
          return (
            <TouchableOpacity
              key={segment}
              style={styles.segmentItem}
              onPress={() => setActiveSegment(segment)}>
              <Text style={[styles.segmentLabel, isActive && styles.segmentLabelActive]}>
                {segment}
              </Text>
              {isActive ? <View style={styles.segmentIndicator} /> : null}
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Played</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trackList}>
          {recentlyPlayed.map(track => (
            <TrackCard key={track.id} track={track} />
          ))}
        </ScrollView>

        <View style={[styles.sectionHeader, styles.sectionHeaderSpaced]}>
          <Text style={styles.sectionTitle}>Artists</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>
        {isArtistsLoading ? (
          <ActivityIndicator style={styles.mostPlayedStatus} color={theme.colors.accent} />
        ) : isArtistsError ? (
          <Text style={[styles.trackArtist, styles.mostPlayedStatus]}>
            Couldn't load artists
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.artistList}>
            {artists.map(artist => (
              <ArtistAvatar key={artist.id} artist={artist} />
            ))}
          </ScrollView>
        )}

        <View style={[styles.sectionHeader, styles.sectionHeaderSpaced]}>
          <Text style={styles.sectionTitle}>Most Played</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>
        {isMostPlayedLoading ? (
          <ActivityIndicator style={styles.mostPlayedStatus} color={theme.colors.accent} />
        ) : isMostPlayedError ? (
          <Text style={[styles.trackArtist, styles.mostPlayedStatus]}>
            Couldn't load tracks
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mostPlayedList}>
            {mostPlayed.map(track => (
              <MostPlayedCard key={track.id} track={track} />
            ))}
          </ScrollView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  logoBadge: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontFamily: theme.typography.families.bold,
    fontSize: theme.typography.sizes.heading,
    color: theme.colors.text,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBar: {
    flexDirection: 'row',
    gap: theme.spacing.xl - 2,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  segmentItem: {
    paddingTop: theme.spacing.xs + 2,
    paddingBottom: theme.spacing.md,
  },
  segmentLabel: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.subtitle,
    color: theme.colors.textMuted,
  },
  segmentLabelActive: {
    color: theme.colors.text,
  },
  segmentIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: theme.colors.accent,
  },
  content: {
    paddingTop: theme.spacing.xl - 2,
    paddingBottom: theme.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.md + 2,
  },
  sectionHeaderSpaced: {
    paddingTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.title,
    color: theme.colors.text,
  },
  seeAll: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.small,
    color: theme.colors.accent,
  },
  mostPlayedList: {
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.md + 2,
  },
  mostPlayedCard: {
    width: 128,
  },
  mostPlayedArtwork: {
    width: 128,
    height: 128,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.surface,
  },
  mostPlayedStatus: {
    marginHorizontal: theme.spacing.xl,
  },
  trackList: {
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.md + 2,
  },
  trackCard: {
    width: 112,
  },
  trackArtwork: {
    width: 112,
    height: 112,
    borderRadius: theme.radii.lg - 2,
  },
  trackTitle: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text,
    paddingTop: theme.spacing.sm + 1,
  },
  trackArtist: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.textMuted,
  },
  artistList: {
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.lg + 2,
  },
  artistCard: {
    width: 96,
    alignItems: 'center',
    gap: theme.spacing.sm + 1,
  },
  artistAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  artistName: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text,
    textAlign: 'center',
  },
}));
