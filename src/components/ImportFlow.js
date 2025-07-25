import React, { useState, useEffect } from 'react';
import { importFlowFromJson, validateFlowStructure } from '../services/flowService';
import '../styles/Modal.css';

const ImportFlow = ({ onImportComplete, onCancel }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Prevenir scroll cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Manejar tecla Escape para cerrar el modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const flowData = await importFlowFromJson(file);
      
      // Validar la estructura del flujo
      if (!validateFlowStructure(flowData)) {
        throw new Error('El archivo no tiene la estructura correcta de un flujo de Twilio Studio');
      }
      
      // Notificar al componente padre del éxito
      onImportComplete(flowData, file.name);
    } catch (error) {
      console.error('Error al importar el flujo:', error);
      setError(error.message || 'Error al importar el flujo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Importar flujo de Twilio Studio</h3>
          <button className="modal-close" onClick={onCancel}>&times;</button>
        </div>
        
        <div className="modal-body">
          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="flow-file" className="form-label">
              Selecciona un archivo JSON de flujo de Twilio Studio
            </label>
            <input
              type="file"
              id="flow-file"
              className="form-control"
              accept=".json"
              onChange={handleFileChange}
              disabled={loading}
            />
          </div>
          
          {file && (
            <div style={{ marginTop: '12px', padding: '8px 12px', background: 'rgba(76, 175, 80, 0.1)', borderRadius: '6px', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
              <small style={{ color: '#4caf50' }}>Archivo seleccionado: {file.name}</small>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={handleImport}
            disabled={!file || loading}
          >
            {loading ? 'Importando...' : 'Importar flujo'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportFlow;