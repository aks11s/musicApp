import React from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import type {HomeSegment} from '../models/types';
import {useHomeViewModel} from '../viewmodels/useHomeViewModel';
import {HomeHeader} from './components/HomeHeader';
import {SegmentBar} from './components/SegmentBar';
import {AlbumsTab} from './segments/AlbumsTab';
import {ArtistsTab} from './segments/ArtistsTab';
import {SongsTab} from './segments/SongsTab';
import {SuggestedTab} from './segments/SuggestedTab';

const SEGMENT_VIEWS: Record<HomeSegment, React.JSX.Element> = {
  Suggested: <SuggestedTab />,
  Songs: <SongsTab />,
  Artists: <ArtistsTab />,
  Albums: <AlbumsTab />,
};

export const HomeScreen = (): React.JSX.Element => {
  const {styles} = useStyles(stylesheet);
  const {activeSegment, visitedSegments, setActiveSegment} = useHomeViewModel();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HomeHeader />

      <SegmentBar activeSegment={activeSegment} onSelect={setActiveSegment} />

      {/* visited segments stay mounted and hidden, so their pages, sort and scroll survive a switch */}
      {[...visitedSegments].map(segment => (
        <View key={segment} style={[styles.segment, segment !== activeSegment && styles.hidden]}>
          {SEGMENT_VIEWS[segment]}
        </View>
      ))}
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  segment: {
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
}));
