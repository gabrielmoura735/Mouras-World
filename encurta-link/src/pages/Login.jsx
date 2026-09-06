import React, { useState } from 'react';
import { useAuth, formatAuthError } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link2, Mail, Lock, ArrowRight } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup, loginWithGoogle, loginDirect } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [diagResult, setDiagResult] = useState(null);
  const [testingNet, setTestingNet] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/';

  function handleDirectAccess() {
    const user = loginDirect(email);
    addToast(`Entrando no modo de acesso direto (${user.email})...`, 'success');
    navigate(redirectPath, { replace: true });
  }

  async function testConnection() {
    setTestingNet(true);
    setDiagResult(null);
    try {
      const res = await fetch('https://identitytoolkit.googleapis.com', { method: 'GET', mode: 'no-cors' });
      setDiagResult({ ok: true, msg: 'Conexão com a Google API está ativa no seu navegador!' });
    } catch (e) {
      setDiagResult({
        ok: false,
        msg: 'Acesso à API do Google bloqueado por extensão (AdBlock/Brave Shields) ou rede local.'
      });
    } finally {
      setTestingNet(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }
    
    try {
      setLoading(true);
      if (isLogin) {
        await login(email, password);
        addToast('Login realizado com sucesso!', 'success');
      } else {
        await signup(email, password);
        addToast('Conta criada com sucesso! Seja bem-vindo ao EncurtaLink.', 'success');
      }
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error(err);
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      addToast('Autenticado com o Google com sucesso!', 'success');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(formatAuthError(err));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Glow de Fundo */}
      <div style={{
        position: 'absolute',
        width: '380px',
        height: '380px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, transparent 70%)',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '430px', position: 'relative', zIndex: 1, padding: '2.5rem 2rem' }}>
        
        {/* Brand Header */}
        <div className="text-center" style={{ marginBottom: '1.75rem' }}>
          <div className="brand-icon" style={{ margin: '0 auto 1.25rem auto', width: '52px', height: '52px' }}>
            <Link2 size={28} color="#ffffff" />
          </div>
          
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
            Encurta<span style={{ color: 'var(--primary-light)' }}>Link</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            {isLogin 
              ? 'Acesse seu painel para gerenciar e encurtar links' 
              : 'Crie sua conta para começar a encurtar links'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.35)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            style={{
              flex: 1,
              padding: '0.65rem',
              borderRadius: 'calc(var(--radius-md) - 2px)',
              fontSize: '0.9rem',
              fontWeight: '600',
              background: isLogin ? 'var(--bg-surface-elevated)' : 'transparent',
              color: isLogin ? 'var(--text-main)' : 'var(--text-muted)',
              border: isLogin ? '1px solid var(--border-subtle)' : 'none',
              boxShadow: isLogin ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            style={{
              flex: 1,
              padding: '0.65rem',
              borderRadius: 'calc(var(--radius-md) - 2px)',
              fontSize: '0.9rem',
              fontWeight: '600',
              background: !isLogin ? 'var(--bg-surface-elevated)' : 'transparent',
              color: !isLogin ? 'var(--text-main)' : 'var(--text-muted)',
              border: !isLogin ? '1px solid var(--border-subtle)' : 'none',
              boxShadow: !isLogin ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            Criar Conta
          </button>
        </div>

        {/* Error Alert with Quick Actions */}
        {error && (
          <div style={{ 
            background: 'var(--danger-bg)', 
            color: '#fecdd3', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            fontSize: '0.88rem',
            border: '1px solid var(--danger-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚠️</span>
              <span style={{ fontWeight: '500' }}>{error}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
              <button
                type="button"
                onClick={handleDirectAccess}
                style={{
                  background: 'var(--primary-gradient)',
                  color: '#ffffff',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  boxShadow: '0 2px 8px var(--primary-glow)'
                }}
              >
                ⚡ Entrar com Acesso Direto Agora
              </button>

              <button
                type="button"
                onClick={testConnection}
                disabled={testingNet}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {testingNet ? 'Testando...' : '🔍 Testar Conexão'}
              </button>
            </div>

            {diagResult && (
              <div style={{
                marginTop: '0.25rem',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: diagResult.ok ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.2)',
                border: `1px solid ${diagResult.ok ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.4)'}`,
                color: diagResult.ok ? '#6ee7b7' : '#fca5a5',
                fontSize: '0.8rem'
              }}>
                {diagResult.msg}
              </div>
            )}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              E-mail
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                className="input-field" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                placeholder="seu.email@exemplo.com"
                style={{ paddingLeft: '2.5rem' }}
                disabled={loading}
              />
              <Mail size={17} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              Senha
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                className="input-field" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                placeholder="Mínimo 6 caracteres"
                style={{ paddingLeft: '2.5rem' }}
                disabled={loading}
              />
              <Lock size={17} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading} 
            style={{ marginTop: '0.5rem', width: '100%', padding: '0.9rem 1.5rem' }}
          >
            {loading ? (
              <span>Processando...</span>
            ) : (
              <>
                <span>{isLogin ? 'Entrar no EncurtaLink' : 'Concluir Cadastro'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          margin: '1.5rem 0',
          color: 'var(--text-muted)'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          <span style={{ padding: '0 0.85rem', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ou</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>

        {/* Google Sign In */}
        <button 
          type="button"
          onClick={handleGoogleLogin} 
          className="btn-secondary" 
          disabled={loading} 
          style={{ width: '100%', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem' }}
        >
          <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Entrar com o Google</span>
        </button>

        {/* Immediate Direct Access Fallback */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
            Bloqueador de anúncios ou falha de rede?
          </p>
          <button
            type="button"
            onClick={handleDirectAccess}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(59, 130, 246, 0.12)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: 'var(--primary-light)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.88rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <span>⚡ Entrar com Acesso Direto (Sem Bloqueios)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
