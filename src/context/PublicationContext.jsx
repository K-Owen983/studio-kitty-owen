import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { publicationService } from '../services/publicationService';
import { storageService } from '../services/storageService';
import { useAuth } from './AuthContext';

const PublicationContext = createContext();

export function PublicationProvider({ children }) {
  const { currentUser } = useAuth();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'editor'
  
  // Publicación actual en edición
  const [currentPublication, setCurrentPublication] = useState(null);
  
  // Estado para la recuperación de borrador autoguardado
  const [autosavedDraft, setAutosavedDraft] = useState(null);

  // Cargar publicaciones al inicio
  const loadPublications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await publicationService.getPublications();
      setPublications(data);
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadPublications();
      // Verificar si existe un borrador autoguardado previo
      publicationService.getAutosavedDraft().then((draft) => {
        if (draft) {
          setAutosavedDraft(draft);
        }
      });
    }
  }, [currentUser, loadPublications]);

  // Abrir editor con una nueva publicación vacía
  const createNewPublication = () => {
    const newPub = {
      id: null,
      title: '',
      subtitle: '',
      excerpt: '',
      contentJson: null,
      contentHtml: '',
      coverImage: null,
      type: 'Nota Estratégica',
      category: 'Liderazgo',
      tags: [],
      slug: '',
      status: 'draft',
      featured: false,
      visibility: 'public',
      readingTime: 1,
      author: {
        name: currentUser?.name || 'Kitty Owen',
        email: currentUser?.email || 'kitty@kittyowen.com',
        photoURL: currentUser?.photoURL || ''
      },
      seo: {
        metaTitle: '',
        metaDescription: ''
      }
    };
    setCurrentPublication(newPub);
    setView('editor');
  };

  // Abrir editor para editar una publicación existente
  const editPublication = (pub) => {
    setCurrentPublication(pub);
    setView('editor');
  };

  // Volver al Dashboard
  const openDashboard = () => {
    setView('dashboard');
    setCurrentPublication(null);
    loadPublications();
  };

  // Guardar Borrador (Acción manual)
  const saveDraft = async (pubData) => {
    const payload = {
      ...pubData,
      status: 'draft',
      author: {
        name: currentUser?.name || 'Kitty Owen',
        email: currentUser?.email || 'kitty@kittyowen.com',
        photoURL: currentUser?.photoURL || ''
      }
    };
    const saved = await publicationService.savePublication(payload);
    await publicationService.clearAutosavedDraft();
    setAutosavedDraft(null);
    setCurrentPublication(saved);
    await loadPublications();
    return saved;
  };

  // Publicar oficialmente
  const publish = async (pubData) => {
    const payload = {
      ...pubData,
      status: 'published',
      publishedAt: pubData.publishedAt || new Date().toISOString(),
      author: {
        name: currentUser?.name || 'Kitty Owen',
        email: currentUser?.email || 'kitty@kittyowen.com',
        photoURL: currentUser?.photoURL || ''
      }
    };
    const published = await publicationService.savePublication(payload);
    await publicationService.clearAutosavedDraft();
    setAutosavedDraft(null);
    setCurrentPublication(published);
    await loadPublications();
    return published;
  };

  // Eliminar publicación
  const deletePublication = async (id) => {
    await publicationService.deletePublication(id);
    await loadPublications();
  };

  // Subir imagen de portada
  const uploadCoverImage = async (file) => {
    return await storageService.uploadCoverImage(file);
  };

  // Autoguardado silencioso a los 30s
  const autoSaveDraft = async (pubData) => {
    await publicationService.saveAutosavedDraft(pubData);
  };

  // Recuperar borrador autoguardado
  const restoreAutosavedDraft = () => {
    if (autosavedDraft) {
      setCurrentPublication(autosavedDraft);
      setView('editor');
      setAutosavedDraft(null);
    }
  };

  // Descartar borrador autoguardado
  const discardAutosavedDraft = async () => {
    await publicationService.clearAutosavedDraft();
    setAutosavedDraft(null);
  };

  const value = {
    publications,
    loading,
    view,
    currentPublication,
    autosavedDraft,
    createNewPublication,
    editPublication,
    openDashboard,
    saveDraft,
    publish,
    deletePublication,
    uploadCoverImage,
    autoSaveDraft,
    restoreAutosavedDraft,
    discardAutosavedDraft
  };

  return (
    <PublicationContext.Provider value={value}>
      {children}
    </PublicationContext.Provider>
  );
}

export function usePublications() {
  const context = useContext(PublicationContext);
  if (!context) {
    throw new Error('usePublications debe ser usado dentro de un PublicationProvider');
  }
  return context;
}
