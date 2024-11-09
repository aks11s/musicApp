import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {HomeScreen} from '../features/home/views/HomeScreen';
import {FavoritesScreen} from '../features/favorites/views/FavoritesScreen';
import {PlaylistsScreen} from '../features/playlists/views/PlaylistsScreen';
import {SettingsScreen} from '../features/settings/views/SettingsScreen';
import {TAB_BAR_ICON_SIZE, TAB_BAR_TOP_PADDING} from './constants';
import type {TabParamList} from './types';
import {useTabBarHeight} from './useTabBarHeight';

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
};

function TabBarIcon({routeName, focused, color}: TabBarIconProps): React.JSX.Element {
  const icon = TAB_ICONS[routeName];
  return <Ionicons name={focused ? icon.filled : icon.outline} color={color} size={TAB_BAR_ICON_SIZE} />;
}

export function TabNavigator(): React.JSX.Element {
  const {theme} = useStyles();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useTabBarHeight();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.tabActive,
        tabBarInactiveTintColor: theme.colors.tabInactive,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar,
          borderTopColor: theme.colors.border,
          height: tabBarHeight,
          paddingTop: TAB_BAR_TOP_PADDING,
          paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.families.semibold,
          fontSize: theme.typography.sizes.micro,
        },
        // TabBarIcon is a stable module-level component; eslint can't see that through the render-prop
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({focused, color}) => (
          <TabBarIcon routeName={route.name} focused={focused} color={color} />
        ),
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Playlists" component={PlaylistsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
