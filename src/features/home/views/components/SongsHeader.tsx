import React, {useCallback, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Skeleton} from '../../../../shared/ui/Skeleton';
import {SONG_SORT_LABELS} from '../../models/constants';
import type {SongSort, SongSortField} from '../../models/types';
import {SongsSortSheet} from './SongsSortSheet';

const DIRECTION_ICON_SIZE = 20;
const COUNT_SKELETON_WIDTH = 80;
const COUNT_SKELETON_HEIGHT = 15;

type SongsHeaderProps = {
  songCount: number;
  isCountLoading: boolean;
  sort: SongSort;
  onSortFieldChange: (field: SongSortField) => void;
  onDirectionPress: () => void;
};

export const SongsHeader = React.memo(
  ({
    songCount,
    isCountLoading,
    sort,
    onSortFieldChange,
    onDirectionPress,
  }: SongsHeaderProps): React.JSX.Element => {
    const {styles, theme} = useStyles(stylesheet);
    const [isSheetOpen, setSheetOpen] = useState(false);

    const openSheet = useCallback(() => setSheetOpen(true), []);
    const closeSheet = useCallback(() => setSheetOpen(false), []);

    const selectField = useCallback(
      (field: SongSortField) => {
        onSortFieldChange(field);
        setSheetOpen(false);
      },
      [onSortFieldChange],
    );

    return (
      <View style={styles.header}>
        {isCountLoading ? (
          <Skeleton width={COUNT_SKELETON_WIDTH} height={COUNT_SKELETON_HEIGHT} />
        ) : (
          <Text style={styles.count}>{songCount} songs</Text>
        )}

        <View style={styles.sortControl}>
          <TouchableOpacity onPress={openSheet}>
            <Text style={styles.sortLabel}>{SONG_SORT_LABELS[sort.field]}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onDirectionPress} style={styles.directionButton}>
            {/* the icon reads the same either way, so flipping it shows the direction */}
            <Ionicons
              name="swap-vertical"
              size={DIRECTION_ICON_SIZE}
              color={theme.colors.accent}
              style={sort.isAscending ? undefined : styles.flipped}
            />
          </TouchableOpacity>
        </View>

        {isSheetOpen ? (
          <SongsSortSheet
            activeField={sort.field}
            onSelect={selectField}
            onClose={closeSheet}
          />
        ) : null}
      </View>
    );
  },
);

SongsHeader.displayName = 'SongsHeader';

const stylesheet = createStyleSheet(theme => ({
  header: {
    // keeps the sort card above the list below it
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  count: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.subtitle,
    color: theme.colors.text,
  },
  sortControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  sortLabel: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.subtitle,
    color: theme.colors.accent,
  },
  directionButton: {
    paddingVertical: theme.spacing.xs,
  },
  flipped: {
    transform: [{rotate: '180deg'}],
  },
}));
