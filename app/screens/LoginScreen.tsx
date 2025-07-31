import { useEmailAuth } from "@/hooks/useEmailAuth";
import React, { useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";

type LoginScreenProps = {
  navigation: any;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");

  // Estados para modal de alerta
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"error" | "success" | "warning">("warning");

  // Estado para modal éxito
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const { login } = useEmailAuth();

  const showAlert = (message: string, type: "error" | "success" | "warning") => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleLogin = async () => {
    if (!usuario || !contrasena) {
      showAlert("Por favor ingresa usuario y contraseña.", "warning");
      return;
    }

    const result = await login(usuario, contrasena);

    if (result.error) {
      showAlert(result.error, "error");
    } else {
      setUserEmail(result.user?.email || "");
      setSuccessModalVisible(true);
      setTimeout(() => {
        setSuccessModalVisible(false);
        navigation.navigate("Niveles");
      }, 2000); // Modal visible 2 segundos
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("./logo-pixly.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Bienvenido</Text>

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

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.navigateText}>
          ¿No tienes cuenta? Regístrate aquí
        </Text>
      </TouchableOpacity>

      {/* Modal para alertas (error, warning) */}
      <Modal visible={alertVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animatable.View
            animation="fadeInDown"
            duration={600}
            style={[
              styles.alertBox,
              alertType === "error" && styles.alertError,
              alertType === "warning" && styles.alertWarning,
              alertType === "success" && styles.alertSuccess,
            ]}
          >
            <Text style={styles.alertMessage}>{alertMessage}</Text>
            <TouchableOpacity
              onPress={() => setAlertVisible(false)}
              style={styles.alertButton}
            >
              <Text style={styles.alertButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>

      {/* Modal para éxito */}
      <Modal visible={successModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animatable.View
            animation="bounceIn"
            duration={800}
            style={styles.successModalContent}
          >
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successText}>¡Inicio exitoso!</Text>
            <Text style={styles.successSubText}>Bienvenido {userEmail}</Text>
          </Animatable.View>
        </View>
      </Modal>
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

  /* Alert Modal styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    width: "80%",
    alignItems: "center",
    elevation: 10,
  },
  alertMessage: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  alertButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  alertButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  alertError: {
    borderWidth: 2,
    borderColor: "#FF4C4C",
  },
  alertWarning: {
    borderWidth: 2,
    borderColor: "#FFB800",
  },
  alertSuccess: {
    borderWidth: 2,
    borderColor: "#28A745",
  },

  /* Success modal styles */
  successModalContent: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    elevation: 10,
    width: "80%",
  },
  successIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  successText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#28A745",
  },
  successSubText: {
    marginTop: 10,
    fontSize: 18,
    color: "#333",
  },
});
