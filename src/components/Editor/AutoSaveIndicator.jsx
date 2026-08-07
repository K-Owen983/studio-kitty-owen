import React from 'react';
import { Check, RefreshCw, AlertCircle } from 'lucide-react';

export default function AutoSaveIndicator({ isDirty, isAutoSaving, lastSavedAt }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
      {isAutoSaving ? (
        <>
          <RefreshCw size={12} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
          <span>Guardando borrador...</span>
        </>
      ) : isDirty ? (
        <>
          <AlertCircle size={12} color="#D97706" />
          <span style={{ color: '#D97706' }}>Cambios sin guardar</span>
        </>
      ) : lastSavedAt ? (
        <>
          <Check size={12} color="#059669" />
          <span>Guardado {new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </>
      ) : (
        <span>AutoSave activo (cada 30s)</span>
      )}
    </div>
  );
}
