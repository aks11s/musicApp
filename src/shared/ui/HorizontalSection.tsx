import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

type HorizontalSectionProps = {
  title: string;
  gap: number;
  children: React.ReactNode;
  isLoading?: boolean;
  // shown in place of the list while loading — the section itself knows nothing
  // about the shape of the cards it holds
  skeleton?: React.ReactNode;
  isError?: boolean;
  errorText?: string;
  // rendered instead of the list when there is nothing to show
  isEmpty?: boolean;
  empty?: React.ReactNode;
  onSeeAll?: () => void;
  // first section on a screen sits tighter under the segment bar
  isFirst?: boolean;
};

export const HorizontalSection = ({
  title,
  gap,
  children,
  isLoading,
  skeleton,
  isError,
  errorText,
  isEmpty,
  empty,
  onSeeAll,
  isFirst,
}: HorizontalSectionProps): React.JSX.Element => {
  const {styles} = useStyles(stylesheet);

  return (
    <View>
      <View style={[styles.header, !isFirst && styles.headerSpaced]}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onSeeAll} disabled={!onSeeAll}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      {isError ? (
        <Text style={[styles.errorText, styles.status]}>{errorText}</Text>
      ) : isEmpty && !isLoading ? (
        empty
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={!isLoading}
          contentContainerStyle={[styles.list, {gap}]}>
          {isLoading ? skeleton : children}
        </ScrollView>
      )}
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.md + 2,
  },
  headerSpaced: {
    paddingTop: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.title,
    color: theme.colors.text,
  },
  seeAll: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.small,
    color: theme.colors.accent,
  },
  list: {
    paddingHorizontal: theme.spacing.xl,
  },
  status: {
    marginHorizontal: theme.spacing.xl,
  },
  errorText: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.textMuted,
  },
}));
