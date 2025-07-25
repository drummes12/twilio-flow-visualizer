import React from 'react';

const Header = ({ onExport, onImport, flowSelected }) => {
  return (
    <header className="header">
      <h1>Twilio Studio Flow Visualizer</h1>
      <div className="header-actions">
        <button 
          className="btn" 
          onClick={onExport} 
          disabled={!flowSelected}
          title={!flowSelected ? 'Selecciona un flujo primero' : 'Exportar flujo'}
        >
          Exportar JSON
        </button>
        <button 
          className="btn btn-primary" 
          onClick={onImport}
          title="Importar flujo desde archivo JSON"
        >
          Importar JSON
        </button>

      </div>
    </header>
  );
};

export default Header;