import React from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3,Pencil,
  List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon,
  Table as TableIcon, Code, Undo, Redo, Eye, Save, Send, ArrowLeft
} from 'lucide-react';
import ImageConfigModal from './ImageConfigModal';

export default function FixedToolbar({
  editor,
  onBack,
  onPreview,
  onSaveDraft,
  onPublish,
  isSaving,
  status
}) {
  if (!editor) return null;
  const [imageConfig, setImageConfig] = React.useState(null);
  const addLink = () => {
  const previousUrl = editor.getAttributes('link').href || '';
  const inputUrl = window.prompt('Ingresa la URL del enlace:', previousUrl);

  if (inputUrl === null) return;

  const url = inputUrl.trim();

  if (url === '') {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }

  const normalizedUrl = /^https?:\/\//i.test(url)
    ? url
    : `https://${url}`;

  editor
    .chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: normalizedUrl })
    .run();
};

  const addImage = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  input.onchange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
  setImageConfig({
    src: reader.result,
    fileName: file.name
  });
};

    reader.readAsDataURL(file);
  };

  input.click();
};
const insertTable = () => {
  editor
    .chain()
    .focus()
    .insertTable({
      rows: 3,
      cols: 3,
      withHeaderRow: true
    })
    .run();
};

const editImage = () => {
  const { selection } = editor.state;
  const node = selection.node;

  if (!node || node.type.name !== 'image') {
    return;
  }

  setImageConfig({
    src: node.attrs.src,
    fileName: node.attrs.fileName || '',
    title: node.attrs.title || '',
    caption: node.attrs.caption || '',
    altText: node.attrs.alt || '',
    size: node.attrs.size || 'medium',
    alignment: node.attrs.alignment || 'center',
    titleAlignment: node.attrs.titleAlignment || 'center',
    captionAlignment: node.attrs.captionAlignment || 'center',
    isEditing: true,
    position: selection.from,
  });
};
 return (
  <>
    <div className="fixed-editor-toolbar">
      {/* SECCIÓN IZQUIERDA: BOTÓN VOLVER Y EDICIÓN DE FORMATO */}
      <div className="toolbar-group">
        <button onClick={onBack} className="btn-icon" title="Volver al Dashboard">
          <ArrowLeft size={18} />
        </button>
        
        <div className="toolbar-divider" />

        {/* FORMATOS BÁSICOS */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`tb-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
          title="Negrita (Ctrl+B)"
        >
          <Bold size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`tb-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
          title="Cursiva (Ctrl+I)"
        >
          <Italic size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`tb-btn ${editor.isActive('underline') ? 'is-active' : ''}`}
          title="Subrayado (Ctrl+U)"
        >
          <UnderlineIcon size={16} />
        </button>

        <div className="toolbar-divider" />

        {/* ENCABEZADOS */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`tb-btn ${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`}
          title="Título H1"
        >
          <Heading1 size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`tb-btn ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
          title="Título H2"
        >
          <Heading2 size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`tb-btn ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`}
          title="Título H3"
        >
          <Heading3 size={16} />
        </button>

        <div className="toolbar-divider" />

        {/* LISTAS Y BLOQUES */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`tb-btn ${editor.isActive('bulletList') ? 'is-active' : ''}`}
          title="Lista con viñetas"
        >
          <List size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`tb-btn ${editor.isActive('orderedList') ? 'is-active' : ''}`}
          title="Lista numerada"
        >
          <ListOrdered size={16} />
        </button>
        <button
  onMouseDown={(e) => e.preventDefault()}
  onClick={editImage}
  className="tb-btn"
  title="Editar imagen"
>
  <Pencil size={16} />
</button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`tb-btn ${editor.isActive('blockquote') ? 'is-active' : ''}`}
          title="Cita de bloque"
        >
          <Quote size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`tb-btn ${editor.isActive('codeBlock') ? 'is-active' : ''}`}
          title="Bloque de código"
        >
          <Code size={16} />
        </button>

        <div className="toolbar-divider" />

        {/* INSERTAR ELEMENTOS */}
        <button onClick={addLink} className={`tb-btn ${editor.isActive('link') ? 'is-active' : ''}`} title="Enlace">
          <LinkIcon size={16} />
        </button>

        <button onClick={addImage} className="tb-btn" title="Insertar Imagen por URL">
          <ImageIcon size={16} />
        </button>

        <button onClick={insertTable} className="tb-btn" title="Insertar Tabla">
          <TableIcon size={16} />
        </button>

        <div className="toolbar-divider" />

        {/* DESHACER / REHACER */}
        <button onClick={() => editor.chain().focus().undo().run()} className="tb-btn" title="Deshacer (Ctrl+Z)">
          <Undo size={16} />
        </button>

        <button onClick={() => editor.chain().focus().redo().run()} className="tb-btn" title="Rehacer (Ctrl+Y)">
          <Redo size={16} />
        </button>
      </div>

      {/* SECCIÓN DERECHA: ACCIONES DEL DOCUMENTO */}
      <div className="toolbar-group">
        <button onClick={onPreview} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
          <Eye size={15} /> Vista Previa
        </button>

        <button onClick={onSaveDraft} disabled={isSaving} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
          <Save size={15} /> Guardar Borrador
        </button>

        <button onClick={onPublish} disabled={isSaving} className="btn btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
          <Send size={15} /> Publicar
        </button>
      </div>
             </div>
              {imageConfig && (
        <ImageConfigModal
          imageSrc={imageConfig.src}
          
          onCancel={() => setImageConfig(null)}
          onInsert={(config) => {
  if (imageConfig.isEditing && imageConfig.position !== undefined) {
    editor
      .chain()
      .focus()
      .command(({ tr }) => {
        tr.setNodeMarkup(imageConfig.position, undefined, {
  src: config.src,
          alt: config.altText,
          title: config.title,
          caption: config.caption,
          size: config.size,
          alignment: config.alignment,
          titleAlignment: config.titleAlignment,
          captionAlignment: config.captionAlignment,
        });

        return true;
      })
      .run();
  } else {
    editor
      .chain()
      .focus()
      .setImage({
  src: imageConfig.src,
        alt: config.altText,
        title: config.title,
        caption: config.caption,
        size: config.size,
        alignment: config.alignment,
        titleAlignment: config.titleAlignment,
        captionAlignment: config.captionAlignment,
      })
      .run();
  }

  setImageConfig(null);
}}
          />
      )}

    </>
  );
}