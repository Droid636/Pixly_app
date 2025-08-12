import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Quiz from '../screens/Integradora/Resultado';
import LoginScreen from '../screens/LoginScreen';
import Niveles from '../screens/Niveles';
import RegisterScreen from '../screens/RegisterScreen';
import SplashScreen from '../screens/SplashScreen';
import StartScreen from '../screens/StartScreen';

//Pantallas Integradora
import IntegradoraInfoScreen from '../screens/Integradora/IntegradoraInfoScreen';
import IntegradoraPracticeScreen from '../screens/Integradora/IntegradoraPracticeScreen';
import IntegradoraQuestions1Screen from '../screens/Integradora/IntegradoraQuestions1Screen';
import IntegradoraQuestions2Screen from '../screens/Integradora/IntegradoraQuestions2Screen';

export type RootStackParamList = {
  Splash: undefined;
  Start: undefined;
  Login: undefined;
  Register: undefined;
  Niveles: undefined;
  Quiz: { score?: number };

  IntegradoraInfo: undefined;
  IntegradoraQuestions1: undefined;
  IntegradoraPractice: undefined;
  IntegradoraQuestions2: undefined;

  // Añadir sus pantallas
  // Ejemplo:
  // ReactInfo: undefined;
  // ReactQuestions: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function TabsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Niveles" component={Niveles} />
      <Stack.Screen name="Quiz" component={Quiz} />

      {/*Pueden añadir aquí sus pantallas de otras secciones */}

      <Stack.Screen name="IntegradoraInfo" component={IntegradoraInfoScreen} />
      <Stack.Screen
        name="IntegradoraQuestions1"
        component={IntegradoraQuestions1Screen}
      />
      <Stack.Screen
        name="IntegradoraPractice"
        component={IntegradoraPracticeScreen}
      />
      <Stack.Screen
        name="IntegradoraQuestions2"
        component={IntegradoraQuestions2Screen}
      />
    </Stack.Navigator>
  );
}
