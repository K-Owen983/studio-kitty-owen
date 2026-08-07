import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Sparkles, ShieldCheck } from 'lucide-react';

export default function LoginView() {
  const { loginWithGoogle, isFirebaseConfigured } = useAuth();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      alert('Error al iniciar sesión: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <span className="login-brand-badge">KO</span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Studio Kitty Owen
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Plataforma Editorial del Knowledge Hub
        </p>

        <button onClick={handleLogin} className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginBottom: '1.5rem' }}>
          <LogIn size={18} /> Iniciar sesión con Google
        </button>

        <div style={{ background: 'var(--bg-app)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
          {isFirebaseConfigured ? (
            <>
              <ShieldCheck size={14} color="#059669" />
              <span>Conectado a Firebase Live Auth</span>
            </>
          ) : (
            <>
              <Sparkles size={14} color="#2563EB" />
              <span>Modo Demo Activo (Acceso de prueba instantáneo)</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
