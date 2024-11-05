import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {HomeScreen} from '../features/home/views/HomeScreen';
import {FavoritesScreen} from '../features/favorites/views/FavoritesScreen';
import {PlaylistsScreen} from '../features/playlists/views/PlaylistsScreen';
import {SettingsScreen} from '../features/settings/views/SettingsScreen';
import type {TabParamList} from './types';

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<keyof TabParamList, {filled: string; outline: string}> = {
  Home: {filled: 'home', outline: 'home-outline'},
  Favorites: {filled: 'heart', outline: 'heart-outline'},
  Playlists: {filled: 'list', outline: 'list-outline'},
  Settings: {filled: 'settings', outline: 'settings-outline'},
};

type TabBarIconProps = {
  routeName: keyof TabParamList;
  focused: boolean;
  color: string;
  size: number;
};

function TabBarIcon({routeName, focused, color, size}: TabBarIconProps): React.JSX.Element {
  const icon = TAB_ICONS[routeName];
  return <Ionicons name={focused ? icon.filled : icon.outline} color={color} size={size} />;
}

export function TabNavigator(): React.JSX.Element {
  const {theme} = useStyles();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.tabActive,
        tabBarInactiveTintColor: theme.colors.tabInactive,
        tabBarStyle: {backgroundColor: theme.colors.tabBar},
        // TabBarIcon is a stable module-level component; eslint can't see that through the render-prop
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({focused, color, size}) => (
          <TabBarIcon routeName={route.name} focused={focused} color={color} size={size} />
        ),
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Playlists" component={PlaylistsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
