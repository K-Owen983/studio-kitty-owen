import { db, isFirebaseConfigured } from '../firebase/config';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { INITIAL_PUBLICATIONS } from '../utils/sampleData';

const COLLECTION_NAME = 'publications';
const AUTOSAVE_STORAGE_KEY = 'studio_autosaved_draft';

// Helper para obtener datos desde LocalStorage en Modo Demo
function getLocalPublications() {
  const stored = localStorage.getItem('studio_mock_publications');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return INITIAL_PUBLICATIONS;
    }
  }
  localStorage.setItem('studio_mock_publications', JSON.stringify(INITIAL_PUBLICATIONS));
  return INITIAL_PUBLICATIONS;
}

function saveLocalPublications(pubs) {
  localStorage.setItem('studio_mock_publications', JSON.stringify(pubs));
}

export const publicationService = {
  /**
   * Obtiene la lista completa de publicaciones
   */
  async getPublications() {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('updatedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const publications = [];
        querySnapshot.forEach((doc) => {
          publications.push({ id: doc.id, ...doc.data() });
        });
        return publications;
      } catch (error) {
        console.error('Error al obtener publicaciones de Firestore:', error);
        throw error;
      }
    } else {
      return getLocalPublications();
    }
  },

  /**
   * Obtiene una publicación por su ID
   */
  async getPublicationById(id) {
    if (!id) return null;
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } else {
      const pubs = getLocalPublications();
      return pubs.find((p) => p.id === id) || null;
    }
  },

  /**
   * Guarda o actualiza una publicación (Borrador o Publicado)
   */
  async savePublication(publicationData) {
    const id = publicationData.id || `pub_${Date.now()}`;
    const timestamp = new Date().toISOString();

    const payload = {
      ...publicationData,
      id,
      updatedAt: timestamp,
      createdAt: publicationData.createdAt || timestamp
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await setDoc(docRef, {
          ...payload,
          updatedAt: serverTimestamp(),
          createdAt: publicationData.createdAt || serverTimestamp()
        }, { merge: true });
        return payload;
      } catch (error) {
        console.error('Error al guardar en Firestore:', error);
        throw error;
      }
    } else {
      const pubs = getLocalPublications();
      const index = pubs.findIndex((p) => p.id === id);
      if (index >= 0) {
        pubs[index] = payload;
      } else {
        pubs.unshift(payload);
      }
      saveLocalPublications(pubs);
      return payload;
    }
  },

  /**
   * Elimina una publicación
   */
  async deletePublication(id) {
    if (!id) return;
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } else {
      const pubs = getLocalPublications();
      const filtered = pubs.filter((p) => p.id !== id);
      saveLocalPublications(filtered);
    }
  },

  // =========================================================================
  // GESTIÓN DE AUTOGUARDADO (AUTOSAVE DRAFT RECOVERY)
  // =========================================================================

  /**
   * Guarda el borrador temporal autoguardado (AutoSave silencioso)
   */
  async saveAutosavedDraft(draftData) {
    const payload = {
      ...draftData,
      autosavedAt: new Date().toISOString()
    };
    localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify(payload));
  },

  /**
   * Obtiene el borrador autoguardado si existe
   */
  async getAutosavedDraft() {
    const stored = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  },

  /**
   * Descarta y limpia el borrador autoguardado
   */
  async clearAutosavedDraft() {
    localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
  }
};
