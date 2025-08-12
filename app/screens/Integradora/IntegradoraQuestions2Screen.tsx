import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Question = {
  _id: string;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
};

export default function IntegradoraFinalExamScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const { data: res } = await axios.get(
          "http://localhost:5000/api/questions",
          {
            params: { limit: 25 },
          }
        );
        if (res.success && res.data) {
          const questionsData = Array.isArray(res.data) ? res.data : [res.data];
          setQuestions(questionsData);
        } else {
          console.error("Error al cargar preguntas", res.message);
        }
      } catch (error) {
        console.error("Error al obtener preguntas:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  const currentQuestion = questions[currentIndex];

  const onSelectOption = (option: string) => {
    setSelectedOption(option);
  };

  const onNext = () => {
    if (selectedOption === null) {
      Alert.alert("Selecciona una opción antes de continuar");
      return;
    }
    setAnswers((prev) => ({ ...prev, [currentQuestion._id]: selectedOption }));
    setSelectedOption(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      calculateScore();
      setShowResult(true);
    }
  };

  const calculateScore = () => {
    let s = 0;
    questions.forEach((q) => {
      if (answers[q._id] === q.answer) {
        s++;
      }
    });
    setScore(s);
  };

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );

  if (questions.length === 0)
    return <Text style={styles.center}>No hay preguntas disponibles.</Text>;

  if (showResult) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Examen Final</Text>
        <Text style={styles.score}>
          Tu puntaje: {score} / {questions.length}
        </Text>
        <ScrollView style={{ marginTop: 20 }}>
          {questions.map((q, idx) => (
            <View key={q._id} style={styles.reviewQuestion}>
              <Text style={styles.question}>
                {idx + 1}. {q.question}
              </Text>
              {q.options.map((option) => {
                const isCorrect = option === q.answer;
                const userSelected = answers[q._id] === option;
                const optionStyle = [
                  styles.option,
                  isCorrect && { backgroundColor: "#c8e6c9" }, // verde para correcta
                  userSelected && !isCorrect && { backgroundColor: "#ffcdd2" }, // rojo si seleccionada y es incorrecta
                ];

                return (
                  <View key={option} style={optionStyle}>
                    <Text>
                      {option} {isCorrect ? "✔️" : ""}{" "}
                      {userSelected && !isCorrect ? "❌" : ""}
                    </Text>
                  </View>
                );
              })}

              {q.explanation ? (
                <Text style={styles.explanation}>
                  Explicación: {q.explanation}
                </Text>
              ) : null}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Pregunta {currentIndex + 1} / {questions.length}
      </Text>
      <Text style={styles.question}>{currentQuestion.question}</Text>

      {currentQuestion.options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.option,
            selectedOption === option && styles.selectedOption,
          ]}
          onPress={() => onSelectOption(option)}
        >
          <Text>{option}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[
          styles.nextButton,
          selectedOption === null && styles.disabledButton,
        ]}
        onPress={onNext}
        disabled={selectedOption === null}
      >
        <Text style={styles.nextButtonText}>
          {currentIndex === questions.length - 1 ? "Terminar" : "Siguiente"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  center: { flex: 1, textAlign: "center", marginTop: 50 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  question: { fontSize: 18, marginVertical: 15 },
  option: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#555",
  },
  selectedOption: {
    backgroundColor: "#d0e1fd",
  },
  nextButton: {
    marginTop: 30,
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#999",
  },
  nextButtonText: { color: "#fff", fontWeight: "bold" },
  score: {
    fontSize: 20,
    marginVertical: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  reviewQuestion: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
  },
  explanation: {
    marginTop: 5,
    fontStyle: "italic",
    color: "#444",
  },
});
