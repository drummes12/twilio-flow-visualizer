import React, { useState, useEffect, useRef } from 'react'
import '../styles/JSONEditor.css'

const JSONEditor = ({ flowData, onSave, onClose }) => {
  const [jsonContent, setJsonContent] = useState('')
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState('')
  const [hasChanges, setHasChanges] = useState(false)
  const textareaRef = useRef(null)
  const [lineNumbers, setLineNumbers] = useState([])

  useEffect(() => {
    if (flowData) {
      const formatted = JSON.stringify(flowData, null, 2)
      setJsonContent(formatted)
      updateLineNumbers(formatted)
      setHasChanges(false)
    }
  }, [flowData])

  const updateLineNumbers = (content) => {
    const lines = content.split('\n')
    setLineNumbers(lines.map((_, index) => index + 1))
  }

  const handleContentChange = (e) => {
    const newContent = e.target.value
    setJsonContent(newContent)
    updateLineNumbers(newContent)
    setHasChanges(true)

    // Validar JSON en tiempo real
    try {
      JSON.parse(newContent)
      setIsValid(true)
      setError('')
    } catch (err) {
      setIsValid(false)
      setError(err.message)
    }
  }

  const handleSave = () => {
    if (!isValid) {
      return
    }

    try {
      const parsedData = JSON.parse(jsonContent)
      onSave(parsedData)
      setHasChanges(false)
    } catch (err) {
      setError('Error al parsear JSON: ' + err.message)
      setIsValid(false)
    }
  }

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonContent)
      const formatted = JSON.stringify(parsed, null, 2)
      setJsonContent(formatted)
      updateLineNumbers(formatted)
      setIsValid(true)
      setError('')
    } catch (err) {
      setError('No se puede formatear JSON inválido')
    }
  }

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(jsonContent)
      const minified = JSON.stringify(parsed)
      setJsonContent(minified)
      updateLineNumbers(minified)
      setIsValid(true)
      setError('')
    } catch (err) {
      setError('No se puede minificar JSON inválido')
    }
  }

  const handleKeyDown = (e) => {
    // Atajos de teclado
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault()
          if (isValid) handleSave()
          break
        case 'f':
          e.preventDefault()
          handleFormat()
          break
        default:
          break
      }
    }

    // Auto-indentación
    if (e.key === 'Enter') {
      const textarea = e.target
      const start = textarea.selectionStart
      const beforeCursor = jsonContent.substring(0, start)
      const afterCursor = jsonContent.substring(start)

      // Contar espacios de indentación de la línea actual
      const lines = beforeCursor.split('\n')
      const currentLine = lines[lines.length - 1]
      const indent = currentLine.match(/^\s*/)[0]

      // Si la línea termina con { o [, agregar indentación extra
      const needsExtraIndent =
        currentLine.trim().endsWith('{') || currentLine.trim().endsWith('[')
      const newIndent = needsExtraIndent ? indent + '  ' : indent

      e.preventDefault()
      const newContent = beforeCursor + '\n' + newIndent + afterCursor
      setJsonContent(newContent)
      updateLineNumbers(newContent)
      setHasChanges(true)

      // Posicionar cursor
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd =
          start + 1 + newIndent.length
      }, 0)
    }
  }

  const handleScroll = () => {
    const textarea = textareaRef.current
    const lineNumbersEl = document.querySelector('.line-numbers')
    if (textarea && lineNumbersEl) {
      lineNumbersEl.scrollTop = textarea.scrollTop
    }
  }

  return (
    <div className='json-editor-overlay'>
      <div className='json-editor'>
        <div className='json-editor-header'>
          <div className='editor-title'>
            <svg
              className='icon'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
            >
              <path d='M0 0h24v24H0z' stroke='none' />
              <path d='M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1' />
              <path d='M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3l8.385-8.415zM16 5l3 3' />
            </svg>
            <h2>Editor JSON del Flujo</h2>
            {hasChanges && <span className='changes-indicator'>•</span>}
          </div>

          <div className='editor-actions'>
            <button
              className='btn btn-secondary'
              onClick={handleFormat}
              title='Formatear JSON (Ctrl+F)'
            >
              <svg
                className='icon'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M3 17V19H9V17H3M3 5V7H13V5H3M13 21V19H21V21H13M7 9V11H21V9H7M7 13V15H21V13H7Z'
                  fill='currentColor'
                />
              </svg>
              Formatear
            </button>

            <button
              className='btn btn-secondary'
              onClick={handleMinify}
              title='Minificar JSON'
            >
              <svg
                className='icon'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M19,17H22V19H19V17M19,3H22V5H19V3M3,5H6V3H3V5M3,19H6V17H3V19M5,6H19V8H5V6M5,16H14V18H5V16M5,10H19V12H5V10Z'
                  fill='currentColor'
                />
              </svg>
              Minificar
            </button>

            <button
              className={`btn btn-primary ${
                !isValid || !hasChanges ? 'disabled' : ''
              }`}
              onClick={handleSave}
              disabled={!isValid || !hasChanges}
              title='Guardar cambios (Ctrl+S)'
            >
              <svg
                className='icon'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3M19 19H5V5H16.17L19 7.83V19M12 12C13.66 12 15 13.34 15 15S13.66 18 12 18 9 16.66 9 15 10.34 12 12 12M6 6H15V10H6V6Z'
                  fill='currentColor'
                />
              </svg>
              Guardar
            </button>

            <button
              className='btn btn-close'
              onClick={onClose}
              title='Cerrar editor'
            >
              <svg
                className='icon'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z'
                  fill='currentColor'
                />
              </svg>
            </button>
          </div>
        </div>

        {error && (
          <div className='json-error'>
            <svg
              className='icon'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z'
                fill='currentColor'
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className='json-editor-content'>
          <div className='line-numbers'>
            {lineNumbers.map((num) => (
              <div key={num} className='line-number'>
                {num}
              </div>
            ))}
          </div>

          <textarea
            ref={textareaRef}
            className={`json-textarea ${!isValid ? 'invalid' : ''}`}
            value={jsonContent}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            spellCheck={false}
            placeholder='Ingresa o pega tu JSON aquí...'
          />
        </div>

        <div className='json-editor-footer'>
          <div className='editor-info'>
            <span className={`status ${isValid ? 'valid' : 'invalid'}`}>
              {isValid ? '✓ JSON válido' : '✗ JSON inválido'}
            </span>
            <span className='stats'>
              Líneas: {lineNumbers.length} | Caracteres: {jsonContent.length}
            </span>
          </div>

          <div className='keyboard-shortcuts'>
            <span>Ctrl+S: Guardar</span>
            <span>Ctrl+F: Formatear</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JSONEditor
