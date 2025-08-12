import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Video from 'react-native-video';
import type { RootStackParamList } from '../../../app/(tabs)/index';

type IntegradoraInfoNavProp = StackNavigationProp<
  RootStackParamList,
  'IntegradoraInfo'
>;

const { width } = Dimensions.get('window');

export default function IntegradoraInfoScreen() {
  const navigation = useNavigation<IntegradoraInfoNavProp>();

  const handleContinue = () => {
    navigation.navigate('IntegradoraQuestions1');
  };

  return (
    <View style={styles.body}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Sección Integradora</Text>

        <Text style={styles.textos}>
          En esta sección combinaremos todo lo aprendido de HTML, CSS, JavaScript y React.
          Primero verás un video introductorio, luego resolverás las secciones que corresponden.
        </Text>

        <Video
          source={require('../../../assets/video/integradora_intro.mp4')}
          style={styles.video}
          resizeMode="contain"
          controls
        />

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Comenzar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#0083ff',
  },
  scrollContent: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  textos: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  video: {
    width: width - 40,
    height: 200,
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#0083ff',
    fontWeight: 'bold',
  },
});
