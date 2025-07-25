import React from 'react';
import '../styles/Spinner.css';

/**
 * Componente para mostrar un spinner de carga
 * @param {Object} props - Propiedades del componente
 * @param {string} props.size - Tamaño del spinner (small, medium, large)
 * @param {string} props.color - Color del spinner
 * @param {string} props.text - Texto a mostrar debajo del spinner
 */
const Spinner = ({ size = 'medium', color = '#0263e0', text }) => {
  const sizeMap = {
    small: { width: '16px', height: '16px', border: '2px' },
    medium: { width: '32px', height: '32px', border: '3px' },
    large: { width: '48px', height: '48px', border: '4px' }
  };

  const spinnerSize = sizeMap[size] || sizeMap.medium;

  const spinnerStyle = {
    width: spinnerSize.width,
    height: spinnerSize.height,
    borderWidth: spinnerSize.border,
    borderColor: `${color}20`,
    borderTopColor: color
  };

  return (
    <div className="spinner-container">
      <div className="spinner" style={spinnerStyle}></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default Spinner;