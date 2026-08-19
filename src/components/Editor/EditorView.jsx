import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import KittyImage from './KittyImage';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import CodeBlock from '@tiptap/extension-code-block';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import FixedToolbar from './FixedToolbar';
import CoverUploader from './CoverUploader';
import AutoSaveIndicator from './AutoSaveIndicator';
import LivePreviewModal from '../Preview/LivePreviewModal';
import { usePublications } from '../../context/PublicationContext';
import { calculateReadingTime, generateSlug, extractExcerpt } from '../../utils/textHelpers';

export default function EditorView() {
  const {
    currentPublication,
    openDashboard,
    saveDraft,
    publish,
    uploadCoverImage,
    autoSaveDraft
  } = usePublications();

  // Estados locales del formulario
  const [title, setTitle] = useState(currentPublication?.title || '');
  const [subtitle, setSubtitle] = useState(currentPublication?.subtitle || '');
  const [type, setType] = useState(currentPublication?.type || 'Nota Estratégica');
  const [category, setCategory] = useState(currentPublication?.category || 'Liderazgo');
  const [coverImage, setCoverImage] = useState(currentPublication?.coverImage || null);
  const [featured, setFeatured] = useState(currentPublication?.featured || false);
  const [visibility, setVisibility] = useState(currentPublication?.visibility || 'public');

  // Estados de control de edición y autoguardado
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(currentPublication?.updatedAt || null);
  const [showPreview, setShowPreview] = useState(false);

  // Inicialización de TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      KittyImage,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlock,
      Placeholder.configure({
        placeholder: 'Escribe tu nota, ensayo o artículo aquí...'
      })
    ],
    content: currentPublication?.contentJson || currentPublication?.contentHtml || '',
    onUpdate: () => {
      setIsDirty(true);
    }
  });

  // Construir payload actual de la publicación
  const buildPublicationPayload = useCallback(() => {
    const contentHtml = editor ? editor.getHTML() : '';
    const contentJson = editor ? editor.getJSON() : null;
    const textContent = editor ? editor.getText() : '';

    return {
      ...currentPublication,
      id: currentPublication?.id || null,
      title: title.trim(),
      subtitle: subtitle.trim(),
      excerpt: extractExcerpt(textContent || subtitle),
      contentJson,
      contentHtml,
      coverImage,
      type,
      category,
      tags: [type, category],
      slug: generateSlug(title || 'sin-titulo'),
      status: currentPublication?.status || 'draft',
      featured,
      visibility,
      readingTime: calculateReadingTime(textContent),
      seo: {
        metaTitle: title ? `${title} | Kitty Owen` : '',
        metaDescription: subtitle || extractExcerpt(textContent)
      }
    };
  }, [currentPublication, title, subtitle, coverImage, type, category, featured, visibility, editor]);

  // AUTOGUARDADO CADA 30 SEGUNDOS (AutoSave)
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isDirty && editor && !isSaving) {
        setIsAutoSaving(true);
        try {
          const payload = buildPublicationPayload();
          await autoSaveDraft(payload);
          setIsDirty(false);
          setLastSavedAt(new Date().toISOString());
        } catch (err) {
          console.error('Error en autoguardado:', err);
        } finally {
          setIsAutoSaving(false);
        }
      }
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [isDirty, editor, isSaving, autoSaveDraft, buildPublicationPayload]);

  // Guardar borrador manual
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const payload = buildPublicationPayload();
      await saveDraft(payload);
      setIsDirty(false);
      setLastSavedAt(new Date().toISOString());
      alert('Borrador guardado exitosamente.');
    } catch (err) {
      alert('Error al guardar borrador: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Publicar oficialmente
  const handlePublish = async () => {
    if (!title.trim()) {
      alert('Por favor ingresa un título para la publicación.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = buildPublicationPayload();
      await publish(payload);
      setIsDirty(false);
      alert('¡Publicación realizada con éxito!');
      openDashboard();
    } catch (err) {
      alert('Error al publicar: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Calcular conteo de palabras para la footer-bar
  const wordCount = editor ? editor.getText().split(/\s+/).filter(Boolean).length : 0;
  const readingTimeMin = calculateReadingTime(editor ? editor.getText() : '');

  return (
    <div className="app-container" style={{ background: 'var(--bg-app)' }}>
      {/* BARRA DE HERRAMIENTAS FIXA SUPERIOR */}
      <FixedToolbar
        editor={editor}
        onBack={openDashboard}
        onPreview={() => setShowPreview(true)}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        isSaving={isSaving}
        status={currentPublication?.status}
      />

      {/* ÁREA DE TRABAJO EN HOJA BLANCA */}
      <div className="editor-wrapper">
        <main className="paper-sheet">
          {/* SECCIÓN DE METADATA E INPUTS INLINE */}
          <div className="document-meta-section">
            <div className="meta-row-selects">
              <div className="meta-field">
                <label>Tipo de Publicación</label>
                <select value={type} onChange={(e) => { setType(e.target.value); setIsDirty(true); }}>
                  <option value="Nota Estratégica">Nota Estratégica</option>
                  <option value="Ensayo">Ensayo</option>
                  <option value="Artículo">Artículo</option>
                  <option value="Conferencia">Conferencia</option>
                  <option value="Documento">Documento</option>
                  <option value="Recurso">Recurso</option>
                </select>
              </div>

              <div className="meta-field">
                <label>Categoría Editorial</label>
                <select value={category} onChange={(e) => { setCategory(e.target.value); setIsDirty(true); }}>
                  <option value="Comunicación">Comunicación</option>
                  <option value="Liderazgo">Liderazgo</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Ciencia de Datos">Ciencia de Datos</option>
                  <option value="Estrategia">Estrategia</option>
                </select>
              </div>
            </div>

            {/* INPUT DE TÍTULO PRINCIPAL SIN BORDES */}
            <input
              type="text"
              className="title-input"
              placeholder="Título de la publicación..."
              value={title}
              onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
            />

            {/* INPUT DE SUBTÍTULO O BAJADA */}
            <input
              type="text"
              className="subtitle-input"
              placeholder="Escribe una bajada o subtítulo explícito..."
              value={subtitle}
              onChange={(e) => { setSubtitle(e.target.value); setIsDirty(true); }}
            />

            {/* UPLOADER DE PORTADA */}
            <CoverUploader
              coverImage={coverImage}
              onUpload={async (fileOrObject) => {
                if (fileOrObject.url) {
                  setCoverImage(fileOrObject);
                  setIsDirty(true);
                } else {
                  const uploaded = await uploadCoverImage(fileOrObject);
                  setCoverImage(uploaded);
                  setIsDirty(true);
                }
              }}
              onRemove={() => { setCoverImage(null); setIsDirty(true); }}
            />
          </div>

          {/* EDITOR DE TEXTO RICO (TIPTAP CANVAS) */}
          <EditorContent editor={editor} />

          {/* PIE DE HOJA: ESTADÍSTICAS Y AUTOGUARDADO */}
          <div className="editor-footer-stats">
            <div>
              <span>{wordCount} palabras</span>
              <span style={{ margin: '0 0.5rem' }}>•</span>
              <span>{readingTimeMin} min de lectura</span>
            </div>

            <AutoSaveIndicator
              isDirty={isDirty}
              isAutoSaving={isAutoSaving}
              lastSavedAt={lastSavedAt}
            />
          </div>
        </main>
      </div>

      {/* MODAL VISTA PREVIA EN TIEMPO REAL */}
      {showPreview && (
        <LivePreviewModal
          publication={buildPublicationPayload()}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
