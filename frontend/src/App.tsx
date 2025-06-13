import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { VideoProvider } from './contexts/VideoContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Header from './components/Header';

// Protected route wrapper
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header />
      {element}
    </>
  );
};

// Placeholder pages
const SupportPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 className="text-2xl font-bold">Suporte</h1>
    <p className="mt-4">Página em desenvolvimento.</p>
  </div>
);

const ContactPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 className="text-2xl font-bold">Fale Conosco</h1>
    <p className="mt-4">Página em desenvolvimento.</p>
  </div>
);

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
      <Route path="/videos" element={<ProtectedRoute element={<HomePage />} />} />
      <Route path="/support" element={<ProtectedRoute element={<SupportPage />} />} />
      <Route path="/contact" element={<ProtectedRoute element={<ContactPage />} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <VideoProvider>
          <div className="min-h-screen bg-gray-50">
            <AppContent />
          </div>
        </VideoProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
