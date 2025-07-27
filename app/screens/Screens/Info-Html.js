import React from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import Styles from "../../Css/Styles";

const Info_Html = ({navigation}) => {
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
          <Text style={Styles.Textos}>
            {"\n"}- Encabezados: para títulos y subtítulos.
            {"\n"}- Párrafos: para texto.
            {"\n"}- Enlaces: para navegar entre páginas.
            {"\n"}- Imágenes: para mostrar gráficos y fotos.
            {"\n"}- Listas: para organizar información en formato de lista.</Text>
          </Text>
          <View style={Styles.ButtonNext}>
            <TouchableOpacity 
              style={Styles.Button} 
              onPress={() => {
                navigation.navigate('Question-1'); // O la siguiente pantalla
              }}
              activeOpacity={0.7} // Efecto al presionar
              >
              <Text style={Styles.TextButton}>Next</Text>
            </TouchableOpacity>
          </View>
      </View>
      
    </ScrollView>
  );
};

export default Info_Html;