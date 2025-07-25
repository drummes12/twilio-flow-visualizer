import React from 'react';
import '../styles/EmptyState.css';

/**
 * Componente para mostrar un estado vacío
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título del estado vacío
 * @param {string} props.message - Mensaje descriptivo
 * @param {React.ReactNode} props.icon - Icono a mostrar
 * @param {React.ReactNode} props.action - Acción a mostrar (botón, enlace, etc.)
 */
const EmptyState = ({ 
  title = 'No hay datos disponibles', 
  message = 'No se encontraron datos para mostrar.', 
  icon, 
  action 
}) => {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
};

/**
 * Componente para mostrar un icono de documento vacío
 */
export const EmptyDocumentIcon = () => (
  <svg 
    width="64" 
    height="64" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="9" y1="15" x2="15" y2="15"></line>
    <line x1="9" y1="11" x2="15" y2="11"></line>
  </svg>
);

/**
 * Componente para mostrar un icono de búsqueda vacía
 */
export const EmptySearchIcon = () => (
  <svg 
    width="64" 
    height="64" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    <line x1="8" y1="11" x2="14" y2="11"></line>
  </svg>
);

/**
 * Componente para mostrar un icono de error
 */
export const ErrorIcon = () => (
  <svg 
    width="64" 
    height="64" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

export default EmptyState;