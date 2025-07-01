import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla de Login</Text>
      <Text style={styles.subtitle}>Aquí colocarás tu autenticación personalizada</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, marginBottom: 20 },
  subtitle: { fontSize: 16, color: '#666' }
});
