import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';

export default function LoginScreen() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleLogin = () => {
    // Aquí puedes agregar la lógica de autenticación
    console.log('Usuario:', usuario);
    console.log('Contraseña:', contrasena);
  };

  return (
    <View style={styles.container}>

      {/* Imagen del gatito (puedes cambiar la ruta y la imagen) */}
      <Image
        source={require('./logo-pixly.png')} // Cambia esto por la ruta correcta de tu imagen
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Inputs de Usuario y Contraseña */}
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        placeholderTextColor="#555"
        value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#555"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />

      {/* Botón de Iniciar sesión */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      {/* Separador con "o" */}
      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>o</Text>
        <View style={styles.separatorLine} />
      </View>

      {/* Botones de autenticación */}
      <TouchableOpacity style={styles.authButton}>
        <Text style={styles.authText}><Text style={{ fontWeight: 'bold' }}>G</Text> Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.authButton}>
        <Text style={styles.authText}><Text style={{ fontWeight: 'bold' }}>f</Text> Facebook</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#ddd',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
  loginButton: {
    backgroundColor: '#005BBB',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  authButton: {
    backgroundColor: '#ddd',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
  },
  authText: {
    fontSize: 16,
    color: '#000',
  },
});
