import React from 'react';
import { formatDate } from '../../utils/textHelpers';
import { Edit3, Trash2, Clock, Eye } from 'lucide-react';

export default function PublicationCard({ publication, onEdit, onDelete, onPreview }) {
  return (
    <div className="pub-card" onClick={() => onEdit(publication)}>
      <div className="pub-card-main">
        {publication.coverImage?.url ? (
          <img
            src={publication.coverImage.url}
            alt={publication.title}
            className="pub-card-cover-preview"
          />
        ) : (
          <div className="pub-card-cover-preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Sin Portada
          </div>
        )}

        <div className="pub-card-info">
          <h3>{publication.title || 'Sin Título'}</h3>
          <p>{publication.subtitle || publication.excerpt || 'Sin descripción'}</p>
          
          <div className="pub-card-meta">
            <span className="pub-type-badge">{publication.type || 'Nota Estratégica'}</span>
            <span>•</span>
            <span>{publication.category || 'General'}</span>
            <span>•</span>
            <span><Clock size={12} style={{ display: 'inline', marginRight: '3px' }} />{publication.readingTime || 1} min lectura</span>
            <span>•</span>
            <span>Actualizado {formatDate(publication.updatedAt)}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} onClick={(e) => e.stopPropagation()}>
        <span className={`status-tag ${publication.status === 'published' ? 'published' : 'draft'}`}>
          {publication.status === 'published' ? 'Publicado' : 'Borrador'}
        </span>

        <div className="pub-card-actions">
          <button className="btn-icon" title="Vista Previa" onClick={() => onPreview(publication)}>
            <Eye size={16} />
          </button>
          <button className="btn-icon" title="Editar" onClick={() => onEdit(publication)}>
            <Edit3 size={16} />
          </button>
          <button className="btn-icon" title="Eliminar" style={{ color: '#EF4444' }} onClick={() => onDelete(publication.id)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
