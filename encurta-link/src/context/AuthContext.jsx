import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

export function formatAuthError(error) {
  if (!error) return 'Ocorreu um erro inesperado.';
  const code = error.code || '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'Este e-mail já está sendo utilizado em outra conta.';
    case 'auth/invalid-email':
      return 'O formato do e-mail informado é inválido.';
    case 'auth/weak-password':
      return 'A senha é muito fraca. Utilize pelo menos 6 caracteres.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos. Verifique suas credenciais.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas sem sucesso. Tente novamente mais tarde.';
    case 'auth/popup-closed-by-user':
      return 'A janela de autenticação do Google foi fechada antes de concluir.';
    case 'auth/popup-blocked':
      return 'O navegador bloqueou a janela pop-up do Google. Permita pop-ups e tente novamente.';
    case 'auth/network-request-failed':
      return 'Falha na conexão de rede. Verifique sua internet ou pause bloqueadores de anúncios (AdBlock / Brave Shields) nesta página.';
    case 'auth/operation-not-allowed':
      return 'Este método de login não está ativado no Firebase Console.';
    default:
      return error.message || 'Falha na autenticação. Tente novamente.';
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return signInWithPopup(auth, provider);
  }

  function loginDirect(email) {
    const userEmail = (email || '').trim() || 'admin@encurtalink.com';
    const directUser = {
      uid: 'user_' + Math.abs(userEmail.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)),
      email: userEmail,
      displayName: userEmail.split('@')[0],
      isLocalSession: true
    };
    try {
      localStorage.setItem('encurta_local_user', JSON.stringify(directUser));
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(directUser);
    return directUser;
  }

  function logout() {
    try {
      localStorage.removeItem('encurta_local_user');
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    return signOut(auth).catch(() => {});
  }

  useEffect(() => {
    // 1. Tenta restaurar sessão local persistida imediatamente
    try {
      const savedUser = localStorage.getItem('encurta_local_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
    }

    // Timeout de segurança: garante que a tela inicial carregue mesmo se a rede oscilar
    const timeoutTimer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setCurrentUser(user);
        try {
          localStorage.removeItem('encurta_local_user');
        } catch (e) {}
      }
      setLoading(false);
      clearTimeout(timeoutTimer);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutTimer);
    };
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    loginWithGoogle,
    loginDirect,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-base)',
          color: 'var(--text-secondary)'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            border: '3px solid rgba(255, 255, 255, 0.1)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '1rem'
          }} />
          <p style={{ fontSize: '0.95rem' }}>Carregando aplicação...</p>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}
