import { auth } from "@/scripts/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export const useEmailAuth = () => {
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Login exitoso:", userCredential.user.email);
      return { user: userCredential.user };
    } catch (error: any) {
      console.error("❌ Error al iniciar sesión:", error.message);
      return { error: error.message };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ Registro exitoso:", userCredential.user.email);
      return { user: userCredential.user };
    } catch (error: any) {
      console.error("❌ Error al registrar:", error.message);
      return { error: error.message };
    }
  };

  return { login, register };
};
