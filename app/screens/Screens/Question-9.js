import React from 'react';
import react, { useState } from 'react';
import { Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import Styles from '../../Css/Styles';

const Qustion_9 = ({navigation, route}) => {

  // Recibe el valor de count life desde la navegación
  const { life } = route.params || {};
  //  Obtenemos el puntaje acumulado anterior (si existe)
  const previousScore = route.params?.score || 0;

  // Estados de respuesta y mensaje
  const [answer, setAnswer] = useState(null);
  const [message, setMessage] = useState('');
  // Estados de count life
  const [count, setCount] = useState(life || 5); // Si no se pasa, inicia en 5

  const valor = count;
  // Opciones de respuesta (puedes modificar texto y cuál es correcta)
  const options = [
    { id: '1', text: '<form>' },
    { id: '2', text: '<input>' },
    { id: '3', text: '<button>' },
    { id: '4', text: '<action>' },
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
        <Text style={Styles.Cuestion} >¿Cuál etiqueta se usa para crear un formulario?</Text>

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
      <View style={Styles.Button_Items}>
        <TouchableOpacity style={Styles.Button} onPress={() => navigation.navigate('Question-8')}>
          <Text style={Styles.TextButton}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={Styles.Button} 
          onPress={() => {
            setAnswer(null);
            setMessage('');
            navigation.navigate('Question-10', {life: valor, score: getNextScore() });
          }}
          disabled={answer === null}
          >
          <Text style={Styles.TextButton}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Qustion_9;