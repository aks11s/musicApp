import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {useHomeViewModel} from '../viewmodels/useHomeViewModel';
import {HomeHeader} from './components/HomeHeader';
import {SegmentBar} from './components/SegmentBar';
import {SuggestedTab} from './segments/SuggestedTab';

export const HomeScreen = (): React.JSX.Element => {
  const {styles} = useStyles(stylesheet);
  const {activeSegment, setActiveSegment} = useHomeViewModel();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HomeHeader />

      <SegmentBar activeSegment={activeSegment} onSelect={setActiveSegment} />

      {activeSegment === 'Suggested' ? <SuggestedTab /> : null}
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));
