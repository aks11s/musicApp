import React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import type {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// TODO: temporary root screen — replaced by the tab navigator in the next step
function RootPlaceholder(): React.JSX.Element {
  const {styles} = useStyles(stylesheet);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>musicApp</Text>
    </View>
  );
}

export function RootNavigator(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Root" component={RootPlaceholder} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.heading,
    fontWeight: theme.typography.weights.bold,
  },
}));
