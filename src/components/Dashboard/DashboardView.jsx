import React, { useState } from 'react';
import { usePublications } from '../../context/PublicationContext';
import { useAuth } from '../../context/AuthContext';
import PublicationCard from './PublicationCard';
import LivePreviewModal from '../Preview/LivePreviewModal';
import { Plus, Search, LogOut, FileText, Sparkles } from 'lucide-react';

export default function DashboardView() {
  const {
    publications,
    loading,
    createNewPublication,
    editPublication,
    deletePublication,
    autosavedDraft,
    restoreAutosavedDraft,
    discardAutosavedDraft,
    isFirebaseConfigured
  } = usePublications();

  const { currentUser, logout } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'draft' | 'published'
  const [previewPub, setPreviewPub] = useState(null);

  const filteredPublications = publications.filter((pub) => {
    const matchesSearch = (pub.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (pub.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta publicación?')) {
      await deletePublication(id);
    }
  };

  return (
    <div className="app-container">
      {/* NAVBAR SUPERIOR */}
      <header className="studio-navbar">
        <div className="brand-container">
          <span className="brand-badge">KO</span>
          <div>
            <div className="brand-title">Studio Kitty Owen</div>
            <div className="brand-subtitle">Editorial Space</div>
          </div>
        </div>

        <div className="nav-actions">
          <span className={`mode-badge ${isFirebaseConfigured ? 'live' : ''}`}>
            {isFirebaseConfigured ? 'Firebase Live' : 'Modo Demo (Offline)'}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {currentUser?.name}
          </span>
          <button onClick={logout} className="btn-icon" title="Cerrar Sesión">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* DASHBOARD BODY */}
      <main className="dashboard-container">
        {/* BANNER SI EXISTE BORRADOR AUTOGUARDADO RESTAURABLE */}
        {autosavedDraft && (
          <div className="draft-banner" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} />
              <span>
                <strong>Borrador autoguardado detectado:</strong> "{autosavedDraft.title || 'Sin Título'}" ({new Date(autosavedDraft.autosavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
              </span>
            </div>
            <div className="draft-banner-actions">
              <button onClick={restoreAutosavedDraft} className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                Restaurar Borrador
              </button>
              <button onClick={discardAutosavedDraft} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                Descartar
              </button>
            </div>
          </div>
        )}

        <div className="dashboard-header">
          <div className="dashboard-title-group">
            <h1>Mis Publicaciones</h1>
            <p>Gestiona el contenido editorial del Knowledge Hub de www.kittyowen.com</p>
          </div>
          <button onClick={createNewPublication} className="btn btn-primary" style={{ padding: '0.7rem 1.3rem', fontSize: '0.95rem' }}>
            <Plus size={18} /> Nueva Publicación
          </button>
        </div>

        {/* CONTROLES DE BÚSQUEDA Y FILTRADO */}
        <div className="dashboard-controls">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por título o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-pills">
            <button
              className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              Todas ({publications.length})
            </button>
            <button
              className={`filter-pill ${statusFilter === 'draft' ? 'active' : ''}`}
              onClick={() => setStatusFilter('draft')}
            >
              Borradores ({publications.filter(p => p.status === 'draft').length})
            </button>
            <button
              className={`filter-pill ${statusFilter === 'published' ? 'active' : ''}`}
              onClick={() => setStatusFilter('published')}
            >
              Publicados ({publications.filter(p => p.status === 'published').length})
            </button>
          </div>
        </div>

        {/* LISTADO DE PUBLICACIONES */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Cargando publicaciones...
          </div>
        ) : filteredPublications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#FFF', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <FileText size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No se encontraron publicaciones</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Comienza escribiendo una nueva Nota Estratégica, Ensayo o Artículo.
            </p>
            <button onClick={createNewPublication} className="btn btn-primary">
              <Plus size={16} /> Crear primera publicación
            </button>
          </div>
        ) : (
          <div className="publications-grid">
            {filteredPublications.map((pub) => (
              <PublicationCard
                key={pub.id}
                publication={pub}
                onEdit={editPublication}
                onDelete={handleDelete}
                onPreview={(p) => setPreviewPub(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* MODAL VISTA PREVIA */}
      {previewPub && (
        <LivePreviewModal
          publication={previewPub}
          onClose={() => setPreviewPub(null)}
        />
      )}
    </div>
  );
}
