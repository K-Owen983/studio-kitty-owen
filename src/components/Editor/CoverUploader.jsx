import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';

export default function CoverUploader({ coverImage, onUpload, onRemove }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await onUpload(file);
      if (result) {
        onUpload(result);
      }
    } catch (err) {
      alert('Error al subir la imagen: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await onUpload(file);
      if (result) {
        onUpload(result);
      }
    } catch (err) {
      alert('Error al subir la imagen: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (coverImage?.url) {
    return (
      <div className="cover-uploader">
        <div className="cover-image-container">
          <img src={coverImage.url} alt={coverImage.alt || 'Portada'} />
          <button onClick={onRemove} className="cover-remove-btn" title="Eliminar portada">
            <X size={14} style={{ display: 'inline', marginRight: '4px' }} /> Eliminar portada
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cover-uploader">
      <label
        className="cover-dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        {uploading ? (
          <div>Subiendo imagen de portada...</div>
        ) : (
          <>
            <UploadCloud size={32} />
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Agrega una imagen de portada</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Arrastra una imagen aquí o haz clic para seleccionar (PNG, JPG, WebP)
              </p>
            </div>
          </>
        )}
      </label>
    </div>
  );
}
