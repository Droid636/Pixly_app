import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/app/(tabs)'; // Ajusta la ruta según tu proyecto

type Item = { key: string; label: string };

type DesafioFinalJSRouteProp = RouteProp<RootStackParamList, 'DesafioFinalJS'>;

const listaCorrectaJS: Item[] = [
  { key: '1', label: 'var' },
  { key: '2', label: 'let' },
  { key: '3', label: 'const' },
  { key: '4', label: 'function()' },
];

export default function DesafioFinalJS() {
  const navigation = useNavigation();
  const route = useRoute<DesafioFinalJSRouteProp>();

  // Extraemos los params que vienen de la navegación
  const { onComplete } = route.params || {};

  const [data, setData] = useState<Item[]>(shuffleArray([...listaCorrectaJS]));

  function shuffleArray(array: Item[]): Item[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const validarOrden = () => {
    const estaCorrecto = data.every(
      (item, index) => item.key === listaCorrectaJS[index].key
    );

    if (estaCorrecto) {
      Alert.alert('¡Correcto!', 'Has ordenado bien las palabras clave JavaScript.', [
        {
          text: 'OK',
          onPress: () => {
            if (typeof onComplete === 'function') onComplete(true);
            navigation.goBack();
          },
        },
      ]);
    } else {
      if (typeof onComplete === 'function') onComplete(false);
      Alert.alert('Incorrecto', 'El orden no es correcto. Intenta de nuevo.');
    }
  };

  const renderItem = ({
    item,
    drag,
    isActive,
  }: {
    item: Item;
    drag: () => void;
    isActive: boolean;
  }) => (
    <View style={[styles.item, { backgroundColor: isActive ? '#cfc' : '#e8f5e9' }]}>
      <Text onLongPress={drag} style={styles.text}>
        {item.label}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.cad}  >
        <Text style={styles.title}>Ordena las palabras clave JS para pasar al siguiente nivel</Text>
      <DraggableFlatList
        data={data}
        onDragEnd={({ data }) => setData(data)}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
      />
      <TouchableOpacity style={styles.introContinueButton} onPress={validarOrden}>
        <Text style={styles.introContinueButtonText}>Enviar respuestas</Text>
      </TouchableOpacity>
      
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#0057D9', justifyContent: 'center', },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  item: {
    padding: 15,
    marginVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2e7d32',
  },
  text: { fontSize: 18 },
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
  cad:{
    backgroundColor: 'white', padding: 20, borderRadius: 10  
  }
});
