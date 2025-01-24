import React, {useCallback, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Skeleton} from './Skeleton';
import {SortSheet} from './SortSheet';

const DIRECTION_ICON_SIZE = 20;
const COUNT_SKELETON_WIDTH = 80;
const COUNT_SKELETON_HEIGHT = 15;

type SortHeaderProps<F extends string> = {
  countLabel: string;
  isCountLoading: boolean;
  fields: readonly F[];
  labels: Record<F, string>;
  activeField: F;
  isAscending: boolean;
  onSortFieldChange: (field: F) => void;
  onDirectionPress: () => void;
};

const SortHeaderBase = <F extends string>({
  countLabel,
  isCountLoading,
  fields,
  labels,
  activeField,
  isAscending,
  onSortFieldChange,
  onDirectionPress,
}: SortHeaderProps<F>): React.JSX.Element => {
  const {styles, theme} = useStyles(stylesheet);
  const [isSheetOpen, setSheetOpen] = useState(false);

  const openSheet = useCallback(() => setSheetOpen(true), []);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const selectField = useCallback(
    (field: F) => {
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
        <Text style={styles.count}>{countLabel}</Text>
      )}

      <View style={styles.sortControl}>
        <TouchableOpacity onPress={openSheet}>
          <Text style={styles.sortLabel}>{labels[activeField]}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDirectionPress}
          style={styles.directionButton}>
          {/* the icon reads the same either way, so flipping it shows the direction */}
          <Ionicons
            name="swap-vertical"
            size={DIRECTION_ICON_SIZE}
            color={theme.colors.accent}
            style={isAscending ? undefined : styles.flipped}
          />
        </TouchableOpacity>
      </View>

      {isSheetOpen ? (
        <SortSheet
          fields={fields}
          labels={labels}
          activeField={activeField}
          onSelect={selectField}
          onClose={closeSheet}
        />
      ) : null}
    </View>
  );
};

// memo drops the generic, so the cast puts it back
export const SortHeader = React.memo(SortHeaderBase) as typeof SortHeaderBase;

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
