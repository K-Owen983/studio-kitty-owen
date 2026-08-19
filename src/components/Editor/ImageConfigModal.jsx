import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function ImageConfigModal({
  imageSrc,
  onCancel,
  onInsert
}) {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [altText, setAltText] = useState('');
  const [size, setSize] = useState('medium');
  const [alignment, setAlignment] = useState('center');
  

  const handleInsert = () => {
    onInsert({
      title,
      caption,
      altText,
      size,
      alignment
    });
  };

  return (
    <div className="image-config-overlay">
      <div className="image-config-modal">

        <div className="image-config-header">
          <div>
            <h2>Configurar imagen</h2>
            <p>Define cómo aparecerá la imagen en tu publicación.</p>
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
            src={imageSrc}
            alt={altText || 'Vista previa de la imagen'}
          />
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
            Insertar imagen
          </button>
        </div>

      </div>
    </div>
  );
}