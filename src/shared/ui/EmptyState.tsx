import React from 'react';
import {Text, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ICON_SIZE = 22;

type EmptyStateProps = {
  text: string;
  icon?: string;
  minHeight?: number;
};

export const EmptyState = ({text, icon, minHeight}: EmptyStateProps): React.JSX.Element => {
  const {styles, theme} = useStyles(stylesheet);

  return (
    <View style={[styles.container, minHeight ? {minHeight} : null]}>
      {icon ? (
        <Ionicons name={icon} size={ICON_SIZE} color={theme.colors.textMuted} />
      ) : null}
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  text: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
}));
