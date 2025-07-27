import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Styles from '../../Css/Styles';

const Quiz = ({ route}) => {

  const finalScore = route.params?.score || 0;

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
