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

// =========================================================================
// ALMACENAMIENTO LOCAL EN INDEXEDDB — MODO DEMO
// =========================================================================

const LOCAL_DB_NAME = 'studio_kitty_owen';
const LOCAL_DB_VERSION = 1;
const LOCAL_STORE_NAME = 'publications';

function openLocalDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(LOCAL_DB_NAME, LOCAL_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(LOCAL_STORE_NAME)) {
        db.createObjectStore(LOCAL_STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Obtiene todas las publicaciones locales
async function getLocalPublications() {
  const db = await openLocalDB();

  const publications = await new Promise((resolve, reject) => {
    const transaction = db.transaction(LOCAL_STORE_NAME, 'readonly');
    const store = transaction.objectStore(LOCAL_STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  db.close();

  // Si IndexedDB está vacío, intentamos recuperar
  // las publicaciones que ya teníamos en LocalStorage.
  if (publications.length === 0) {
    const legacy = localStorage.getItem('studio_mock_publications');

    if (legacy) {
      try {
        const oldPublications = JSON.parse(legacy);

        const saveTransaction = await openLocalDB();

        await new Promise((resolve, reject) => {
          const transaction = saveTransaction.transaction(
            LOCAL_STORE_NAME,
            'readwrite'
          );

          const store = transaction.objectStore(LOCAL_STORE_NAME);

          oldPublications.forEach((publication) => {
            store.put(publication);
          });

          transaction.oncomplete = resolve;
          transaction.onerror = () => reject(transaction.error);
        });

        saveTransaction.close();

        // Ya fueron migradas. Podemos eliminar la copia antigua.
        localStorage.removeItem('studio_mock_publications');

        return oldPublications;
      } catch (error) {
        console.warn('No se pudieron migrar las publicaciones antiguas:', error);
      }
    }

    // Si no había publicaciones anteriores, cargamos las iniciales.
    if (INITIAL_PUBLICATIONS.length > 0) {
      const initialDB = await openLocalDB();

      await new Promise((resolve, reject) => {
        const transaction = initialDB.transaction(
          LOCAL_STORE_NAME,
          'readwrite'
        );

        const store = transaction.objectStore(LOCAL_STORE_NAME);

        INITIAL_PUBLICATIONS.forEach((publication) => {
          store.put(publication);
        });

        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
      });

      initialDB.close();

      return INITIAL_PUBLICATIONS;
    }
  }

  return publications;
}

// Guarda todas las publicaciones locales en IndexedDB
async function saveLocalPublications(pubs) {
  const db = await openLocalDB();

  await new Promise((resolve, reject) => {
    const transaction = db.transaction(
      LOCAL_STORE_NAME,
      'readwrite'
    );

    const store = transaction.objectStore(LOCAL_STORE_NAME);

    store.clear();

    pubs.forEach((publication) => {
      store.put(publication);
    });

    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });

  db.close();
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
      return await getLocalPublications();
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
