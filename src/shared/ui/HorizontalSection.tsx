import React from 'react';
import {ActivityIndicator, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

type HorizontalSectionProps = {
  title: string;
  gap: number;
  children: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  errorText?: string;
  onSeeAll?: () => void;
  // first section on a screen sits tighter under the segment bar
  isFirst?: boolean;
};

export const HorizontalSection = ({
  title,
  gap,
  children,
  isLoading,
  isError,
  errorText,
  onSeeAll,
  isFirst,
}: HorizontalSectionProps): React.JSX.Element => {
  const {styles, theme} = useStyles(stylesheet);

  return (
    <View>
      <View style={[styles.header, !isFirst && styles.headerSpaced]}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onSeeAll} disabled={!onSeeAll}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <ActivityIndicator style={styles.status} color={theme.colors.accent} />
      ) : isError ? (
        <Text style={[styles.errorText, styles.status]}>{errorText}</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.list, {gap}]}>
          {children}
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
