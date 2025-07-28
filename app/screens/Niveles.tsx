import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Platform, ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface LevelData {
  id: number;
  name: string;
  color: string;
  description: string;
}

interface Seccion {
  id: number;
  titulo: string;
  completado: boolean;
  bloqueado: boolean;
}

const SECCIONES_POR_NIVEL = 5;
const VIDAS_INICIALES = 5;
const TIEMPO_ESPERA = 60;

export default function Niveles() {
  const [vidas, setVidas] = useState(VIDAS_INICIALES);
  const [timer, setTimer] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const [nivelAbierto, setNivelAbierto] = useState<number | null>(null);

  const [niveles, setNiveles] = useState(() =>
    [
      { id: 1, name: 'HTML', color: '#FF00FF', description: 'Estructura HTML básica' },
      { id: 2, name: 'CSS', color: '#FFFFFF', description: 'Estilos y diseño' },
      { id: 3, name: 'JavaScript', color: '#FFA500', description: 'Lógica de programación' },
      { id: 4, name: 'React', color: '#00FF00', description: 'Componentes y hooks' },
    ].map((nivel, i) => ({
      ...nivel,
      secciones: Array(SECCIONES_POR_NIVEL).fill(null).map((_, j) => ({
        id: j + 1,
        titulo: j < 4 ? `Sección ${j + 1}` : 'Desafío Final',
        completado: false,
        bloqueado: i > 0 || j > 0,
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

  const handleSeccion = (nivelIndex: number, seccionIndex: number) => {
    const nivel = niveles[nivelIndex];
    const seccion = nivel.secciones[seccionIndex];

    if (seccion.bloqueado || seccion.completado || bloqueado) return;

    const exito = Math.random() > 0.3;

    if (exito) {
      const nuevos = [...niveles];
      nuevos[nivelIndex].secciones[seccionIndex].completado = true;

      if (seccionIndex + 1 < SECCIONES_POR_NIVEL) {
        nuevos[nivelIndex].secciones[seccionIndex + 1].bloqueado = false;
      } else if (nivelIndex + 1 < niveles.length) {
        nuevos[nivelIndex + 1].secciones[0].bloqueado = false;
      }

      setNiveles(nuevos);
      Alert.alert("✅ ¡Correcto!", `${seccion.titulo} completada`);
    } else {
      const nuevasVidas = vidas - 1;
      setVidas(nuevasVidas);
      if (nuevasVidas <= 0) {
        setBloqueado(true);
        setTimer(TIEMPO_ESPERA);
      }
      Alert.alert("❌ Fallaste", "Has perdido una vida.");
    }
  };

  const getProgreso = (nivel: typeof niveles[number]) => {
    const completadas = nivel.secciones.filter(s => s.completado).length;
    return Math.round((completadas / SECCIONES_POR_NIVEL) * 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusBar} />
      <View style={styles.header}>
        <View style={styles.heartContainer}>
          <Text style={styles.heart}>❤️</Text>
          <Text style={styles.levelNumber}>{vidas}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.gridContainer}>
          {niveles.map((nivel, idx) => (
            <View key={nivel.id} style={{ alignItems: 'center', marginBottom: 20 }}>
              <TouchableOpacity
                onPress={() => setNivelAbierto(nivelAbierto === nivel.id ? null : nivel.id)}
                activeOpacity={0.9}
              >
                <View style={styles.progressBox}>
                  <ProgressCircle
                    percentage={getProgreso(nivel)}
                    color={nivel.color}
                    label={nivel.name}
                  />
                </View>
              </TouchableOpacity>

              {nivelAbierto === nivel.id && (
                <View style={{ marginTop: 10 }}>
                  {nivel.secciones.map((sec, i) => (
                    <TouchableOpacity
                      key={sec.id}
                      style={[
                        styles.seccionBtn,
                        sec.completado && styles.seccionCompletada,
                        sec.bloqueado && styles.seccionBloqueada
                      ]}
                      disabled={sec.bloqueado || sec.completado || bloqueado}
                      onPress={() => handleSeccion(idx, i)}
                    >
                      <Text style={styles.seccionTexto}>
                        {sec.completado ? '✅' : sec.bloqueado ? '🔒' : '➡️'} {sec.titulo}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
        {bloqueado && (
          <Text style={styles.timer}>⌛ Espera {timer}s para recuperar vidas</Text>
        )}
      </ScrollView>
    </View>
  );
}

const ProgressCircle = ({ percentage, color, label }: { percentage: number, color: string, label: string }) => {
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#007BFF' },
  statusBar: { height: Platform.OS === 'web' ? 0 : 44, backgroundColor: '#87CEEB' },
  header: { alignItems: 'center', paddingTop: 20, paddingBottom: 40 },
  heartContainer: { alignItems: 'center' },
  heart: { fontSize: 40, marginBottom: 10 },
  levelNumber: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  scrollContent: { paddingBottom: 30 },
  gridContainer: { paddingHorizontal: 20 },
  progressBox: {
    backgroundColor: '#87CEEB',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#000',
    padding: 18,
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center'
  },
  percentageNumber: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  levelName: { fontSize: 12, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  seccionBtn: {
    backgroundColor: '#ffffff',
    marginVertical: 4,
    padding: 10,
    borderRadius: 8,
  },
  seccionCompletada: {
    backgroundColor: '#28a745',
  },
  seccionBloqueada: {
    backgroundColor: '#ccc',
  },
  seccionTexto: {
    textAlign: 'center',
    color: '#000',
    fontWeight: '600'
  },
  timer: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#ff6600',
  }
});
