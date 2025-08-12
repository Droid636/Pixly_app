import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define el tipo RootStackParamList si no lo tienes ya
type RootStackParamList = {
  DesafioFinalCSS: {
    onComplete?: (resultado: boolean) => void;
  };
};

type DesafioFinalCSSRouteProp = RouteProp<RootStackParamList, 'DesafioFinalCSS'>;
type DesafioFinalCSSNavigationProp = StackNavigationProp<RootStackParamList, 'DesafioFinalCSS'>;

type Item = { key: string; label: string };

const listaCorrectaCSS: Item[] = [
  { key: '1', label: 'selector { }' },
  { key: '2', label: 'propiedad: valor;' },
  { key: '3', label: 'color' },
  { key: '4', label: 'background-color' },
];

export default function DesafioFinalCSS() {
  const navigation = useNavigation<DesafioFinalCSSNavigationProp>();
  const route = useRoute<DesafioFinalCSSRouteProp>();

  const onComplete = route.params?.onComplete;

  const [data, setData] = useState<Item[]>(shuffleArray([...listaCorrectaCSS]));

  function shuffleArray(array: Item[]): Item[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const validarOrden = () => {
    const estaCorrecto = data.every((item, index) => item.key === listaCorrectaCSS[index].key);
    if (estaCorrecto) {
      if (onComplete) onComplete(true);
      alert('✅ Orden correcto!');
    } else {
      if (onComplete) onComplete(false);
      alert('❌ Orden incorrecto.');
    }
    navigation.goBack(); // Regresa a la pantalla anterior
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
    <View style={[styles.item, { backgroundColor: isActive ? '#fcc' : '#ffebee' }]}>
      <Text onLongPress={drag} style={styles.text}>
        {item.label}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.cad}>
        <Text style={styles.title}>Ordena las reglas CSS para pasar al siguiente nivel</Text>
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
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#0057D9',
    justifyContent: 'center',},
  title: {color:'black', fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
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
