import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

import { useLogout } from '@/hooks/useLogout'; // Importa tu hook de logout
import { useNavigation } from '@react-navigation/native'; // Importa navegación

const { width } = Dimensions.get('window');

const SECCIONES_POR_NIVEL = 5;
const VIDAS_INICIALES = 5;
const TIEMPO_ESPERA = 60;

export default function Niveles() {
  const navigation = useNavigation<any>();  // Para navegación
  const logout = useLogout();                // Hook para cerrar sesión

  const [vidas, setVidas] = useState(VIDAS_INICIALES);
  const [timer, setTimer] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const [nivelAbierto, setNivelAbierto] = useState<number | null>(null);
  const [modalCerrarSesionVisible, setModalCerrarSesionVisible] = useState(false);

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
      alert('✅ ¡Correcto! ' + seccion.titulo + ' completada');
    } else {
      const nuevasVidas = vidas - 1;
      setVidas(nuevasVidas);
      if (nuevasVidas <= 0) {
        setBloqueado(true);
        setTimer(TIEMPO_ESPERA);
      }
      alert('❌ Fallaste. Has perdido una vida.');
    }
  };

  const getProgreso = (nivel: typeof niveles[number]) => {
    const completadas = nivel.secciones.filter(s => s.completado).length;
    return Math.round((completadas / SECCIONES_POR_NIVEL) * 100);
  };

  // Función para confirmar cierre de sesión
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

  return (
    <View style={styles.container}>
      <View style={styles.statusBar} />
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.heartContainer}>
            <Text style={styles.heart}>❤️</Text>
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
            onPress={() => setNivelAbierto(nivel.id)}
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

      {/* Modal niveles */}
      <Modal
        visible={nivelAbierto !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setNivelAbierto(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setNivelAbierto(null)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              {niveles.find(n => n.id === nivelAbierto)?.name}
            </Text>

            <ScrollView>
              {nivelAbierto !== null && niveles.find(n => n.id === nivelAbierto)?.secciones.map((sec, i) => (
                <TouchableOpacity
                  key={sec.id}
                  style={[
                    styles.seccionBtn,
                    sec.completado && styles.seccionCompletada,
                    sec.bloqueado && styles.seccionBloqueada
                  ]}
                  disabled={sec.bloqueado || sec.completado || bloqueado}
                  onPress={() => {
                    const nivelIndex = niveles.findIndex(n => n.id === nivelAbierto);
                    handleSeccion(nivelIndex, i);
                  }}
                >
                  <Text style={styles.seccionTexto}>
                    {sec.completado ? '✅' : sec.bloqueado ? '🔒' : '➡️'} {sec.titulo}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
    top: 0, left: 0, right: 0, bottom: 0,
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
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
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

  /* Estilos para modal confirmar cerrar sesión */
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
    fontSize: 16,
  },
});
