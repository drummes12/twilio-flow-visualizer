import React, { useState, useEffect } from 'react'
import '../styles/NodeDetails.css'

/**
 * Componente para mostrar información detallada de un nodo seleccionado
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.node - Nodo seleccionado
 * @param {Function} props.onClose - Función para cerrar el panel de detalles
 * @param {Function} props.onEdit - Función para editar el nodo
 * @param {Array} props.availableNodes - Lista de nodos disponibles para transiciones
 * @param {Function} props.onNodeUpdate - Función para actualizar el nodo
 */
const NodeDetails = ({
  node,
  availableNodes = [],
  onClose,
  onEdit,
  onUpdateNode
}) => {
  if (!node) return null

  const { data } = node
  const { label, type, properties, transitions } = data

  // Estados para la edición
  const [isEditing, setIsEditing] = useState(false)
  const [editedProperties, setEditedProperties] = useState(properties || {})
  const [editedTransitions, setEditedTransitions] = useState(transitions || [])
  const [hasChanges, setHasChanges] = useState(false)

  // Resetear estados cuando cambie el nodo
  useEffect(() => {
    setIsEditing(false)
    setEditedProperties(properties || {})
    setEditedTransitions(transitions || [])
    setHasChanges(false)
  }, [node.id, properties, transitions])

  // Detectar cambios
  useEffect(() => {
    const propertiesChanged =
      JSON.stringify(editedProperties) !== JSON.stringify(properties || {})
    const transitionsChanged =
      JSON.stringify(editedTransitions) !== JSON.stringify(transitions || [])
    setHasChanges(propertiesChanged || transitionsChanged)
  }, [editedProperties, editedTransitions, properties, transitions])

  // Funciones para manejar la edición
  const handleStartEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedProperties(properties || {})
    setEditedTransitions(transitions || [])
    setHasChanges(false)
  }

  const handleSaveChanges = () => {
    if (onUpdateNode && hasChanges) {
      const updatedNode = {
        ...node,
        data: {
          ...node.data,
          properties: editedProperties,
          transitions: editedTransitions
        }
      }
      onUpdateNode(updatedNode)
    }
    setIsEditing(false)
    setHasChanges(false)
  }

  const renderEditableTransitions = (transitions) => {
    if (!transitions || transitions.length === 0) {
      return <div className='no-data'>No hay transiciones configuradas</div>
    }

    return (
      <div className='transitions-list'>
        {transitions.map((transition, index) => (
          <div key={index} className='transition-item editable'>
            <div className='transition-header'>
              <span className='transition-event'>
                {transition.event || 'Sin evento'}
              </span>
              <select
                className='destination-select'
                value={transition.next || ''}
                onChange={(e) => {
                  const newTransitions = [...editedTransitions]
                  newTransitions[index] = {
                    ...newTransitions[index],
                    next: e.target.value
                  }
                  setEditedTransitions(newTransitions)
                  setHasChanges(true)
                }}
              >
                <option value=''>Seleccionar destino</option>
                {availableNodes.map((availableNode) => (
                  <option
                    key={availableNode.id}
                    value={availableNode.data.label}
                  >
                    {availableNode.data.label}
                  </option>
                ))}
              </select>
            </div>
            {transition.conditions && (
              <div className='transition-conditions'>
                <span className='conditions-label'>Condiciones:</span>
                <div className='conditions-list'>
                  {Object.entries(transition.conditions).map(([key, value]) => (
                    <div key={key} className='condition-item'>
                      <span className='condition-key'>{key}:</span>
                      <span className='condition-value'>{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  const handlePropertyChange = (key, value) => {
    setEditedProperties((prev) => ({
      ...prev,
      [key]: value
    }))
    setHasChanges(true)
  }

  const handleTransitionChange = (index, field, value) => {
    setEditedTransitions((prev) => {
      const newTransitions = [...prev]
      newTransitions[index] = {
        ...newTransitions[index],
        [field]: value
      }
      return newTransitions
    })
    setHasChanges(true)
  }

  return (
    <div className='node-details'>
      <div className='node-details-header'>
        <div className='header-content'>
          <div className='node-icon'>
            <svg
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <rect
                x='3'
                y='3'
                width='18'
                height='18'
                rx='4'
                stroke='currentColor'
                strokeWidth='2'
                fill='none'
              />
              <circle cx='12' cy='12' r='3' fill='currentColor' />
            </svg>
          </div>
          <div className='header-info'>
            <h3>{label}</h3>
            <span className='node-type'>{type}</span>
          </div>
        </div>
        <button className='node-details-close' onClick={onClose}>
          <svg
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M18 6L6 18M6 6L18 18'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
            />
          </svg>
        </button>
      </div>

      <div className='node-details-content'>


        {editedProperties && Object.keys(editedProperties).length > 0 && (
          <div className='details-card'>
            <div className='card-header'>
              <div className='card-icon'>
                <svg
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M12 2L2 7L12 12L22 7L12 2Z'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M2 17L12 22L22 17'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M2 12L12 17L22 12'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
              <h4>Propiedades</h4>
              <div className='item-count'>
                {Object.keys(editedProperties).length}
              </div>
            </div>
            <div className='card-content'>
              {isEditing
                ? renderEditableProperties(
                    editedProperties,
                    handlePropertyChange
                  )
                : renderProperties(editedProperties)}
            </div>
          </div>
        )}

        {editedTransitions && editedTransitions.length > 0 && (
          <div className='details-card'>
            <div className='card-header'>
              <div className='card-icon'>
                <svg
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M13 17L18 12L13 7M6 12H18'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
              <h4>Transiciones</h4>
              <div className='item-count'>{editedTransitions.length}</div>
            </div>
            <div className='card-content'>
              {isEditing ? (
                renderEditableTransitions(editedTransitions)
              ) : (
                <div className='transitions-flow'>
                  {editedTransitions.map((transition, index) => (
                    <div key={index} className='transition-item'>
                      <div className='transition-trigger'>
                        <div className='trigger-icon'>
                          <svg
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <circle
                              cx='12'
                              cy='12'
                              r='3'
                              stroke='currentColor'
                              strokeWidth='2'
                            />
                            <path
                              d='M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22'
                              stroke='currentColor'
                              strokeWidth='2'
                            />
                          </svg>
                        </div>
                        <span className='trigger-text'>
                          {transition.event || 'Evento por defecto'}
                        </span>
                      </div>

                      {transition.conditions &&
                        transition.conditions.length > 0 && (
                          <div className='transition-conditions'>
                            <div className='conditions-header'>
                              <svg
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  d='M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z'
                                  stroke='currentColor'
                                  strokeWidth='2'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                />
                              </svg>
                              <span>
                                Condiciones ({transition.conditions.length})
                              </span>
                            </div>
                            <div className='conditions-list'>
                              {transition.conditions.map((condition, i) => (
                                <div key={i} className='condition-item'>
                                  <div className='condition-bullet'></div>
                                  <span className='condition-text'>
                                    {condition.friendly_name ||
                                      JSON.stringify(condition)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      <div className='transition-destination'>
                        <div className='destination-arrow'>
                          <svg
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M5 12H19M19 12L12 5M19 12L12 19'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        </div>
                        <div className='destination-node'>
                          <svg
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <rect
                              x='3'
                              y='3'
                              width='18'
                              height='18'
                              rx='2'
                              ry='2'
                              stroke='currentColor'
                              strokeWidth='2'
                            />
                            <circle
                              cx='9'
                              cy='9'
                              r='2'
                              stroke='currentColor'
                              strokeWidth='2'
                            />
                            <path
                              d='M21 15L16 10L5 21'
                              stroke='currentColor'
                              strokeWidth='2'
                            />
                          </svg>
                          <span className='destination-text'>
                            {transition.next || 'Fin del flujo'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className='node-details-footer'>
        {/* Botones de edición */}
        {!isEditing && (
          <button className='edit-mode-button' onClick={handleStartEdit}>
            <svg
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            Editar propiedades
          </button>
        )}

        {/* Controles de guardado/cancelación */}
         {isEditing && (
           <div className='footer-edit-controls'>
             <button
               className='save-button'
               onClick={handleSaveChanges}
               disabled={!hasChanges}
             >
               <svg
                 viewBox='0 0 24 24'
                 fill='none'
                 xmlns='http://www.w3.org/2000/svg'
               >
                 <path
                   d='M20 6L9 17L4 12'
                   stroke='currentColor'
                   strokeWidth='2'
                   strokeLinecap='round'
                   strokeLinejoin='round'
                 />
               </svg>
               Guardar cambios
             </button>
             <button className='cancel-button' onClick={handleCancelEdit}>
               <svg
                 viewBox='0 0 24 24'
                 fill='none'
                 xmlns='http://www.w3.org/2000/svg'
               >
                 <path
                   d='M18 6L6 18M6 6L18 18'
                   stroke='currentColor'
                   strokeWidth='2'
                   strokeLinecap='round'
                 />
               </svg>
               Cancelar
             </button>
           </div>
         )}

        <button className='edit-button' onClick={() => onEdit(node)}>
          <svg
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          Editar JSON del widget
        </button>
      </div>
    </div>
  )
}

/**
 * Renderiza las propiedades de un nodo de forma editable
 * @param {Object} properties - Propiedades del nodo
 * @param {Function} onPropertyChange - Función para manejar cambios
 * @param {string} parentKey - Clave del objeto padre (para propiedades anidadas)
 * @returns {React.ReactNode}
 */
const renderEditableProperties = (
  properties,
  onPropertyChange,
  parentKey = ''
) => {
  return Object.entries(properties).map(([key, value], index) => {
    const fullKey = parentKey ? `${parentKey}.${key}` : key

    // Si el valor es un objeto y no es un array, renderizarlo recursivamente
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return (
        <div key={fullKey} className='property-group'>
          <div className='property-group-header'>
            <div className='property-icon'>
              <svg
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M9 12L11 14L15 10'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
            <span>{key}</span>
          </div>
          <div className='property-group-content'>
            {renderEditableProperties(
              value,
              (nestedKey, nestedValue) => {
                onPropertyChange(key, { ...value, [nestedKey]: nestedValue })
              },
              fullKey
            )}
          </div>
        </div>
      )
    }

    // Si el valor es un array, mostrarlo como una lista (no editable por ahora)
    if (Array.isArray(value)) {
      return (
        <div key={fullKey} className='property-item'>
          <div className='property-label'>
            <div className='property-bullet'></div>
            <span>{key}</span>
          </div>
          <div className='property-value'>
            {value.length === 0 ? (
              <span className='empty-value'>Array vacío</span>
            ) : (
              <div className='array-list'>
                {value.map((item, i) => (
                  <div key={i} className='array-item'>
                    {typeof item === 'object' && item !== null
                      ? JSON.stringify(item)
                      : String(item)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )
    }

    // Para valores simples - campos editables
    return (
      <div key={fullKey} className='property-item editable'>
        <div className='property-label'>
          <div className='property-bullet'></div>
          <span>{key}</span>
        </div>
        <div className='property-value'>
          {typeof value === 'boolean' ? (
            <select
              className='property-input'
              value={value.toString()}
              onChange={(e) => onPropertyChange(key, e.target.value === 'true')}
            >
              <option value='true'>Sí</option>
              <option value='false'>No</option>
            </select>
          ) : (
            <input
              type='text'
              className='property-input'
              value={value === null || value === undefined ? '' : String(value)}
              onChange={(e) => {
                let newValue = e.target.value
                // Intentar convertir a número si es posible
                if (!isNaN(newValue) && newValue !== '') {
                  newValue = Number(newValue)
                }
                onPropertyChange(key, newValue)
              }}
              placeholder={
                value === null || value === undefined ? 'Ninguno' : ''
              }
            />
          )}
        </div>
      </div>
    )
  })
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
        <div key={fullKey} className='property-group'>
          <div className='property-group-header'>
            <div className='property-icon'>
              <svg
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M9 12L11 14L15 10'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
            <span>{key}</span>
          </div>
          <div className='property-group-content'>
            {renderProperties(value, fullKey)}
          </div>
        </div>
      )
    }

    // Si el valor es un array, mostrarlo como una lista
    if (Array.isArray(value)) {
      return (
        <div key={fullKey} className='property-item'>
          <div className='property-label'>
            <div className='property-bullet'></div>
            <span>{key}</span>
          </div>
          <div className='property-value'>
            {value.length === 0 ? (
              <span className='empty-value'>Array vacío</span>
            ) : (
              <div className='array-list'>
                {value.map((item, i) => (
                  <div key={i} className='array-item'>
                    {typeof item === 'object' && item !== null
                      ? JSON.stringify(item)
                      : String(item)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )
    }

    // Para valores simples
    return (
      <div key={fullKey} className='property-item'>
        <div className='property-label'>
          <div className='property-bullet'></div>
          <span>{key}</span>
        </div>
        <div className='property-value'>
          {value === null || value === undefined ? (
            <span className='empty-value'>Ninguno</span>
          ) : typeof value === 'boolean' ? (
            <span className={`boolean-value ${value ? 'true' : 'false'}`}>
              {value ? 'Sí' : 'No'}
            </span>
          ) : (
            <span>{String(value)}</span>
          )}
        </div>
      </div>
    )
  })
}

export default NodeDetails
