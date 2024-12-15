import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {HOME_SEGMENTS} from '../../models/constants';
import type {HomeSegment} from '../../models/types';

type SegmentBarProps = {
  activeSegment: HomeSegment;
  onSelect: (segment: HomeSegment) => void;
};

export const SegmentBar = ({activeSegment, onSelect}: SegmentBarProps): React.JSX.Element => {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.segmentBar}>
      {HOME_SEGMENTS.map(segment => {
        const isActive = segment === activeSegment;
        return (
          <TouchableOpacity
            key={segment}
            style={styles.segmentItem}
            onPress={() => onSelect(segment)}>
            <Text style={[styles.segmentLabel, isActive && styles.segmentLabelActive]}>
              {segment}
            </Text>
            {isActive ? <View style={styles.segmentIndicator} /> : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
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
}));
