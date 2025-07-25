import React, { useEffect } from 'react';
import '../styles/Modal.css';

/**
 * Componente para mostrar un modal de confirmación
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Indica si el modal está abierto
 * @param {string} props.title - Título del modal
 * @param {string} props.message - Mensaje a mostrar
 * @param {string} props.confirmText - Texto del botón de confirmación
 * @param {string} props.cancelText - Texto del botón de cancelación
 * @param {Function} props.onConfirm - Función a ejecutar al confirmar
 * @param {Function} props.onCancel - Función a ejecutar al cancelar
 */
const ConfirmModal = ({
  isOpen,
  title = 'Confirmar',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel
}) => {
  // Prevenir scroll cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // Manejar tecla Escape para cerrar el modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onCancel}>&times;</button>
        </div>
        
        <div className="modal-body">
          <p>{message}</p>
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;