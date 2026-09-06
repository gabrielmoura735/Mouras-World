import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import LinkItem from '../components/LinkItem';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Link2, Plus, Sparkles, MousePointerClick, Layers, AlertCircle } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function Dashboard() {
  const [url, setUrl] = useState('');
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [error, setError] = useState('');
  const [dbError, setDbError] = useState('');
  
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  // Função para gerar código aleatório de 6 caracteres alfanuméricos
  const generateShortCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Chave de persistência local para backup
  const localKey = `encurta_backup_links_${currentUser?.uid || 'guest'}`;

  // Carrega links do localStorage
  const loadLocalLinks = () => {
    try {
      const data = localStorage.getItem(localKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  // Salva links no localStorage
  const saveLocalLinks = (newLinks) => {
    try {
      localStorage.setItem(localKey, JSON.stringify(newLinks));
      // Salva também no registro global para permitir redirecionamento direto
      const allGlobal = JSON.parse(localStorage.getItem('encurta_global_registry') || '{}');
      newLinks.forEach(l => {
        allGlobal[l.shortCode] = l.originalUrl;
      });
      localStorage.setItem('encurta_global_registry', JSON.stringify(allGlobal));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    setLoadingLinks(true);

    // Carrega versão local de imediato para não deixar tela vazia
    const cached = loadLocalLinks();
    if (cached.length > 0) {
      setLinks(cached);
    }

    // Timeout de segurança: desativa o spinner caso a resposta demore mais que 2.5s
    const linksTimeout = setTimeout(() => {
      setLoadingLinks(false);
    }, 2500);

    let unsubscribe = () => {};

    try {
      const q = query(
        collection(db, 'links'),
        where('userId', '==', currentUser.uid)
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        clearTimeout(linksTimeout);
        const linksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt instanceof Date ? a.createdAt.getTime() : Date.now()));
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt instanceof Date ? b.createdAt.getTime() : Date.now()));
          return timeB - timeA;
        });

        setLinks(linksData);
        saveLocalLinks(linksData);
        setLoadingLinks(false);
        setDbError('');
      }, (err) => {
        clearTimeout(linksTimeout);
        console.warn("Firestore inacessível, usando armazenamento local:", err.message);
        setLoadingLinks(false);
        setLinks(loadLocalLinks());
      });
    } catch (e) {
      clearTimeout(linksTimeout);
      setLoadingLinks(false);
      setLinks(loadLocalLinks());
    }

    return () => {
      unsubscribe();
      clearTimeout(linksTimeout);
    };
  }, [currentUser]);

  // Estatísticas calculadas
  const stats = useMemo(() => {
    const totalLinks = links.length;
    const totalClicks = links.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
    return { totalLinks, totalClicks };
  }, [links]);

  async function handleShorten(e) {
    e.preventDefault();
    if (!url.trim()) return;

    // Validação de URL
    let urlToSave = url.trim();
    if (!urlToSave.startsWith('http://') && !urlToSave.startsWith('https://')) {
      urlToSave = 'https://' + urlToSave;
    }
    
    try {
      new URL(urlToSave);
    } catch {
      setError('Por favor, informe uma URL válida (ex: https://meusite.com/pagina).');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const shortCode = generateShortCode();
      const newLinkObj = {
        id: 'loc_' + Date.now(),
        userId: currentUser.uid,
        originalUrl: urlToSave,
        shortCode,
        clicks: 0,
        createdAt: new Date()
      };

      // Tenta salvar no Firestore
      try {
        const docRef = await addDoc(collection(db, 'links'), {
          userId: currentUser.uid,
          originalUrl: urlToSave,
          shortCode,
          clicks: 0,
          createdAt: serverTimestamp()
        });
        newLinkObj.id = docRef.id;
      } catch (fbErr) {
        console.warn("Não foi possível salvar no Firestore remoto, salvando localmente:", fbErr);
      }

      // Atualiza estado e cache local
      setLinks(prev => {
        const updated = [newLinkObj, ...prev.filter(l => l.shortCode !== shortCode)];
        saveLocalLinks(updated);
        return updated;
      });

      setUrl('');
      addToast(`Link encurtado com sucesso: /${shortCode}`, 'success');
    } catch (err) {
      console.error('Erro ao salvar link:', err);
      setError(`Erro ao encurtar: ${err.message || 'Tente novamente.'}`);
      addToast('Não foi possível encurtar o link.', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteLink(id, shortCode) {
    // 1. Tenta deletar no Firestore
    try {
      if (id && !id.startsWith('loc_')) {
        await deleteDoc(doc(db, 'links', id));
      }
    } catch (err) {
      console.warn("Aviso ao excluir no Firestore:", err);
    }

    // 2. Remove do estado e do cache local
    setLinks(prev => {
      const updated = prev.filter(l => l.id !== id && l.shortCode !== shortCode);
      saveLocalLinks(updated);
      return updated;
    });

    // 3. Remove do registro global de redirecionamento
    try {
      const allGlobal = JSON.parse(localStorage.getItem('encurta_global_registry') || '{}');
      delete allGlobal[shortCode];
      localStorage.setItem('encurta_global_registry', JSON.stringify(allGlobal));
    } catch (e) {}
  }

  async function handleUpdateLink(id, shortCode, newUrl) {
    // 1. Tenta atualizar no Firestore
    try {
      if (id && !id.startsWith('loc_')) {
        await updateDoc(doc(db, 'links', id), { originalUrl: newUrl });
      }
    } catch (err) {
      console.warn("Aviso ao atualizar no Firestore:", err);
    }

    // 2. Atualiza estado e cache local
    setLinks(prev => {
      const updated = prev.map(l => (l.id === id || l.shortCode === shortCode) ? { ...l, originalUrl: newUrl } : l);
      saveLocalLinks(updated);
      return updated;
    });

    // 3. Atualiza no registro global de redirecionamento
    try {
      const allGlobal = JSON.parse(localStorage.getItem('encurta_global_registry') || '{}');
      allGlobal[shortCode] = newUrl;
      localStorage.setItem('encurta_global_registry', JSON.stringify(allGlobal));
    } catch (e) {}
  }

  return (
    <>
      <Header />
      <main className="app-container">
        
        {/* Shorten Box Card */}
        <div className="card mb-6 animate-fade-in" style={{ padding: '2.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.65rem', letterSpacing: '-0.02em' }}>
              <div style={{
                background: 'rgba(59, 130, 246, 0.15)',
                color: 'var(--primary-light)',
                padding: '0.45rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={20} />
              </div>
              Encurtar nova URL
            </h2>

            {/* Quick Stats Badges */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="stat-pill">
                <Layers size={14} color="var(--primary-light)" />
                <span>Links: <strong>{stats.totalLinks}</strong></span>
              </span>
              <span className="stat-pill">
                <MousePointerClick size={14} color="var(--accent-cyan)" />
                <span>Total de cliques: <strong>{stats.totalClicks}</strong></span>
              </span>
            </div>
          </div>
          
          <form onSubmit={handleShorten} style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 340px' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Cole sua URL longa aqui (ex: https://meusite.com/artigo-muito-longo)"
                value={url}
                onChange={(e) => { setUrl(e.target.value); if (error) setError(''); }}
                style={{ padding: '1rem 1.25rem', fontSize: '1.05rem', borderRadius: 'var(--radius-md)' }}
                required
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading || !url.trim()}
              style={{ padding: '1rem 2.25rem', fontSize: '1rem' }}
            >
              {loading ? (
                <span>Encurtando...</span>
              ) : (
                <>
                  <Plus size={20} />
                  <span>Encurtar</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <p style={{ color: '#fecdd3', marginTop: '0.85rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <AlertCircle size={16} color="var(--danger)" />
              {error}
            </p>
          )}
        </div>

        {/* Database Notice if permission issues occur */}
        {dbError && (
          <div style={{
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            color: '#fecdd3',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem'
          }}>
            <AlertCircle size={18} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{dbError}</span>
          </div>
        )}

        {/* Links List Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.01em' }}>
              Seus Links Encurtados ({links.length})
            </h3>
            {links.length > 0 && (
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Sincronizado em tempo real
              </span>
            )}
          </div>
          
          {loadingLinks ? (
            <div className="card text-center" style={{ padding: '3rem 2rem', color: 'var(--text-muted)' }}>
              <div style={{
                width: '36px',
                height: '36px',
                border: '3px solid rgba(255, 255, 255, 0.1)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 1rem auto'
              }} />
              <p>Carregando seus links...</p>
            </div>
          ) : links.length === 0 ? (
            <div className="card text-center animate-fade-in" style={{ padding: '3.5rem 2rem', color: 'var(--text-muted)' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <Link2 size={32} style={{ opacity: 0.3 }} />
              </div>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '0.35rem', fontWeight: '600' }}>
                Nenhum link criado ainda
              </h4>
              <p style={{ fontSize: '0.9rem', maxWidth: '340px', margin: '0 auto' }}>
                Cole qualquer endereço web longo no campo acima para gerar seu primeiro link curto!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {links.map(link => (
                <LinkItem 
                  key={link.id} 
                  link={link} 
                  onDelete={handleDeleteLink}
                  onUpdate={handleUpdateLink}
                />
              ))}
            </div>
          )}
        </div>

      </main>
    </>
  );
}
