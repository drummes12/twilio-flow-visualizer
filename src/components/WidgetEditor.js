import React, { useState, useEffect } from 'react'
import { JsonEditor, githubDarkTheme } from 'json-edit-react'

const WidgetEditor = ({ widget, onSave, onClose }) => {
  const [widgetData, setWidgetData] = useState(null)
  const [jsonError, setJsonError] = useState(null)

  useEffect(() => {
    if (widget) {
      // Crear una copia profunda del widget para evitar mutaciones
      setWidgetData(JSON.parse(JSON.stringify(widget)))
      setJsonError(null)
    }
  }, [widget])

  const handleJsonChange = (edit) => {
    try {
      setWidgetData(edit.updated_src)
      setJsonError(null)
    } catch (error) {
      setJsonError('Error al procesar el JSON: ' + error.message)
    }
  }

  const handleSave = () => {
    if (jsonError) return
    onSave(widgetData)
  }

  if (!widget) {
    return (
      <div className='widget-editor'>
        <div className='no-flow-selected'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z'></path>
          </svg>
          <h3>Ningún widget seleccionado</h3>
          <p>Haz clic en un widget en el visualizador para editarlo</p>
        </div>
      </div>
    )
  }

  return (
    <div className='widget-editor'>
      <div className='widget-editor-header'>
        <h2>
          Editor de Widget
          <button
            className='btn btn-close'
            onClick={onClose}
            title="Cerrar editor"
          >
            ×
          </button>
        </h2>
        <div className='widget-type-badge'>Tipo: {widget.type}</div>
        {jsonError && <div className='alert alert-danger'>{jsonError}</div>}
      </div>

      <div className='widget-form'>
        {widgetData && (
          <JsonEditor
            theme={githubDarkTheme}
            data={widgetData}
            setData={setWidgetData}
            onUpdate={(data) => {
              setWidgetData(data.updated_src)
              setJsonError(null)
            }}
            onError={(error) => {
              setJsonError('Error en el JSON: ' + error.message)
            }}
          />
        )}
      </div>

      <div className='widget-actions'>
        <button
          className='btn btn-reset'
          onClick={() => setWidgetData(JSON.parse(JSON.stringify(widget)))}
        >
          Restablecer
        </button>
        <button className='btn btn-save' onClick={handleSave} disabled={!!jsonError}>
          Guardar cambios
        </button>
      </div>
    </div>
  )
}

export default WidgetEditor
