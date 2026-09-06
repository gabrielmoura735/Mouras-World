import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Redirect from './pages/Redirect';

// Rota protegida: somente usuários logados podem acessar
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Rota pública de autenticação: redireciona usuário já logado para o Dashboard
function PublicAuthRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (currentUser) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Tela de Login / Cadastro */}
            <Route 
              path="/login" 
              element={
                <PublicAuthRoute>
                  <Login />
                </PublicAuthRoute>
              } 
            />

            {/* Painel Principal (Protegido) */}
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />

            {/* Redirecionamento de Link Curto (Público): /r/:code e /:code */}
            <Route path="/r/:code" element={<Redirect />} />
            <Route path="/:code" element={<Redirect />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
