import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const HomeHeader = (): React.JSX.Element => {
  const {styles, theme} = useStyles(stylesheet);

  return (
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
  );
};

const stylesheet = createStyleSheet(theme => ({
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
}));
