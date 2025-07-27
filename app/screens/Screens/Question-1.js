import React from 'react';
import react, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Styles from '../../Css/Styles';


const Question_1 = ({navigation, route}) => {

  // Estados de respuesta y mensaje
  const [answer, setAnswer] = useState(null);
  const [message, setMessage] = useState('');
  
  // Estados de count life
  const [count, setCount] = useState(5);
 //  Obtenemos el puntaje acumulado anterior (si existe)
  const previousScore = route.params?.score || 0;


  const valor = count;
  // Opciones de respuesta (puedes modificar texto y cuál es correcta)

 

  const options = [
    { id: '1', text: 'HighText Machine Language' },
    { id: '2', text: 'HyperText and Markup Language' },
    { id: '3', text: 'HyperText Markup Language' },
    { id: '4', text: 'None of the above' },
  ];

  // Id de la respuesta correcta
  const correctOptionId = '1';

  // Función para validar la respuesta
  const handleSelectOption = (id) => {
    setAnswer(id);
    if (id === correctOptionId) {
      setMessage('¡Respuesta correcta!');
    } else {
      setCount(prevCount => prevCount - 1 );
      setMessage('Respuesta incorrecta, intenta de nuevo.');

    }
  };

  const getNextScore = () => {
    return answer === correctOptionId ? previousScore + 10 : previousScore;
  }

  return (
    <View style={Styles.Body}>
      <View style={Styles.Container}>
        <Text style={Styles.Icon}>❤️</Text>
        <Text style={Styles.Life}>{valor}</Text>
        <Text style={Styles.Cuestion} >¿Qué significa HTML?</Text>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              Styles.Button,
              answer === option.id && {
                backgroundColor: option.id === correctOptionId ? 'green' : 'red',
              }
            ]}
            onPress={() => handleSelectOption(option.id)}
            disabled={answer !== null} // Deshabilita después de seleccionar
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
            navigation.navigate('Question-2', {life: valor, score: getNextScore() }); // O la siguiente pantalla
          }}
          disabled={answer === null} // Solo habilita "Next" si respondieron
          >
          <Text style={Styles.TextButton}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Question_1;