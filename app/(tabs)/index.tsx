import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import StartScreen from '../screens/StartScreen';
import LoginScreen from '../screens/LoginScreen';

export type RootStackParamList = {
  Splash: undefined;
  Start: undefined;
  Login: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function TabsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
