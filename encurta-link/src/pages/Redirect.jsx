import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, increment, doc } from 'firebase/firestore';
import { AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react';

export default function Redirect() {
  const { code } = useParams();
  const [status, setStatus] = useState('loading'); // 'loading' | 'redirecting' | 'not_found' | 'error'
  const [destination, setDestination] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    // Timeout de segurança: se o Firestore não responder em 4s, aborta o spinner
    const timeoutId = setTimeout(() => {
      if (isMounted && status === 'loading') {
        setStatus('not_found');
      }
    }, 4000);

    async function processRedirect() {
      if (!code) {
        if (isMounted) setStatus('not_found');
        return;
      }

      try {
        let destinationUrl = '';
        let docIdToUpdate = null;

        // 1. Tenta buscar no Firestore
        try {
          const q = query(collection(db, 'links'), where('shortCode', '==', code));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const linkDoc = querySnapshot.docs[0];
            docIdToUpdate = linkDoc.id;
            destinationUrl = (linkDoc.data()?.originalUrl || '').trim();
          }
        } catch (fbErr) {
          console.warn("Firestore inacessível no redirecionamento:", fbErr);
        }

        // 2. Se não encontrou no Firestore, busca no registro local
        if (!destinationUrl) {
          try {
            const allGlobal = JSON.parse(localStorage.getItem('encurta_global_registry') || '{}');
            destinationUrl = (allGlobal[code] || '').trim();
          } catch (e) {}
        }

        if (!destinationUrl) {
          if (isMounted) setStatus('not_found');
          return;
        }
        if (!destinationUrl.startsWith('http://') && !destinationUrl.startsWith('https://')) {
          destinationUrl = 'https://' + destinationUrl;
        }

        if (isMounted) {
          setDestination(destinationUrl);
          setStatus('redirecting');
        }

        // Incrementa o contador de cliques no Firestore
        if (docIdToUpdate) {
          updateDoc(doc(db, 'links', docIdToUpdate), { 
            clicks: increment(1) 
          }).catch(err => console.error('Aviso ao registrar clique:', err));
        }

        // Redireciona o usuário para o destino
        setTimeout(() => {
          window.location.replace(destinationUrl);
        }, 500);

      } catch (err) {
        console.error('Erro no redirecionamento:', err);
        if (isMounted) {
          setStatus('error');
          if (err.code === 'permission-denied') {
            setErrorMessage('Permissão negada ao acessar o banco de dados. Verifique as regras do Firestore.');
          } else {
            setErrorMessage(err.message || 'Falha ao buscar a URL de destino.');
          }
        }
      }
    }

    processRedirect();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [code]);

  if (status === 'not_found') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        textAlign: 'center'
      }}>
        <div className="card animate-fade-in" style={{ maxWidth: '440px', width: '100%' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(244, 63, 94, 0.1)',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}>
            <AlertTriangle size={32} />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Link não encontrado
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.75rem', lineHeight: '1.5' }}>
            O link curto com o código <strong style={{ color: 'var(--primary-light)' }}>/r/{code}</strong> não existe, expirou ou foi excluído pelo autor.
          </p>

          <Link to="/" className="btn-primary" style={{ width: '100%' }}>
            <span>Acessar o Encurta.link</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        textAlign: 'center'
      }}>
        <div className="card animate-fade-in" style={{ maxWidth: '440px', width: '100%' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}>
            <AlertTriangle size={32} />
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem', color: '#fecdd3' }}>
            Erro no Redirecionamento
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            {errorMessage}
          </p>

          <Link to="/" className="btn-secondary" style={{ width: '100%' }}>
            <span>Voltar ao Início</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '1.5rem',
      textAlign: 'center'
    }}>
      <div className="card animate-fade-in" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem 2rem' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          border: '3px solid rgba(255, 255, 255, 0.1)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1.5rem auto'
        }} />

        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Redirecionando...
        </h3>
        
        {destination && (
          <p style={{ 
            color: 'var(--text-muted)', 
            fontSize: '0.85rem', 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            marginTop: '0.5rem'
          }}>
            Indo para: <span style={{ color: 'var(--text-secondary)' }}>{destination}</span>
          </p>
        )}

        {destination && (
          <a 
            href={destination} 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.35rem', 
              marginTop: '1.5rem', 
              fontSize: '0.85rem' 
            }}
          >
            <span>Clique aqui caso não seja redirecionado automaticamente</span>
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}
