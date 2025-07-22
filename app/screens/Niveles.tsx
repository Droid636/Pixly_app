import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert, Platform, ScrollView } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useQuestions } from '../../hooks/useQuestions';

const { width, height } = Dimensions.get('window');

interface LevelData {
  id: number;
  name: string;
  percentage: number;
  color: string;
  description: string;
}

interface ProgressCircleProps {
  level: LevelData;
  size?: number;
  onPress: () => void;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ level, size = 110, onPress }) => {
  const radius = size / 2 - 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (level.percentage / 100 * circumference);

  return (
    <TouchableOpacity 
      style={[{ width: size, height: size }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Svg width={size} height={size} style={{ margin: -1 }}>
        <G transform={`translate(${size / 2}, ${size / 2})`}>
          <Circle
            cx={0}
            cy={0}
            r={radius}
            stroke="#E0E0E0"
            strokeWidth="8"
            fill="none"
          />
          <Circle
            cx={0}
            cy={0}
            r={radius}
            stroke={level.color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90)"
          />
        </G>
      </Svg>
      <View style={styles.percentageText}>
        <Text style={styles.percentageNumber}>{level.percentage}%</Text>
        <Text style={styles.levelName}>{level.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function Niveles() {
  const [levels] = useState<LevelData[]>([
    { id: 1, name: 'CSS', percentage: 50, color: 'rgb(255, 255, 255)', description: 'Fundamentos de CSS y estilos básicos' },
    { id: 2, name: 'HTML', percentage: 80, color: '#FF00FF', description: 'Estructura HTML y elementos semánticos' },
    { id: 3, name: 'JavaScript', percentage: 90, color: '#FFA500', description: 'Programación JavaScript avanzada' },
    { id: 4, name: 'React', percentage: 100, color: '#00FF00', description: 'Programación React avanzada' },
    { id: 5, name: 'Python', percentage: 100, color: 'rgb(37, 56, 231)', description: 'Programación Python avanzada' },
    { id: 6, name: 'Java', percentage: 100, color: 'rgb(192, 37, 231)', description: 'Programación Java avanzada' },
    { id: 7, name: 'C++', percentage: 100, color: 'rgb(231, 37, 37)', description: 'Programación C++ avanzada' },
    { id: 8, name: 'C#', percentage: 100, color: 'rgb(180, 234, 105)', description: 'Programación C# avanzada' },
    { id: 9, name: 'C#', percentage: 100, color: 'rgb(231, 37, 163)', description: 'Programación C# avanzada' }
  ]);

  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const handleLevelPress = (level: LevelData) => {
    Alert.alert(
      `Nivel ${level.name}`,
      `${level.description}\n\nProgreso: ${level.percentage}%`,
      [
        { text: 'Cerrar', style: 'cancel' },
        { text: 'Continuar', onPress: () => setSelectedLanguage(level.name) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusBar} />
      <View style={styles.header}>
        <View style={styles.heartContainer}>
          <Text style={styles.heart}>❤️</Text>
          <Text style={styles.levelNumber}>5</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          {(() => {
            const rows = [];
            for (let i = 0; i < levels.length; i += 2) {
              const rowLevels = levels.slice(i, i + 2);
              rows.push(
                <View key={i} style={styles.row}>
                  {rowLevels.map((level) => (
                    <View key={level.id} style={styles.progressBox}>
                      <ProgressCircle 
                        level={level} 
                        onPress={() => handleLevelPress(level)}
                      />
                    </View>
                  ))}
                </View>
              );
            }
            return rows;
          })()}
        </View>
        {selectedLanguage && (
          <QuestionsFromAPI 
            language={selectedLanguage} 
            onClose={() => setSelectedLanguage(null)}
          />
        )}
      </ScrollView>
    </View>
  );
}

// Componente para mostrar preguntas de la API
interface Question {
  language: string;
  level: number;
  type: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface QuestionsFromAPIProps {
  language: string;
  onClose: () => void;
}

function QuestionsFromAPI({ language, onClose }: QuestionsFromAPIProps) {
  const { questions, loading, error } = useQuestions();
  const typedQuestions = (questions as Question[]).filter(q => q.language.toLowerCase() === language.toLowerCase());

  if (loading) return <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>Cargando preguntas...</Text>;
  if (error) return <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>Error al cargar preguntas</Text>;
  if (!typedQuestions || typedQuestions.length === 0) return <View style={{ marginTop: 30, padding: 10, backgroundColor: '#fff', borderRadius: 10 }}><Text style={{ color: '#333', textAlign: 'center' }}>No hay preguntas disponibles para este nivel</Text><Text style={{ color: '#007BFF', textAlign: 'center', marginTop: 10 }} onPress={onClose}>Cerrar</Text></View>;

  return (
    <View style={{ marginTop: 30, padding: 10, backgroundColor: '#fff', borderRadius: 10 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10, color: '#007BFF' }}>Preguntas de {language}:</Text>
      {typedQuestions.map((q, idx) => (
        <View key={idx} style={{ marginBottom: 15 }}>
          <Text style={{ fontWeight: 'bold', color: '#333' }}>{q.question}</Text>
          {q.options && q.options.map((opt: string, i: number) => (
            <Text key={i} style={{ color: '#555', marginLeft: 10 }}>- {opt}</Text>
          ))}
        </View>
      ))}
      <Text style={{ color: '#007BFF', textAlign: 'center', marginTop: 10 }} onPress={onClose}>Cerrar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007BFF',
  },
  statusBar: {
    height: Platform.OS === 'web' ? 0 : 44,
    backgroundColor: '#87CEEB',
  },
  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' ? 40 : 20,
    paddingBottom: Platform.OS === 'web' ? 60 : 40,
  },
  heartContainer: {
    alignItems: 'center',
  },
  heart: {
    fontSize: Platform.OS === 'web' ? 50 : 40,
    marginBottom: 10,
  },
  levelNumber: {
    fontSize: Platform.OS === 'web' ? 28 : 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gridContainer: {
    flex: 1,
    justifyContent: Platform.OS === 'web' ? 'center' : 'flex-start',
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'web' ? 40 : 10,
    maxWidth: Platform.OS === 'web' ? 600 : 360,
    alignSelf: 'center',
    paddingTop: Platform.OS === 'web' ? 0 : 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Platform.OS === 'web' ? 15 : 8,
  },
  progressBox: {
    backgroundColor: '#87CEEB',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#000',
    padding: Platform.OS === 'web' ? 25 : 18,
    marginHorizontal: Platform.OS === 'web' ? 15 : 8,
    width: Platform.OS === 'web' ? 160 : 140,
    height: Platform.OS === 'web' ? 160 : 140,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: Platform.OS === 'web' ? 20 : 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  levelName: {
    fontSize: Platform.OS === 'web' ? 14 : 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  }
}); 