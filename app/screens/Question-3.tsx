import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';;
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';


type RootStackParamList = {
  'Question-2': { life: number; score: number };
  'Question-3': { life?: number; score?: number };
  'Question-4': { life: number; score: number };
};

type Question3ScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Question-3'
>;

type Question3ScreenRouteProp = RouteProp<RootStackParamList, 'Question-3'>;

type Props = {
  navigation: Question3ScreenNavigationProp;
  route: Question3ScreenRouteProp;
};

type Option = {
  id: string;
  text: string;
};

const Question_3: React.FC<Props> = ({ navigation, route }) => {
  const { life = 5, score = 0 } = route.params || {};

  const [answer, setAnswer] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [count, setCount] = useState<number>(life);

  const valor = count;

  const options: Option[] = [
    { id: '1', text: '<pic>' },
    { id: '2', text: '<image>' },
    { id: '3', text: '<src>' },
    { id: '4', text: '<img>' },
  ];

  const correctOptionId = '4';

  const handleSelectOption = (id: string) => {
    setAnswer(id);
    if (id === correctOptionId) {
      setMessage('¡Respuesta correcta!');
    } else {
      setCount((prevCount) => prevCount - 1);
      setMessage('Respuesta incorrecta, intenta de nuevo.');
    }
  };

  const getNextScore = () => {
    return answer === correctOptionId ? score + 10 : score;
  };

  return (
    <View style={Styles.Body}>
      <View style={Styles.Container}>
        <Text style={Styles.Icon}>❤️</Text>
        <Text style={Styles.Life}>{valor}</Text>
        <Text style={Styles.Cuestion}>
          ¿Qué etiqueta se utiliza para insertar una imagen?
        </Text>

        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              Styles.Button,
              answer === option.id && {
                backgroundColor:
                  option.id === correctOptionId ? 'green' : 'red',
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

      <View style={Styles.Button_Items}>
        <TouchableOpacity
          style={Styles.Button}
          onPress={() => navigation.navigate('Question-2', { life: valor, score })}
        >
          <Text style={Styles.TextButton}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={Styles.Button}
          onPress={() => {
            setAnswer(null);
            setMessage('');
            navigation.navigate('Question-4', {
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

export default Question_3;

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