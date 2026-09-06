import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Excluir', isDanger = true }) {
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

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div style={{
            background: isDanger ? 'var(--danger-bg)' : 'rgba(59, 130, 246, 0.1)',
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDanger ? 'var(--danger)' : 'var(--primary)'
          }}>
            <AlertTriangle size={24} />
          </div>
          <button
            onClick={onClose}
            className="btn-icon"
            style={{ width: '32px', height: '32px' }}
            title="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          {title}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.75rem', lineHeight: '1.5' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={isDanger ? 'btn-danger' : 'btn-primary'}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
