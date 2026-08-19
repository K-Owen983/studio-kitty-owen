import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

export default function ImageConfigModal({
  imageSrc,
  initialConfig,
  onCancel,
  onInsert
}) {
  const [currentImageSrc, setCurrentImageSrc] = useState(
    imageSrc || ''
  );

  const [fileName, setFileName] = useState(
    initialConfig?.fileName || ''
  );

  const [title, setTitle] = useState(
    initialConfig?.title || ''
  );

  const [caption, setCaption] = useState(
    initialConfig?.caption || ''
  );

  const [altText, setAltText] = useState(
    initialConfig?.altText || ''
  );

  const [size, setSize] = useState(
    initialConfig?.size || 'medium'
  );

  const [alignment, setAlignment] = useState(
    initialConfig?.alignment || 'center'
  );

  const [titleAlignment, setTitleAlignment] = useState(
    initialConfig?.titleAlignment || 'center'
  );

  const [captionAlignment, setCaptionAlignment] = useState(
    initialConfig?.captionAlignment || 'center'
  );

  const isEditing = initialConfig?.isEditing || false;

  const handleChangeImage = () => {
    const input = document.createElement('input');

    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (event) => {
      const file = event.target.files?.[0];

      if (!file) return;

      const reader = new FileReader();

      reader.onload = () => {
        setCurrentImageSrc(reader.result);
        setFileName(file.name);
      };

      reader.readAsDataURL(file);
    };

    input.click();
  };

  const handleInsert = () => {
    onInsert({
      src: currentImageSrc,
      fileName,
      title,
      caption,
      altText,
      size,
      alignment,
      titleAlignment,
      captionAlignment,
      isEditing
    });
  };

  return (
    <div className="image-config-overlay">
      <div className="image-config-modal">

        <div className="image-config-header">
          <div>
            <h2>
              {isEditing ? 'Editar imagen' : 'Configurar imagen'}
            </h2>

            <p>
              {isEditing
                ? 'Modifica la imagen y sus características.'
                : 'Define cómo aparecerá la imagen en tu publicación.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="image-config-close"
            title="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="image-config-preview">
          <img
            src={currentImageSrc}
            alt={altText || 'Vista previa de la imagen'}
          />
        </div>

        <div className="image-config-change-image">
          <button
            type="button"
            onClick={handleChangeImage}
            className="btn btn-secondary"
          >
            <Upload size={16} />
            Cambiar imagen
          </button>

          {fileName && (
            <span className="image-config-file-name">
              {fileName}
            </span>
          )}
        </div>

        <div className="image-config-fields">

          <div className="image-config-field">
            <label htmlFor="image-title">
              🏷️ Título
            </label>

            <input
              id="image-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título de la imagen"
            />
          </div>

          <div className="image-config-field">
            <label htmlFor="image-caption">
              📝 Pie de foto
            </label>

            <input
              id="image-caption"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Texto que aparecerá debajo de la imagen"
            />
          </div>

          <div className="image-config-row">

            <div className="image-config-field">
              <label htmlFor="title-alignment">
                ↔️ Alineación del título
              </label>

              <select
                id="title-alignment"
                value={titleAlignment}
                onChange={(e) => setTitleAlignment(e.target.value)}
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
              </select>
            </div>

            <div className="image-config-field">
              <label htmlFor="caption-alignment">
                ↔️ Alineación del pie
              </label>

              <select
                id="caption-alignment"
                value={captionAlignment}
                onChange={(e) => setCaptionAlignment(e.target.value)}
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
              </select>
            </div>

          </div>

          <div className="image-config-field">
            <label htmlFor="image-alt">
              ♿ Texto alternativo
            </label>

            <input
              id="image-alt"
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe la imagen para accesibilidad"
            />
          </div>

          <div className="image-config-row">

            <div className="image-config-field">
              <label htmlFor="image-size">
                📐 Tamaño
              </label>

              <select
                id="image-size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              >
                <option value="small">Pequeño</option>
                <option value="medium">Mediano</option>
                <option value="large">Grande</option>
                <option value="full">Ancho completo</option>
              </select>
            </div>

            <div className="image-config-field">
              <label htmlFor="image-alignment">
                ↔️ Alineación
              </label>

              <select
                id="image-alignment"
                value={alignment}
                onChange={(e) => setAlignment(e.target.value)}
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
              </select>
            </div>

          </div>

        </div>

        <div className="image-config-actions">

          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleInsert}
            className="btn btn-primary"
          >
            {isEditing ? 'Guardar cambios' : 'Insertar imagen'}
          </button>

        </div>

      </div>
    </div>
  );
}