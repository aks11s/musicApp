import React from 'react';
import {Image, Text, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  ARTIST_ROW_AVATAR_SIZE,
  ARTIST_ROW_HEIGHT,
} from '../../models/constants';

const MENU_ICON_SIZE = 20;

type ArtistRowProps = {
  name: string;
  stats: string;
  avatarUrl: string;
};

export const ArtistRow = React.memo(
  ({name, stats, avatarUrl}: ArtistRowProps): React.JSX.Element => {
    const {styles, theme} = useStyles(stylesheet);
    const source = React.useMemo(() => ({uri: avatarUrl}), [avatarUrl]);

    return (
      <View style={styles.row}>
        <Image source={source} style={styles.avatar} />

        <View style={styles.texts}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.stats} numberOfLines={1}>
            {stats}
          </Text>
        </View>

        {/* NOTE: plain View until there is an artist menu to open */}
        <View style={styles.menu}>
          <Ionicons
            name="ellipsis-vertical"
            size={MENU_ICON_SIZE}
            color={theme.colors.textMuted}
          />
        </View>
      </View>
    );
  },
);

ArtistRow.displayName = 'ArtistRow';

const stylesheet = createStyleSheet(theme => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ARTIST_ROW_HEIGHT,
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
  },
  avatar: {
    width: ARTIST_ROW_AVATAR_SIZE,
    height: ARTIST_ROW_AVATAR_SIZE,
    borderRadius: ARTIST_ROW_AVATAR_SIZE / 2,
    backgroundColor: theme.colors.surface,
  },
  texts: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  name: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.title,
    color: theme.colors.text,
  },
  stats: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textMuted,
  },
  menu: {
    width: 24,
    alignItems: 'center',
  },
}));
