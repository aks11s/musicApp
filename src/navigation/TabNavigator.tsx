import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useStyles} from 'react-native-unistyles';
import {HomeScreen} from '../features/home/views/HomeScreen';
import {FavoritesScreen} from '../features/favorites/views/FavoritesScreen';
import {PlaylistsScreen} from '../features/playlists/views/PlaylistsScreen';
import {SettingsScreen} from '../features/settings/views/SettingsScreen';
import type {TabParamList} from './types';

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator(): React.JSX.Element {
  const {theme} = useStyles();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.tabActive,
        tabBarInactiveTintColor: theme.colors.tabInactive,
        tabBarStyle: {backgroundColor: theme.colors.tabBar},
      }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Playlists" component={PlaylistsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
