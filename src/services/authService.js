import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { MOCK_USER } from '../utils/sampleData';

export const authService = {
  /**
   * Inicia sesión con Google o simula inicio en Modo Demo
   */
  async loginWithGoogle() {
    if (isFirebaseConfigured && auth && googleProvider) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        return {
          uid: result.user.uid,
          name: result.user.displayName || 'Kitty Owen',
          email: result.user.email,
          photoURL: result.user.photoURL
        };
      } catch (error) {
        console.error('Error en autenticación Firebase:', error);
        throw error;
      }
    } else {
      // Modo Demo / Mock Auth
      localStorage.setItem('studio_mock_session', JSON.stringify(MOCK_USER));
      return MOCK_USER;
    }
  },

  /**
   * Cierra la sesión activa
   */
  async logout() {
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth);
    } else {
      localStorage.removeItem('studio_mock_session');
    }
  },

  /**
   * Escucha cambios en la sesión de usuario
   */
  subscribeToAuthChanges(callback) {
    if (isFirebaseConfigured && auth) {
      return onAuthStateChanged(auth, (user) => {
        if (user) {
          callback({
            uid: user.uid,
            name: user.displayName || 'Kitty Owen',
            email: user.email,
            photoURL: user.photoURL
          });
        } else {
          callback(null);
        }
      });
    } else {
      // Verificar si hay sesión en localStorage para Modo Demo
      const stored = localStorage.getItem('studio_mock_session');
      if (stored) {
        try {
          callback(JSON.parse(stored));
        } catch (e) {
          callback(null);
        }
      } else {
        callback(null);
      }
      // Retornar función dummy de unsubscribe
      return () => {};
    }
  }
};
