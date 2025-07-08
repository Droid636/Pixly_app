import { auth } from "@/scripts/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export function useRegister() {
  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  return { register };
}
