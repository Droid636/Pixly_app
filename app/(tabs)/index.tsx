import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SplashScreen from '../screens/SplashScreen';
import StartScreen from '../screens/StartScreen';
import Niveles from '../screens/Niveles';

export type RootStackParamList = {
  Splash: undefined;
  Start: undefined;
  Login: undefined;
  Register : undefined;
  Niveles : undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function TabsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen}/>
      <Stack.Screen name="Niveles" component={Niveles}/>
    </Stack.Navigator>
  );
}
