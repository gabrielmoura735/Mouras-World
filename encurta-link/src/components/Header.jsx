import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link2, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from './Toast';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      addToast('Sessão encerrada com sucesso.', 'info');
      navigate('/login');
    } catch (error) {
      console.error("Falha ao sair:", error);
      addToast('Erro ao encerrar a sessão.', 'error');
    }
  }

  const userInitial = currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U';

  return (
    <header className="app-header">
      <Link to="/" className="brand-logo">
        <div className="brand-icon">
          <Link2 size={22} color="#ffffff" />
        </div>
        <span>Encurta<span style={{ color: 'var(--primary-light)' }}>Link</span></span>
      </Link>
      
      {currentUser && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Avatar"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)'
                }}
              />
            ) : (
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(59, 130, 246, 0.15)',
                color: 'var(--primary-light)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.9rem'
              }}>
                {userInitial}
              </div>
            )}
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: '500' }} className="hide-mobile">
              {currentUser.email}
            </span>
          </div>

          <button 
            onClick={handleLogout} 
            className="btn-secondary" 
            style={{ padding: '0.55rem 1rem', fontSize: '0.88rem' }}
            title="Encerrar Sessão"
          >
            <LogOut size={16} />
            <span className="hide-mobile">Sair</span>
          </button>
        </div>
      )}
    </header>
  );
}
