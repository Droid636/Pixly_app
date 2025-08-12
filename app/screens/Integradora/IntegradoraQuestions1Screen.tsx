import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Question = {
  _id: string;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
};

export default function IntegradoraQuestions1Screen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const { data: res } = await axios.get('http://localhost:5000/api/questions', {
          params: { limit: 5 },
        });
        if (res.success && res.data) {
          const questionsData = Array.isArray(res.data) ? res.data : [res.data];
          setQuestions(questionsData);
        } else {
          console.error('Error al cargar preguntas', res.message);
        }
      } catch (error) {
        console.error('Error al obtener preguntas:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;

  if (questions.length === 0) return <Text style={styles.center}>No hay preguntas disponibles.</Text>;

  const question = questions[currentIndex];

  const onSelectOption = (option: string) => {
    setSelectedOption(option);
  };

  const onNext = () => {
    setSelectedOption(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert('Examen terminado');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question.question}</Text>

      {question.options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[styles.option, selectedOption === option && styles.selectedOption]}
          onPress={() => onSelectOption(option)}
          disabled={!!selectedOption}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.nextButton, !selectedOption && styles.disabledButton]}
        onPress={onNext}
        disabled={!selectedOption}
      >
        <Text style={styles.nextButtonText}>Siguiente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  center: { flex: 1, textAlign: 'center', marginTop: 50 },
  question: { fontSize: 20, marginBottom: 20 },
  option: {
    padding: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: '#ddd',
  },
  optionText: { fontSize: 16 },
  nextButton: {
    marginTop: 30,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  nextButtonText: { color: '#fff', fontWeight: 'bold' },
});
