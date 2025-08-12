import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

import { useLogout } from '@/hooks/useLogout';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const SECCIONES_POR_NIVEL = 5;
const VIDAS_INICIALES = 5;
const TIEMPO_ESPERA = 60;

type Question = {
  _id: string;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
};

export default function Niveles() {
  const navigation = useNavigation<any>();
  const logout = useLogout();

  const [vidas, setVidas] = useState(VIDAS_INICIALES);
  const [timer, setTimer] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const [nivelAbiertoIndex, setNivelAbiertoIndex] = useState<number | null>(null);
  const [modalCerrarSesionVisible, setModalCerrarSesionVisible] = useState(false);

  const [modalPreguntasVisible, setModalPreguntasVisible] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});

  const [niveles, setNiveles] = useState(() =>
    [
      { id: 1, name: 'HTML5', color: '#FF00FF', description: 'Estructura HTML básica' },
      { id: 2, name: 'CSS', color: '#FFFFFF', description: 'Estilos y diseño' },
      { id: 3, name: 'JavaScript', color: '#FFA500', description: 'Lógica de programación' },
      { id: 4, name: 'React', color: '#00FF00', description: 'Componentes y hooks' },
    ].map((nivel) => ({
      ...nivel,
      secciones: Array(SECCIONES_POR_NIVEL).fill(null).map((_, j) => ({
        id: j + 1,
        titulo: j < 4 ? `Sección ${j + 1}` : 'Desafío Final',
        completado: false,
        bloqueado: false,
      }))
    }))
  );

  useEffect(() => {
    let intervalo: ReturnType<typeof setInterval>;
    if (bloqueado && timer > 0) {
      intervalo = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(intervalo);
            setVidas(VIDAS_INICIALES);
            setBloqueado(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [bloqueado, timer]);

  // Función para cargar preguntas para secciones normales (no desafío final)
  const fetchQuestions = async (nivelId: number, seccionId: number) => {
    setLoadingQuestions(true);
    try {
      // Cambia la URL para que sea tu API real, filtrando por nivel y sección si lo tienes
      const response = await fetch(`http://localhost:5000/api/questions/${getNivelKey(nivelId)}?level=${seccionId}&limit=5`);
      const json = await response.json();
      if (json.success && json.data && Array.isArray(json.data)) {
        setQuestions(json.data);
      } else {
        setQuestions([]);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    }
    setLoadingQuestions(false);
  };

  // Función para cargar preguntas para desafío final (de todos los niveles)
  const fetchDesafioFinalQuestions = async () => {
    setLoadingQuestions(true);
    try {
      // API que trae preguntas combinadas para desafío final
      const response = await  fetch(`http://localhost:5000/api/questions/desafio-final?limit=10`);
      const json = await response.json();
      if (json.success && json.data && Array.isArray(json.data)) {
        setQuestions(json.data);
      } else {
        setQuestions([]);
      }
    } catch (error) {
      console.error('Error fetching desafío final questions:', error);
      setQuestions([]);
    }
    setLoadingQuestions(false);
  };

  const [currentNivelIndex, setCurrentNivelIndex] = useState<number | null>(null);
  const [currentSeccionIndex, setCurrentSeccionIndex] = useState<number | null>(null);

  const openPreguntasModal = async (nivelIndex: number, seccionIndex: number) => {
    setSelectedAnswers({});
    setCurrentNivelIndex(nivelIndex);
    setCurrentSeccionIndex(seccionIndex);

    const esDesafioFinal = seccionIndex === SECCIONES_POR_NIVEL - 1;
    if (esDesafioFinal) {
      await fetchDesafioFinalQuestions();
    } else {
      const nivelId = niveles[nivelIndex].id;
      const seccionId = seccionIndex + 1;
      await fetchQuestions(nivelId, seccionId);
    }

    setModalPreguntasVisible(true);
  };

  const getNivelKey = (nivelId: number) => {
    switch (nivelId) {
      case 1: return 'html5';
      case 2: return 'css';
      case 3: return 'Javascript';
      case 4: return 'React';
      default: return 'Javascript';
    }
  };

  const selectOption = (questionId: string, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

 // Función que cierra modal sin afectar vidas ni lógica
const cerrarModalSinEvaluar = () => {
  setModalPreguntasVisible(false);
  setSelectedAnswers({});
};

// Función que evalúa respuestas y cierra modal (botón enviar)
const closePreguntasModal = () => {
  if (questions.length === 0) {
    setModalPreguntasVisible(false);
    return;
  }
  let todasCorrectas = true;
  questions.forEach(q => {
    if (selectedAnswers[q._id] !== q.answer) {
      todasCorrectas = false;
    }
  });

  if (todasCorrectas) {
    alert('✅ ¡Correcto! Sección completada');
    if (currentNivelIndex !== null && currentSeccionIndex !== null) {
      const nuevos = [...niveles];
      nuevos[currentNivelIndex].secciones[currentSeccionIndex].completado = true;

      if (currentSeccionIndex + 1 < SECCIONES_POR_NIVEL) {
        nuevos[currentNivelIndex].secciones[currentSeccionIndex + 1].bloqueado = false;
      } else if (currentNivelIndex + 1 < niveles.length) {
        nuevos[currentNivelIndex + 1].secciones[0].bloqueado = false;
      }

      setNiveles(nuevos);
    }
  } else {
    const nuevasVidas = vidas - 1;
    setVidas(nuevasVidas);
    if (nuevasVidas <= 0) {
      setBloqueado(true);
      setTimer(TIEMPO_ESPERA);
    }
    alert('❌ Fallaste. Has perdido una vida.');
  }

  setModalPreguntasVisible(false);
  setSelectedAnswers({});
};


  const [modalIntroduccionVisible, setModalIntroduccionVisible] = useState(false);
const [introduccion, setIntroduccion] = useState('');
const [codeExample, setCodeExample] = useState(''); // Nuevo estado para el código
const [loadingIntro, setLoadingIntro] = useState(false);
const fetchIntroduccion = async (nivelId: number) => {
    setLoadingIntro(true);
    setIntroduccion('');
    setCodeExample(''); // Reiniciar el código
    try {
      let key = getNivelKey(nivelId).toLowerCase();
      const response = await fetch(`http://localhost:5000/api/introductions/${key}`);
      const json = await response.json();
      if (json.data) {
        setIntroduccion(json.data.description || 'No hay introducción disponible.');
        setCodeExample(json.data.codeExample || 'No hay ejemplo de código disponible.'); // Asignar el código
      } else {
        setIntroduccion('No hay introducción disponible.');
        setCodeExample('No hay ejemplo de código disponible.');
      }
    } catch (e) {
      setIntroduccion('Error al cargar la introducción.');
      setCodeExample('Error al cargar el ejemplo de código.');
    }
    setLoadingIntro(false);
  };

  const handleSeccion = async (nivelIndex: number, seccionIndex: number) => {
  setCurrentNivelIndex(nivelIndex);
  setCurrentSeccionIndex(seccionIndex);
  await fetchIntroduccion(niveles[nivelIndex].id);
  setModalIntroduccionVisible(true); 
};

const continuarAPreguntas = async () => {
  setModalIntroduccionVisible(false);
  if (currentNivelIndex !== null && currentSeccionIndex !== null) {
    await openPreguntasModal(currentNivelIndex, currentSeccionIndex);
  }
};

  const getProgreso = (nivel: typeof niveles[number]) => {
    const completadas = nivel.secciones.filter(s => s.completado).length;
    return Math.round((completadas / SECCIONES_POR_NIVEL) * 100);
  };

  const handleCerrarSesionConfirmado = async () => {
    setModalCerrarSesionVisible(false);
    const result = await logout();
    if (result.success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } else {
      alert(`Error al cerrar sesión: ${result.error}`);
    }
  };

  const renderQuestion = ({ item }: { item: Question }) => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>{item.question}</Text>
      {item.options.map((opt) => {
        const selected = selectedAnswers[item._id] === opt;
        return (
          <TouchableOpacity
            key={opt}
            style={[styles.optionButton, selected && styles.optionSelected]}
            onPress={() => selectOption(item._id, opt)}
          >
            <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
      {selectedAnswers[item._id] === item.answer && (
        <Text style={styles.correctAnswer}>¡Correcto! {item.explanation ?? ''}</Text>
      )}
      {selectedAnswers[item._id] && selectedAnswers[item._id] !== item.answer && (
        <Text style={styles.wrongAnswer}>Respuesta incorrecta. Intenta otra opción.</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.statusBar} />
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.heartContainer}>
            <Text style={styles.heart}>❤</Text>
            <Text style={styles.levelNumber}>{vidas}</Text>
          </View>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => setModalCerrarSesionVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {niveles.map((nivel, idx) => (
          <TouchableOpacity
            key={nivel.id}
            style={styles.levelItem}
            activeOpacity={0.8}
            onPress={() => setNivelAbiertoIndex(idx)}
          >
            <View style={styles.progressBox}>
              <ProgressCircle
                percentage={getProgreso(nivel)}
                color={nivel.color}
                label={nivel.name}
              />
            </View>
          </TouchableOpacity>
        ))}

        {bloqueado && (
          <Text style={styles.timer}>⌛ Espera {timer}s para recuperar vidas</Text>
        )}
      </ScrollView>

      <Modal
        visible={nivelAbiertoIndex !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setNivelAbiertoIndex(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setNivelAbiertoIndex(null)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              {nivelAbiertoIndex !== null ? niveles[nivelAbiertoIndex].name : ''}
            </Text>

            <ScrollView>
              {nivelAbiertoIndex !== null && niveles[nivelAbiertoIndex].secciones.map((sec, i) => (
                <TouchableOpacity
                  key={sec.id}
                  style={[styles.seccionBtn, sec.bloqueado && styles.seccionBloqueada]}
                  onPress={() => handleSeccion(nivelAbiertoIndex, i)}
                >
                  <Text style={styles.seccionTexto}>
                    {sec.completado ? '✅ ' : ''}{sec.titulo}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

{/* Modal de Introducción (mejorado con código dinámico) */}
      <Modal
        visible={modalIntroduccionVisible}
        animationType="fade" // Un fade es más suave para intro
        transparent={true}
        onRequestClose={() => setModalIntroduccionVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.introModalContent}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setModalIntroduccionVisible(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.introIconContainer}>
              <Text style={styles.introIcon}>💡</Text>
            </View>

            <Text style={styles.introTitle}>
              ¡Prepárate para la sección!
            </Text>

            {loadingIntro ? (
              <ActivityIndicator size="large" color="#1572b6" style={styles.introLoading} />
            ) : (
              <ScrollView style={styles.introScroll}>
                <Text style={styles.introText}>{introduccion}</Text>
                {/* Nuevo: Cuadro con ejemplo de código dinámico */}
                <View style={styles.codeExampleContainer}>
                  <Text style={styles.codeExampleTitle}>Ejemplo de Código:</Text>
                  <Text style={styles.codeExampleText}>
                    {codeExample || "Cargando ejemplo de código..."}
                  </Text>
                </View>
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.introContinueButton}
              onPress={continuarAPreguntas}
              disabled={loadingIntro}
            >
              <Text style={styles.introContinueButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

     
      {/* Modal preguntas */}
<Modal
  visible={modalPreguntasVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setModalPreguntasVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      
      {/* Cambiar aquí la función */}
      <TouchableOpacity
        style={styles.modalCloseBtn}
        onPress={cerrarModalSinEvaluar}  
      >
        <Text style={styles.modalCloseText}>✕</Text>
      </TouchableOpacity>

      <Text style={styles.modalTitle}>
        {currentSeccionIndex === SECCIONES_POR_NIVEL - 1
          ? 'Desafío Final'
          : `Preguntas ${niveles[currentNivelIndex ?? 0]?.name} Sección ${currentSeccionIndex !== null ? currentSeccionIndex + 1 : ''}`}
      </Text>

      {loadingQuestions ? (
        <ActivityIndicator size="large" color="#1572b6" />
      ) : questions.length === 0 ? (
        <Text style={styles.noQuestionsText}>No hay preguntas disponibles.</Text>
      ) : (
        <FlatList
          data={questions}
          keyExtractor={(item) => item._id}
          renderItem={renderQuestion}
          extraData={selectedAnswers}
        />
      )}

      <TouchableOpacity
        style={styles.closeButton}
        onPress={closePreguntasModal}  
      >
        <Text style={styles.closeButtonText}>Enviar respuestas</Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal>



      {/* Modal confirmar cerrar sesión */}
      <Modal
        visible={modalCerrarSesionVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalCerrarSesionVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmTitle}>¿Cerrar sesión?</Text>
            <Text style={styles.confirmMessage}>¿Estás seguro que deseas cerrar sesión?</Text>

            <View style={styles.confirmButtonsRow}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.cancelButton]}
                onPress={() => setModalCerrarSesionVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmButton, styles.confirmButtonPrimary]}
                onPress={handleCerrarSesionConfirmado}
              >
                <Text style={styles.confirmButtonText}>Sí, cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const ProgressCircle = ({ percentage, color, label }: { percentage: number; color: string; label: string }) => {
  const size = 110;
  const radius = size / 2 - 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View>
      <Svg width={size} height={size}>
      <G transform={`translate(${size / 2}, ${size / 2})`}>
          <Circle cx={0} cy={0} r={radius} stroke="#E0E0E0" strokeWidth="8" fill="none" />
          <Circle
            cx={0}
            cy={0}
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90)"
          />
        </G>
      </Svg>
      <View style={styles.percentageText}>
        <Text style={styles.percentageNumber}>{percentage}%</Text>
        <Text style={styles.levelName}>{label}</Text>
      </View>
    </View>
  );
};

// -- Aquí agregas tus estilos --

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0057D9',
  },
  statusBar: {
    height: Platform.OS === 'web' ? 0 : 44,
    backgroundColor: '#1E90FF',
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: '#1E90FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
// --- Estilos para el nuevo modal de introducción (mejorado) ---
  introModalContent: {
    backgroundColor: '#F0F8FF', // Fondo más claro para destacar
    borderRadius: 24,
    width: '95%', // Aumentado el ancho
    maxHeight: '90%', // Aumentada la altura
    padding: 24,
    alignItems: 'center',
    shadowColor: '#1E90FF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 15,
  },
  introIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  introIcon: {
    fontSize: 48,
    color: '#fff',
  },
  introTitle: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    color: '#1572b6',
    marginBottom: 12,
  },
  introScroll: {
    maxHeight: 250,
  },
  introText: {
    fontSize: 16,
    color: '#222',
    textAlign: 'center',
    lineHeight: 24,
  },
  introLoading: {
    marginTop: 20,
    marginBottom: 20,
  },
  introContinueButton: {
    backgroundColor: '#1E90FF',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#1E90FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  introContinueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  // --- Nuevos estilos para el cuadro de código ---
  codeExampleContainer: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  codeExampleTitle: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  codeExampleText: {
    color: '#f8f8f2',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    lineHeight: 18,
  },
  // --- Fin de nuevos estilos ---,
  heart: {
    fontSize: 36,
    marginRight: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  levelNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1,
  },

  logoutBtn: {
    backgroundColor: '#FF4C4C',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    shadowColor: '#b22222',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 7,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.8,
  },

  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  levelItem: {
    marginVertical: 16,
  },
  progressBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0047b3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  percentageText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#222',
    marginBottom: 4,
    fontFamily: 'System',
  },
  levelName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  seccionBtn: {
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  seccionCompletada: {
    backgroundColor: '#4CAF50',
    shadowColor: '#2e7d32',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  seccionBloqueada: {
    backgroundColor: '#d9d9d9',
    opacity: 0.8,
    shadowColor: 'transparent',
    elevation: 0,
  },
  seccionTexto: {
    textAlign: 'center',
    color: '#222',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
    fontFamily: 'System',
  },
  timer: {
    marginTop: 24,
    fontSize: 18,
    textAlign: 'center',
    color: '#ff6600',
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: 'System',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',  // Fondo oscuro semitransparente
    justifyContent: 'center',             // Centrado vertical
    alignItems: 'center',                 // Centrado horizontal
    padding: 20,
  },
  modalContent: {
    justifyContent: 'center', // Centra verticalmente
     alignItems: 'center',     // Centra horizontalmente
    flex:1,
    backgroundColor: '#FFF',
    borderRadius: 24,
    width: '90%',
    maxHeight: '80%',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 15,
  },

  modalCloseBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  modalCloseText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#888',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 16,
    color: '#222',
  },

  noQuestionsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
  },
  questionContainer: {
    marginBottom: 25,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 15,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginVertical: 5,
  },
  optionSelected: {
    backgroundColor: '#1572b6',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  correctAnswer: {
    marginTop: 8,
    color: 'green',
    fontWeight: 'bold',
  },
  wrongAnswer: {
    marginTop: 8,
    color: 'red',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#1572b6',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },

  confirmModalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: '80%',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 12,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 12,
    color: '#222',
  },
  confirmMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 24,
    lineHeight: 22,
  },
  confirmButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ddd',
  },
  cancelButtonText: {
    color: '#555',
    fontWeight: '700',
    fontSize: 16,
  },
  confirmButtonPrimary: {
    backgroundColor: '#FF4C4C',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
},
});