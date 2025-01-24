import React from 'react';
import {Dimensions, Pressable, Text, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

const RADIO_SIZE = 20;
const CARD_WIDTH = 160;
const SCREEN = Dimensions.get('window');

type SortSheetProps<F extends string> = {
  fields: readonly F[];
  labels: Record<F, string>;
  activeField: F;
  onSelect: (field: F) => void;
  onClose: () => void;
};

export const SortSheet = <F extends string>({
  fields,
  labels,
  activeField,
  onSelect,
  onClose,
}: SortSheetProps<F>): React.JSX.Element => {
  const {styles, theme} = useStyles(stylesheet);

  return (
    <>
      {/* full-screen catcher so a tap anywhere outside closes the card */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.card}>
        {fields.map((field, index) => {
          const isActive = field === activeField;
          return (
            <Pressable
              key={field}
              style={[styles.option, index > 0 && styles.optionDivided]}
              onPress={() => onSelect(field)}>
              <Text style={styles.label}>{labels[field]}</Text>
              <Ionicons
                name={isActive ? 'radio-button-on' : 'radio-button-off'}
                size={RADIO_SIZE}
                color={theme.colors.accent}
              />
            </Pressable>
          );
        })}
      </View>
    </>
  );
};

const stylesheet = createStyleSheet(theme => ({
  // sized to the screen rather than the parent, which is only as tall as the header
  backdrop: {
    position: 'absolute',
    top: -SCREEN.height,
    left: -SCREEN.width,
    width: SCREEN.width * 2,
    height: SCREEN.height * 2,
  },
  card: {
    position: 'absolute',
    top: 50,
    right: 30,
    width: CARD_WIDTH,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.lg,
    paddingHorizontal: theme.spacing.lg,
    shadowColor: theme.colors.text,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md + 2,
  },
  optionDivided: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  label: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.subtitle,
    color: theme.colors.text,
  },
}));
