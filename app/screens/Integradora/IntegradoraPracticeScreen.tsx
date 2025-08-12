import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Video from 'react-native-video';
import type { RootStackParamList } from '../../../app/(tabs)/index';

type Props = NativeStackScreenProps<RootStackParamList, 'IntegradoraPractice'>;

export default function IntegradoraPracticeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Este es un ejemplo de todo lo que haz aprendido en ejecucion</Text>
      
      <Video
        source={require('../../../assets/video/videoexample.mp4')}
        style={styles.video}
        controls
        resizeMode="contain"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('IntegradoraQuestions2')}
      >
        <Text style={styles.buttonText}>Siguiente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0083ff',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  video: {
    width: '100%',
    height: 220,
    backgroundColor: 'black',
    borderRadius: 10,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
