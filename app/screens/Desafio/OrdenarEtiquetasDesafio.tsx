import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

type Item = { key: string; label: string };

type RootStackParamList = {
  DesafioFinalHTML: {
    nivel: number;
    seccion: number;
    onComplete: (resultado: boolean) => void;
  };
  Niveles: undefined;
};

const listaCorrectaHTML: Item[] = [
  { key: '1', label: '<html>' },
  { key: '2', label: '<head>' },
  { key: '3', label: '<body>' },
  { key: '4', label: '<h1>' },
];

export default function DesafioFinalHTML() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'DesafioFinalHTML'>>();

  const { onComplete } = route.params;

  const [data, setData] = useState<Item[]>(shuffleArray([...listaCorrectaHTML]));

  function shuffleArray(array: Item[]): Item[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const validarOrden = () => {
    const estaCorrecto = data.every((item, index) => item.key === listaCorrectaHTML[index].key);
    if (estaCorrecto) {
      Alert.alert('¡Correcto!', 'Has ordenado bien las etiquetas HTML.', [
        {
          text: 'OK',
          onPress: () => {
            if (onComplete) onComplete(true);  // Avisamos que el usuario completó bien
            navigation.goBack();
          },
        },
      ]);
    } else {
      Alert.alert('Incorrecto', 'El orden no es correcto. Intenta de nuevo.', [
        {
          text: 'OK',
          onPress: () => {
            if (onComplete) onComplete(false); // Avisamos que falló
          },
        },
      ]);
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
    <View style={[styles.item, { backgroundColor: isActive ? '#cce' : '#e0f7fa' }]}>
      <Text onLongPress={drag} style={styles.text}>
        {item.label}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.cad}>
        <Text style={styles.title}>Ordena las etiquetas HTML para avanzar al siguente nivel</Text>
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
  container: { 
    flex: 1, 
    padding: 20, 
    paddingTop: 50,
    backgroundColor: '#0057D9',
    justifyContent: 'center',
    
  },
  title: { color:'black', fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  item: {
    padding: 15,
    marginVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0288d1',
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
