import React from 'react';
import '../styles/FlowToolbar.css';

/**
 * Componente para mostrar una barra de herramientas para el visualizador de flujos
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onZoomIn - Función para aumentar el zoom
 * @param {Function} props.onZoomOut - Función para disminuir el zoom
 * @param {Function} props.onZoomReset - Función para restablecer el zoom
 * @param {Function} props.onFitView - Función para ajustar la vista
 * @param {Function} props.onToggleMinimap - Función para mostrar/ocultar el minimapa
 * @param {boolean} props.minimapVisible - Indica si el minimapa está visible
 * @param {Function} props.onToggleLayout - Función para alternar entre layout automático y original
 * @param {boolean} props.useAutoLayout - Indica si está usando layout automático
 */
const FlowToolbar = ({
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onFitView,
  onToggleMinimap,
  minimapVisible = true,
  onToggleLayout,
  useAutoLayout = true
}) => {
  return (
    <div className="flow-toolbar">
      <div className="toolbar-group">
        <button 
          className="toolbar-button" 
          onClick={onZoomIn} 
          title="Acercar"
        >
          <ZoomInIcon />
        </button>
        <button 
          className="toolbar-button" 
          onClick={onZoomOut} 
          title="Alejar"
        >
          <ZoomOutIcon />
        </button>
        <button 
          className="toolbar-button" 
          onClick={onZoomReset} 
          title="Restablecer zoom"
        >
          <ZoomResetIcon />
        </button>
      </div>
      
      <div className="toolbar-group">
        <button 
          className="toolbar-button" 
          onClick={onFitView} 
          title="Ajustar a la vista"
        >
          <FitViewIcon />
        </button>
        <button 
          className={`toolbar-button ${minimapVisible ? 'active' : ''}`} 
          onClick={onToggleMinimap} 
          title={minimapVisible ? 'Ocultar minimapa' : 'Mostrar minimapa'}
        >
          <MinimapIcon />
        </button>
      </div>
      
      <div className="toolbar-group">
        <button 
          className={`toolbar-button ${useAutoLayout ? 'active' : ''}`} 
          onClick={onToggleLayout} 
          title={useAutoLayout ? 'Cambiar a posiciones originales' : 'Cambiar a layout automático'}
        >
          <LayoutIcon />
        </button>
      </div>
    </div>
  );
};

// Iconos SVG para los botones de la barra de herramientas
const ZoomInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    <line x1="11" y1="8" x2="11" y2="14"></line>
    <line x1="8" y1="11" x2="14" y2="11"></line>
  </svg>
);

const ZoomOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    <line x1="8" y1="11" x2="14" y2="11"></line>
  </svg>
);

const ZoomResetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
    <path d="M3 3v5h5"></path>
  </svg>
);

const FitViewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9"></polyline>
    <polyline points="9 21 3 21 3 15"></polyline>
    <line x1="21" y1="3" x2="14" y2="10"></line>
    <line x1="3" y1="21" x2="10" y2="14"></line>
  </svg>
);

const MinimapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <rect x="9" y="9" width="6" height="6"></rect>
  </svg>
);

const LayoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);



export default FlowToolbar;