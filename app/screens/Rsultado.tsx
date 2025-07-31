import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { Text, StyleSheet, View,} from 'react-native';

type RootStackParamList = {
  Quiz: { score?: number };
};

type QuizRouteProp = RouteProp<RootStackParamList, 'Quiz'>;

type Props = {
  route: QuizRouteProp;
};

const Quiz: React.FC<Props> = ({ route }) => {
  const finalScore = route.params?.score ?? 0;

  return (
    <View style={Styles.Body}>
      <View style={Styles.Container}>
        <Text style={Styles.resultTitle}>¡Quiz finalizado!</Text>
        <Text style={Styles.resultText}>Tu puntaje final es:</Text>
        <Text style={Styles.score}>{finalScore} / 100</Text>
        <Text style={Styles.feedback}>
          {finalScore === 100
            ? '¡Excelente trabajo!'
            : finalScore >= 70
            ? '¡Muy bien, sigue practicando!'
            : '¡Ánimo! Puedes volver a intentarlo.'}
        </Text>
      </View>
    </View>
  );
};

export default Quiz;

const Styles = StyleSheet.create({
  Body: {
    flex: 1,
    backgroundColor: '#0083ff',
  },
  Container: {
    alignItems: 'center',
    padding: 10,
  },
  Icon: {
    fontSize: 50,
  },
  Life: {
    fontSize: 30,
    color: '#fff',
  },
  TextTitulo: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  Textos: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    margin: 60,
    marginBottom: 60,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 20,
    textAlign: 'center',
  },
  score: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginVertical: 20,
  },
  feedback: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
  Cuestion: {
    backgroundColor: '#fff',
    fontSize: 15,
    padding: 10,
    margin: 30,
    borderRadius: 30,
  },
  Button: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 40,
    paddingVertical: 10,
  },
  TextButton: {
    fontSize: 20,
  },
  Button_Items: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  ButtonNext: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});