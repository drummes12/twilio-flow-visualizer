import React from 'react'
import '../styles/NodeDetails.css'

/**
 * Componente para mostrar información detallada de un nodo seleccionado
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.node - Nodo seleccionado
 * @param {Function} props.onClose - Función para cerrar el panel de detalles
 * @param {Function} props.onEdit - Función para editar el nodo
 */
const NodeDetails = ({ node, onClose, onEdit }) => {
  if (!node) return null

  const { data } = node
  const { label, type, properties, transitions } = data

  return (
    <div className='node-details'>
      <div className='node-details-header'>
        <h3>Detalles del nodo</h3>
        <button className='node-details-close' onClick={onClose}>
          &times;
        </button>
      </div>

      <div className='node-details-content'>
        <div className='node-details-section'>
          <h4>Información básica</h4>
          <div className='node-details-item'>
            <span className='node-details-label'>Nombre:</span>
            <span className='node-details-value'>{label}</span>
          </div>
          <div className='node-details-item'>
            <span className='node-details-label'>Tipo:</span>
            <span className='node-details-value'>{type}</span>
          </div>
        </div>

        {properties && Object.keys(properties).length > 0 && (
          <div className='node-details-section'>
            <h4>Propiedades</h4>
            <div className='node-details-properties'>
              {renderProperties(properties)}
            </div>
          </div>
        )}

        {transitions && transitions.length > 0 && (
          <div className='node-details-section'>
            <h4>Transiciones</h4>
            <div className='node-details-transitions'>
              {transitions.map((transition, index) => (
                <div key={index} className='node-details-transition'>
                  <div className='node-details-item'>
                    <span className='node-details-label'>Evento:</span>
                    <span className='node-details-value'>
                      {transition.event || 'Default'}
                    </span>
                  </div>
                  {transition.conditions &&
                    transition.conditions.length > 0 && (
                      <div className='node-details-item'>
                        <span className='node-details-label'>Condiciones:</span>
                        <span className='node-details-value'>
                          {transition.conditions.map((condition, i) => (
                            <div key={i} className='node-details-condition'>
                              {condition.friendly_name ||
                                JSON.stringify(condition)}
                            </div>
                          ))}
                        </span>
                      </div>
                    )}
                  <div className='node-details-item'>
                    <span className='node-details-label'>Destino:</span>
                    <span className='node-details-value'>
                      {transition.next || 'Ninguno'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className='node-details-footer'>
        <button className='btn' onClick={() => onEdit(node)}>
          Editar widget
        </button>
      </div>
    </div>
  )
}

/**
 * Renderiza las propiedades de un nodo de forma recursiva
 * @param {Object} properties - Propiedades del nodo
 * @param {string} parentKey - Clave del objeto padre (para propiedades anidadas)
 * @returns {React.ReactNode}
 */
const renderProperties = (properties, parentKey = '') => {
  return Object.entries(properties).map(([key, value], index) => {
    const fullKey = parentKey ? `${parentKey}.${key}` : key

    // Si el valor es un objeto y no es un array, renderizarlo recursivamente
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return (
        <div key={fullKey} className='node-details-property-group'>
          <div className='node-details-property-group-header'>{key}:</div>
          <div className='node-details-property-group-content'>
            {renderProperties(value, fullKey)}
          </div>
        </div>
      )
    }

    // Si el valor es un array, mostrarlo como una lista
    if (Array.isArray(value)) {
      return (
        <div key={fullKey} className='node-details-item'>
          <span className='node-details-label'>{key}:</span>
          <span className='node-details-value'>
            {value.length === 0 ? (
              <em>Array vacío</em>
            ) : (
              <ul className='node-details-array'>
                {value.map((item, i) => (
                  <li key={i}>
                    {typeof item === 'object' && item !== null
                      ? JSON.stringify(item)
                      : String(item)}
                  </li>
                ))}
              </ul>
            )}
          </span>
        </div>
      )
    }

    // Para valores simples
    return (
      <div key={fullKey} className='node-details-item'>
        <span className='node-details-label'>{key}:</span>
        <span className='node-details-value'>
          {value === null || value === undefined ? (
            <em>Ninguno</em>
          ) : typeof value === 'boolean' ? (
            value ? (
              'Sí'
            ) : (
              'No'
            )
          ) : (
            String(value)
          )}
        </span>
      </div>
    )
  })
}

export default NodeDetails
