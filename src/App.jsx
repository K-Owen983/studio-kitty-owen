import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PublicationProvider, usePublications } from './context/PublicationContext';
import LoginView from './components/Auth/LoginView';
import DashboardView from './components/Dashboard/DashboardView';
import EditorView from './components/Editor/EditorView';

function AppContent() {
  const { currentUser } = useAuth();
  const { view } = usePublications();

  if (!currentUser) {
    return <LoginView />;
  }

  return view === 'editor' ? <EditorView /> : <DashboardView />;
}

export default function App() {
  return (
    <AuthProvider>
      <PublicationProvider>
        <AppContent />
      </PublicationProvider>
    </AuthProvider>
  );
}
