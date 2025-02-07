import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useMiniPlayerViewModel} from '../viewmodels/useMiniPlayerViewModel';

export function MiniPlayerBar(): React.JSX.Element | null {
  const {styles, theme} = useStyles(stylesheet);
  const {track, isPlaying, progress, stop} = useMiniPlayerViewModel();

  if (!track) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={track.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.artwork}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {track.artist}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.playButton}
        accessibilityLabel={isPlaying ? 'Pause' : 'Play'}>
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          color={theme.colors.background}
          size={15}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeButton} accessibilityLabel="Stop" onPress={stop}>
        <Ionicons name="close" color={theme.colors.textMuted} size={18} />
      </TouchableOpacity>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: `${progress * 100}%`}]} />
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 18,
    paddingHorizontal: theme.spacing.md - 1,
    paddingVertical: theme.spacing.sm + 1,
    shadowColor: theme.colors.text,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  artwork: {
    width: 46,
    height: 46,
    borderRadius: 11,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text,
  },
  artist: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.textMuted,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 3,
    height: 2,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.accent,
    borderRadius: 2,
  },
}));
