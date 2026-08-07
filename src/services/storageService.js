import { storage, isFirebaseConfigured } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const storageService = {
  /**
   * Sube una imagen de portada y retorna la URL pública
   */
  async uploadCoverImage(file) {
    if (!file) return null;

    if (isFirebaseConfigured && storage) {
      try {
        const fileExt = file.name.split('.').pop();
        const filename = `cover_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const storageRef = ref(storage, `covers/${filename}`);

        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        return {
          url: downloadURL,
          path: snapshot.ref.fullPath,
          alt: file.name
        };
      } catch (error) {
        console.error('Error al subir imagen a Firebase Storage:', error);
        throw error;
      }
    } else {
      // Modo Demo: Convertir archivo a Data URL Base64 para almacenamiento local inmediato
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            url: e.target.result,
            path: `mock_covers/${file.name}`,
            alt: file.name
          });
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
    }
  }
};
