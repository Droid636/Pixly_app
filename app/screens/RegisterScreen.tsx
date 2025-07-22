import { useRegister } from "@/hooks/useRegisterAuth";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type RegisterScreenProps = {
  navigation: any; // puedes tipar mejor si quieres
};

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");

  const { register } = useRegister();

  const handleRegister = async () => {
    if (!usuario || !contrasena) {
      Alert.alert("Campos vacíos", "Por favor ingresa usuario y contraseña.");
      return;
    }

    const result = await register(usuario, contrasena);

    if (result.error) {
      Alert.alert("Error", result.error);
    } else {
      Alert.alert("Registro exitoso", `Bienvenido ${result.user?.email}`);
      // Aquí luego puedes navegar o limpiar campos si quieres
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("./logo-pixly.png")}
        style={styles.logo}
        resizeMode="contain"
      />
       <Text style={styles.title}>
          Registro
        </Text>
      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
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

      {/* Botón de Registrar */}
      <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
        <Text style={styles.loginButtonText}>Registrarme</Text>
      </TouchableOpacity>

      {/* Botón para volver a Login */}
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.navigateText}>
          ¿Ya tienes cuenta? Inicia sesión aquí
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  title: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 3,
  },
  input: {
    backgroundColor: "#ddd",
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 15,
    fontSize: 16,
    color: "#000",
  },
  loginButton: {
    backgroundColor: "#005BBB",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  navigateText: {
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  separatorText: {
    marginHorizontal: 10,
    color: "#fff",
    fontWeight: "bold",
  },
});
