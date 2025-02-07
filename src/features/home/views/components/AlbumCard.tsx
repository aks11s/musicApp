import React from 'react';
import {Image, Text, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {toImageSource} from '../../../../shared/lib/imageSource';

const MENU_ICON_SIZE = 20;

type AlbumCardProps = {
  title: string;
  subtitle: string;
  songCount: string;
  artworkUrl: string;
};

export const AlbumCard = React.memo(({title, subtitle, songCount, artworkUrl}: AlbumCardProps): React.JSX.Element => {
    const {styles, theme} = useStyles(stylesheet);
    const source = React.useMemo(() => toImageSource(artworkUrl), [artworkUrl]);

    return (
      <View style={styles.card}>
        <Image source={source} style={styles.artwork} />

        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {/* NOTE: plain View until there is an album menu to open */}
          <View style={styles.menu}>
            <Ionicons
              name="ellipsis-vertical"
              size={MENU_ICON_SIZE}
              color={theme.colors.text}
            />
          </View>
        </View>

        <Text style={styles.meta} numberOfLines={1}>
          {subtitle}
        </Text>
        <Text style={styles.meta}>{songCount}</Text>
      </View>
    );
  },
);

AlbumCard.displayName = 'AlbumCard';

const stylesheet = createStyleSheet(theme => ({
  card: {
    flex: 1,
  },
  artwork: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.surface,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md + 2,
    marginBottom: theme.spacing.xs + 2,
  },
  title: {
    flex: 1,
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.title,
    color: theme.colors.text,
  },
  menu: {
    width: 20,
    alignItems: 'flex-end',
  },
  meta: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
}));
