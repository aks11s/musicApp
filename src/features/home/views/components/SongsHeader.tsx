import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {SONG_SORT_FIELDS, SONG_SORT_LABELS} from '../../models/constants';
import type {SongSort, SongSortField} from '../../models/types';

type SongsHeaderProps = {
  songCount: number;
  sort: SongSort;
  onSortFieldPress: (field: SongSortField) => void;
};

export const SongsHeader = React.memo(
  ({songCount, sort, onSortFieldPress}: SongsHeaderProps): React.JSX.Element => {
    const {styles} = useStyles(stylesheet);

    return (
      <View style={styles.header}>
        <Text style={styles.count}>{songCount} songs</Text>

        <View style={styles.sortGroup}>
          {SONG_SORT_FIELDS.map(field => {
            const isActive = sort.field === field;
            return (
              <SortButton
                key={field}
                field={field}
                isActive={isActive}
                isAscending={sort.isAscending}
                onPress={onSortFieldPress}
              />
            );
          })}
        </View>
      </View>
    );
  },
);

SongsHeader.displayName = 'SongsHeader';

type SortButtonProps = {
  field: SongSortField;
  isActive: boolean;
  isAscending: boolean;
  onPress: (field: SongSortField) => void;
};

// own component so the arrow function bound to `field` does not live in a list map
const SortButton = React.memo(
  ({field, isActive, isAscending, onPress}: SortButtonProps): React.JSX.Element => {
    const {styles} = useStyles(stylesheet);
    const handlePress = React.useCallback(() => onPress(field), [onPress, field]);

    return (
      <TouchableOpacity onPress={handlePress}>
        <Text style={[styles.sortLabel, isActive && styles.sortLabelActive]}>
          {SONG_SORT_LABELS[field]}
          {isActive ? (isAscending ? ' ↑' : ' ↓') : ''}
        </Text>
      </TouchableOpacity>
    );
  },
);

SortButton.displayName = 'SortButton';

const stylesheet = createStyleSheet(theme => ({
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
}));
