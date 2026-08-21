import React from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3,Pencil,
  List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon,
  Table as TableIcon, Code, Undo, Redo, Eye, Save, Send, Download, ArrowLeft,
  AlignLeft, AlignCenter, AlignRight, AlignJustify
} from 'lucide-react';
import ImageConfigModal from './ImageConfigModal';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import html2pdf from 'html2pdf.js';

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
  const [showDownloadMenu, setShowDownloadMenu] = React.useState(false);
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

const onDownloadWord = async () => {
  const html = editor.getHTML();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const paragraphs = [];

  doc.body.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
if (
  node.tagName.toLowerCase() === 'img' ||
  node.querySelector('img')
) {
  return;
}
      const text = node.textContent.trim();

      if (text) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text,
              }),
            ],
          })
        );
      }

      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const text = node.textContent.trim();

    if (!text) return;

    const tag = node.tagName.toLowerCase();

    if (tag === 'h1') {
      paragraphs.push(
        new Paragraph({
          heading: 'Heading1',
          children: [new TextRun(text)],
        })
      );
    } else if (tag === 'h2') {
      paragraphs.push(
        new Paragraph({
          heading: 'Heading2',
          children: [new TextRun(text)],
        })
      );
    } else if (tag === 'h3') {
      paragraphs.push(
        new Paragraph({
          heading: 'Heading3',
          children: [new TextRun(text)],
        })
      );
    } else {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun(text)],
        })
      );
    }
  });

  const wordDocument = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(wordDocument);

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = 'publicacion.docx';

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};

const onDownloadPdf = async () => {
  const editorElement = editor.view.dom;

  const pdfContainer = document.createElement('div');

  pdfContainer.innerHTML = editorElement.innerHTML;

  const images = pdfContainer.querySelectorAll('img');

images.forEach((img) => {
  img.style.maxWidth = '100%';
  img.style.height = 'auto';
  img.style.display = 'block';
});

const elements = pdfContainer.querySelectorAll('*');

elements.forEach((element) => {
  element.style.maxWidth = '100%';
  element.style.boxSizing = 'border-box';
  element.style.whiteSpace = 'normal';
  element.style.overflowWrap = 'break-word';
});

  pdfContainer.style.width = '794px';
  pdfContainer.style.padding = '40px';
  pdfContainer.style.background = '#ffffff';
  pdfContainer.style.boxSizing = 'border-box';
  pdfContainer.style.color = '#111111';
  pdfContainer.style.fontFamily = 'Arial, sans-serif';

  document.body.appendChild(pdfContainer);

  const options = {
    margin: 0,
    filename: 'publicacion.pdf',
    image: {
      type: 'jpeg',
      quality: 0.98,
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    },
    jsPDF: {
      unit: 'px',
      format: 'a4',
      orientation: 'portrait',
    },
    pagebreak: {
      mode: ['css', 'legacy'],
    },
  };

  await html2pdf()
    .set(options)
    .from(pdfContainer)
    .save();

  pdfContainer.remove();
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
    <div className="document-actions-toolbar">
  <div className="toolbar-group">
    <button
      onClick={onPreview}
      className="btn btn-secondary"
      style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
    >
      <Eye size={15} /> Vista Previa
    </button>

    <button
      onClick={onSaveDraft}
      disabled={isSaving}
      className="btn btn-secondary"
      style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
    >
      <Save size={15} /> Guardar Borrador
    </button>

    <div style={{ position: 'relative' }}>
  <button
    onClick={() => setShowDownloadMenu(!showDownloadMenu)}
    className="btn btn-secondary"
    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
  >
    <Download size={15} /> Descargar
  </button>

  {showDownloadMenu && (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 0.4rem)',
        left: 0,
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        padding: '0.35rem',
        zIndex: 200,
        minWidth: '130px'
      }}
    >
      <button
        onClick={() => {
          setShowDownloadMenu(false);
          onDownloadWord();
        }}
        style={{
          display: 'block',
          width: '100%',
          padding: '0.5rem 0.7rem',
          border: 'none',
          background: 'transparent',
          textAlign: 'left',
          cursor: 'pointer',
          borderRadius: '5px'
        }}
      >
        📝 Word
      </button>

      <button
        onClick={() => {
          setShowDownloadMenu(false);
          onDownloadPdf();
        }}
        style={{
          display: 'block',
          width: '100%',
          padding: '0.5rem 0.7rem',
          border: 'none',
          background: 'transparent',
          textAlign: 'left',
          cursor: 'pointer',
          borderRadius: '5px'
        }}
      >
        📄 PDF
      </button>
    </div>
  )}
</div>

    <button
      onClick={onPublish}
      disabled={isSaving}
      className="btn btn-primary"
      style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
    >
      <Send size={15} /> Publicar
    </button>
  </div>
</div>
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
{/* ALINEACIÓN DE TEXTO */}
<button
  onClick={() => editor.chain().focus().setTextAlign('left').run()}
  className={`tb-btn ${editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}`}
  title="Alinear a la izquierda"
>
  <AlignLeft size={16} />
</button>

<button
  onClick={() => editor.chain().focus().setTextAlign('center').run()}
  className={`tb-btn ${editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}`}
  title="Centrar"
>
  <AlignCenter size={16} />
</button>

<button
  onClick={() => editor.chain().focus().setTextAlign('right').run()}
  className={`tb-btn ${editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}`}
  title="Alinear a la derecha"
>
  <AlignRight size={16} />
</button>

<button
  onClick={() => editor.chain().focus().setTextAlign('justify').run()}
  className={`tb-btn ${editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}`}
  title="Justificar"
>
  <AlignJustify size={16} />
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

                   </div>
              {imageConfig && (
        <ImageConfigModal
          imageSrc={imageConfig.src}
          initialConfig={imageConfig}
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