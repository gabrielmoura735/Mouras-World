import React, { useState, useEffect } from 'react';
import { Edit3, X, Check } from 'lucide-react';

export default function EditModal({ isOpen, onClose, onSave, currentUrl, shortCode }) {
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNewUrl(currentUrl || '');
      setError('');
    }
  }, [isOpen, currentUrl]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    let urlToSave = (newUrl || '').trim();
    if (!urlToSave) {
      setError('Por favor, informe a nova URL de destino.');
      return;
    }

    if (!urlToSave.startsWith('http://') && !urlToSave.startsWith('https://')) {
      urlToSave = 'https://' + urlToSave;
    }

    try {
      new URL(urlToSave);
    } catch {
      setError('Por favor, informe uma URL válida.');
      return;
    }

    onSave(urlToSave);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div style={{
            background: 'rgba(59, 130, 246, 0.15)',
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-light)'
          }}>
            <Edit3 size={22} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-icon"
            style={{ width: '32px', height: '32px' }}
            title="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
          Editar URL de Destino
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
          Atualize para onde o código curto <strong style={{ color: 'var(--primary-light)' }}>/r/{shortCode}</strong> irá redirecionar:
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <input
              type="text"
              className="input-field"
              value={newUrl}
              onChange={(e) => { setNewUrl(e.target.value); setError(''); }}
              placeholder="https://sua-loja.com/nova-pagina"
              style={{ padding: '0.85rem 1rem' }}
              autoFocus
            />
            {error && (
              <p style={{ color: '#fecdd3', fontSize: '0.82rem', marginTop: '0.4rem' }}>
                {error}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ gap: '0.4rem' }}
            >
              <Check size={16} />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
