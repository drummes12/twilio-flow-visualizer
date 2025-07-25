import React, { useState, useEffect } from 'react'
import { getFlowList } from '../data/sampleFlows'

const Sidebar = ({
  onFlowSelect,
  selectedFlow,
  savedFlows,
  onDeleteFlow,
  isCollapsed,
  onToggleCollapse
}) => {
  const [sampleFlows, setSampleFlows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      const availableFlows = getFlowList()
      setSampleFlows(availableFlows)
      setLoading(false)
    } catch (err) {
      setError('Error loading flows: ' + err.message)
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className='sidebar'>
        <h2>Cargando flujos...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className='sidebar'>
        <h2>Error</h2>
        <p className='alert alert-danger'>{error}</p>
      </div>
    )
  }

  const isFlowSelected = (flow, isFromSaved = false) => {
    if (isFromSaved) {
      return typeof selectedFlow === 'string' && selectedFlow === flow.name
    }
    return selectedFlow === flow.id
  }

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className='sidebar-header'>
        {!isCollapsed && <h2>Flujos</h2>}
        <button
          className='sidebar-toggle'
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {!isCollapsed && (
        <div className='sidebar-content'>
          {/* Flujos guardados */}
          {savedFlows && savedFlows.length > 0 && (
            <div className='flow-section'>
              <h3>Mis Flujos</h3>
              <ul className='flow-list'>
                {savedFlows.map((flow) => (
                  <li
                    key={`saved-${flow.id}`}
                    className={`flow-item ${
                      isFlowSelected(flow, true) ? 'active' : ''
                    }`}
                    onClick={() => onFlowSelect(flow)}
                  >
                    <div className='flow-content'>
                      <div className='flow-name'>{flow.name}</div>
                      <div className='flow-meta'>
                        {new Date(flow.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      className='delete-flow-btn'
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteFlow(flow.id)
                      }}
                      title='Eliminar flujo'
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Flujos de muestra */}
          <div className='flow-section'>
            <h3>Flujos de Ejemplo</h3>
            <ul className='flow-list'>
              {sampleFlows.map((flow) => (
                <li
                  key={`sample-${flow.id}`}
                  className={`flow-item ${
                    isFlowSelected(flow) ? 'active' : ''
                  }`}
                  onClick={() => onFlowSelect(flow.id)}
                >
                  <div className='flow-name'>{flow.name}</div>
                  {flow.description && (
                    <div className='flow-description'>{flow.description}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
