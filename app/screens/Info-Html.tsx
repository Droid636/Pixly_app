import React from "react";
import { Text, View,StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Tipado para props del componente
type Props = {
  navigation: NativeStackNavigationProp<any>; // Puedes reemplazar `any` con tu tipo de rutas si usas TypeScript para navegación
};

const Info_Html: React.FC<Props> = ({ navigation }) => {
  return (
    <ScrollView style={Styles.Body}>
      <View style={Styles.Container}>
        <Text style={Styles.TextTitulo}>¿Qué es HTML?</Text>
        <Text style={Styles.Textos}>
          HTML (HyperText Markup Language) es el lenguaje de marcado estándar
          utilizado para crear páginas web. Proporciona la estructura básica de
          un documento web, permitiendo definir elementos como encabezados,
          párrafos, enlaces, imágenes y otros contenidos multimedia.
        </Text>

        <Text style={Styles.TextTitulo}>¿Para qué sirve?</Text>
        <Text style={Styles.Textos}>
          HTML organiza los elementos visibles de una web, como:
          {"\n"}- Encabezados: para títulos y subtítulos.
          {"\n"}- Párrafos: para texto.
          {"\n"}- Enlaces: para navegar entre páginas.
          {"\n"}- Imágenes: para mostrar gráficos y fotos.
          {"\n"}- Listas: para organizar información en formato de lista.
        </Text>

        <View style={Styles.ButtonNext}>
          <TouchableOpacity
            style={Styles.Button}
            onPress={() => {
              navigation.navigate("Question-1");
            }}
            activeOpacity={0.7}
          >
            <Text style={Styles.TextButton}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};


export default Info_Html;

const Styles = StyleSheet.create({
  Body: {
    flex: 1,
    backgroundColor: '#0083ff',
  },
  Container: {
    alignItems: 'center',
    padding: 10,
  },
  Icon: {
    fontSize: 50,
  },
  Life: {
    fontSize: 30,
    color: '#fff',
  },
  TextTitulo: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  Textos: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    margin: 60,
    marginBottom: 60,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 20,
    textAlign: 'center',
  },
  score: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginVertical: 20,
  },
  feedback: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
  Cuestion: {
    backgroundColor: '#fff',
    fontSize: 15,
    padding: 10,
    margin: 30,
    borderRadius: 30,
  },
  Button: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 40,
    paddingVertical: 10,
  },
  TextButton: {
    fontSize: 20,
  },
  Button_Items: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  ButtonNext: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});