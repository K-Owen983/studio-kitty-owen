import React from 'react';
import { X, Clock, Calendar, Tag, ShieldCheck } from 'lucide-react';
import { formatDate } from '../../utils/textHelpers';

export default function LivePreviewModal({ publication, onClose }) {
  if (!publication) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* ENCABEZADO DEL MODAL */}
        <div className="preview-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="pub-type-badge">{publication.type || 'Nota Estratégica'}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {publication.category || 'General'}
            </span>
            <span className={`status-tag ${publication.status === 'published' ? 'published' : 'draft'}`}>
              {publication.status === 'published' ? 'Publicado' : 'Borrador'}
            </span>
          </div>

          <button onClick={onClose} className="btn-icon" title="Cerrar vista previa">
            <X size={20} />
          </button>
        </div>

        {/* CUERPO DEL ARTÍCULO (FIEL RENDERIZADO DEL KNOWLEDGE HUB) */}
        <div className="preview-body">
          {publication.coverImage?.url && (
            <div style={{ width: '100%', height: '320px', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
              <img
                src={publication.coverImage.url}
                alt={publication.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.85rem' }}>
            {publication.title || 'Título de la publicación'}
          </h1>

          {publication.subtitle && (
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: 400, lineHeight: 1.5, marginBottom: '1.5rem' }}>
              {publication.subtitle}
            </h2>
          )}

          {/* META DEL AUTOR */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {publication.author?.photoURL ? (
                <img src={publication.author.photoURL} alt={publication.author.name} style={{ width: '42px', height: '42px', borderRadius: '50%' }} />
              ) : (
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  KO
                </div>
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{publication.author?.name || 'Kitty Owen'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Knowledge Hub</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span><Clock size={14} style={{ display: 'inline', marginRight: '3px' }} />{publication.readingTime || 1} min lectura</span>
              <span><Calendar size={14} style={{ display: 'inline', marginRight: '3px' }} />{formatDate(publication.publishedAt || publication.createdAt)}</span>
            </div>
          </div>

          {/* CONTENIDO DEL ARTÍCULO */}
          <div
            className="ProseMirror"
            dangerouslySetInnerHTML={{ __html: publication.contentHtml || '<p><em>Sin contenido</em></p>' }}
          />

          {/* FIRMA DE KITTY OWEN */}
          <div style={{ marginTop: '3.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)', textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-signature)', fontSize: '2.2rem', color: 'var(--text-primary)' }}>
              Kitty Owen
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Knowledge Hub • www.kittyowen.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
