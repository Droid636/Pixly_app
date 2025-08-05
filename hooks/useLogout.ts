import { auth } from '@/scripts/firebase'; // tu instancia de firebase auth
import { signOut } from 'firebase/auth';

export const useLogout = () => {
  const logout = async () => {
    try {
      await signOut(auth);
      console.log('Cierre de sesión exitoso');  // <-- Mensaje en consola
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Error desconocido' };
    }
  };

  return logout;
};
