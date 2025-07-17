import { useEmailAuth } from "@/hooks/useEmailAuth";
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
import SocialButton from "../../components/SocialButton";

type LoginScreenProps = {
  navigation: any; 
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");

  const { login } = useEmailAuth();

  const handleLogin = async () => {
    if (!usuario || !contrasena) {
      Alert.alert("Campos vacíos", "Por favor ingresa usuario y contraseña.");
      return;
    }

    const result = await login(usuario, contrasena);

    if (result.error) {
      Alert.alert("Error", result.error);
    } else {
      Alert.alert("Bienvenido", `Sesión iniciada como ${result.user?.email}`);
      // Aquí puedes navegar a otra pantalla o guardar el estado global
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("./logo-pixly.png")}
        style={styles.logo}
        resizeMode="contain"
      />

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

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      {/* Botón para ir a Registro */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.navigateText}>
          ¿No tienes cuenta? Regístrate aquí
        </Text>
      </TouchableOpacity>

      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>o</Text>
        <View style={styles.separatorLine} />
      </View>

      <SocialButton
        text="Iniciar con Google"
        backgroundColor="#fff"
        textColor="#000"
        iconLetter="G"
        onPress={() => console.log("Google auth aquí")}
      />

      <SocialButton
        text="Iniciar con Facebook"
        backgroundColor="#3b5998"
        iconLetter="f"
        onPress={() => console.log("Facebook auth aquí")}
      />
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
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
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
