import React, { useState } from 'react';
import { Copy, Check, Trash2, Edit3, ExternalLink, MousePointerClick, Calendar } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useToast } from './Toast';
import ConfirmModal from './ConfirmModal';
import EditModal from './EditModal';

export default function LinkItem({ link, onDelete, onUpdate }) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { addToast } = useToast();
  
  const shortUrl = `${window.location.origin}/${link.shortCode}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      addToast('Link copiado para a área de transferência!', 'success');
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error("Falha ao copiar", err);
      addToast('Não foi possível copiar o link.', 'error');
    }
  }

  async function handleDeleteConfirm() {
    try {
      setIsDeleting(true);
      if (onDelete) {
        await onDelete(link.id, link.shortCode);
      } else {
        await deleteDoc(doc(db, "links", link.id));
      }
      addToast('Link encurtado excluído com sucesso.', 'info');
    } catch (err) {
      console.error("Falha ao excluir", err);
      if (onDelete) {
        onDelete(link.id, link.shortCode);
        addToast('Link removido.', 'info');
      } else {
        addToast('Erro ao excluir o link.', 'error');
      }
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleUpdateConfirm(newUrl) {
    if (onUpdate) {
      await onUpdate(link.id, link.shortCode, newUrl);
      addToast('URL de destino atualizada com sucesso!', 'success');
    }
  }

  const formattedDate = link.createdAt?.toDate ? 
    link.createdAt.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 
    new Date().toLocaleDateString('pt-BR');

  return (
    <>
      <div 
        className="card animate-fade-in"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          border: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          opacity: isDeleting ? 0.4 : 1,
          transition: 'all var(--transition-fast)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 240px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <a 
                href={shortUrl} 
                target="_blank" 
                rel="noreferrer" 
                style={{ 
                  fontSize: '1.15rem', 
                  fontWeight: '700',
                  color: 'var(--primary-light)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  letterSpacing: '-0.01em'
                }}
              >
                /{link.shortCode}
                <ExternalLink size={15} style={{ opacity: 0.8 }} />
              </a>
            </div>
            
            <p 
              title={link.originalUrl}
              style={{ 
                color: 'var(--text-muted)', 
                fontSize: '0.88rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'block'
              }}
            >
              {link.originalUrl}
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={handleCopy} 
              className={copied ? "btn-secondary" : "btn-secondary"}
              style={{ 
                padding: '0.55rem 1rem', 
                fontSize: '0.85rem',
                color: copied ? 'var(--success)' : 'var(--text-main)',
                borderColor: copied ? 'var(--success-border)' : 'var(--border-subtle)',
                background: copied ? 'var(--success-bg)' : undefined
              }}
              title="Copiar Link Curto"
            >
              {copied ? (
                <>
                  <Check size={16} color="var(--success)" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copiar</span>
                </>
              )}
            </button>

            <button 
              onClick={() => setIsEditModalOpen(true)} 
              className="btn-icon" 
              style={{ 
                color: 'var(--primary-light)', 
                borderColor: 'rgba(59, 130, 246, 0.3)',
                background: 'rgba(59, 130, 246, 0.08)'
              }}
              title="Editar URL de Destino"
            >
              <Edit3 size={16} />
            </button>

            <button 
              onClick={() => setIsModalOpen(true)} 
              className="btn-icon" 
              style={{ 
                color: 'var(--danger)', 
                borderColor: 'var(--danger-border)',
                background: 'var(--danger-bg)'
              }}
              title="Excluir Link"
            >
              <Trash2 size={17} />
            </button>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          fontSize: '0.82rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              background: link.clicks > 0 ? 'rgba(59, 130, 246, 0.12)' : 'rgba(255, 255, 255, 0.04)',
              color: link.clicks > 0 ? 'var(--primary-light)' : 'var(--text-muted)',
              border: `1px solid ${link.clicks > 0 ? 'rgba(59, 130, 246, 0.25)' : 'var(--border-subtle)'}`,
              fontWeight: '600'
            }}>
              <MousePointerClick size={14} />
              <span>{link.clicks || 0} {link.clicks === 1 ? 'clique' : 'cliques'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={13} style={{ opacity: 0.6 }} />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Excluir link encurtado?"
        message={`O link curto "/r/${link.shortCode}" deixará de funcionar imediatamente para todos os acessos.`}
        confirmText="Sim, Excluir"
        isDanger={true}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateConfirm}
        currentUrl={link.originalUrl}
        shortCode={link.shortCode}
      />
    </>
  );
}
