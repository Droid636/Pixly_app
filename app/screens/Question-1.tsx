import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// 🔧 Define tus rutas si no las tienes
type RootStackParamList = {
  'Question-1': { score?: number };
  'Question-2': { life: number; score: number };
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Question-1'>;
  route: RouteProp<RootStackParamList, 'Question-1'>;
};

const Question_1: React.FC<Props> = ({ navigation, route }) => {
  const [answer, setAnswer] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [count, setCount] = useState<number>(5);

  const previousScore: number = route.params?.score || 0;
  const valor = count;

  const options = [
    { id: '1', text: 'HighText Machine Language' },
    { id: '2', text: 'HyperText and Markup Language' },
    { id: '3', text: 'HyperText Markup Language' },
    { id: '4', text: 'None of the above' },
  ];

  const correctOptionId = '1';

  const handleSelectOption = (id: string) => {
    setAnswer(id);
    if (id === correctOptionId) {
      setMessage('¡Respuesta correcta!');
    } else {
      setCount((prevCount) => prevCount - 1);
      setMessage('Respuesta incorrecta, intenta de nuevo.');
    }
  };

  const getNextScore = (): number => {
    return answer === correctOptionId ? previousScore + 10 : previousScore;
  };

  return (
    <View style={Styles.Body}>
      <View style={Styles.Container}>
        <Text style={Styles.Icon}>❤️</Text>
        <Text style={Styles.Life}>{valor}</Text>
        <Text style={Styles.Cuestion}>¿Qué significa HTML?</Text>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              Styles.Button,
              answer === option.id && {
                backgroundColor: option.id === correctOptionId ? 'green' : 'red',
              },
            ]}
            onPress={() => handleSelectOption(option.id)}
            disabled={answer !== null}
          >
            <Text style={Styles.TextButton}>{option.text}</Text>
          </TouchableOpacity>
        ))}

        {message !== '' && (
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: answer === correctOptionId ? 'white' : 'red',
              textAlign: 'center',
            }}
          >
            {message}
          </Text>
        )}
      </View>

      <View style={Styles.ButtonNext}>
        <TouchableOpacity
          style={Styles.Button}
          onPress={() => {
            setAnswer(null);
            setMessage('');
            navigation.navigate('Question-2', {
              life: valor,
              score: getNextScore(),
            });
          }}
          disabled={answer === null}
        >
          <Text style={Styles.TextButton}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Question_1;

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