import React from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {MiniPlayerBar} from '../features/player/views/MiniPlayerBar';
import {TabNavigator} from './TabNavigator';
import type {RootStackParamList} from './types';
import {useTabBarHeight} from './useTabBarHeight';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
  const {styles} = useStyles(stylesheet);
  const tabBarHeight = useTabBarHeight();

  return (
    <View style={styles.root}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Root" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
      <View
        style={[styles.miniPlayerSlot, {bottom: tabBarHeight + 15}]}
        pointerEvents="box-none">
        <MiniPlayerBar />
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet(_theme => ({
  root: {
    flex: 1,
  },
  miniPlayerSlot: {
    position: 'absolute',
    left: 8,
    right: 8,
  },
}));
