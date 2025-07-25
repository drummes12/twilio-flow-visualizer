import React, { useState, useEffect } from 'react';
import '../styles/Alert.css';

/**
 * Componente para mostrar mensajes de alerta
 * @param {Object} props - Propiedades del componente
 * @param {string} props.type - Tipo de alerta (success, error, warning, info)
 * @param {string} props.message - Mensaje a mostrar
 * @param {boolean} props.autoClose - Si la alerta debe cerrarse automáticamente
 * @param {number} props.duration - Duración en ms antes de cerrarse automáticamente
 * @param {Function} props.onClose - Función a ejecutar al cerrar la alerta
 */
const Alert = ({ 
  type = 'info', 
  message, 
  autoClose = false, 
  duration = 5000, 
  onClose 
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoClose && message) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, message]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!message || !visible) return null;

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">{message}</div>
      <button className="alert-close" onClick={handleClose}>
        &times;
      </button>
    </div>
  );
};

export default Alert;