import React from 'react';

const Header = ({ onExport, onImport, onOpenJSONEditor, flowSelected }) => {
  return (
    <header className='header'>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src='/icon.svg' alt='logo' style={{ height: '40px' }} />
        <h1>Twilio Studio Flow Visualizer</h1>
      </div>
      <div className='header-actions'>
        <button
          className='btn btn-json-editor'
          onClick={onOpenJSONEditor}
          disabled={!flowSelected}
          title={
            !flowSelected ? 'Selecciona un flujo primero' : 'Abrir editor JSON'
          }
        >
          <svg
            className='icon'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M0 0h24v24H0z' stroke='none' />
            <path d='M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1' />
            <path d='M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3l8.385-8.415zM16 5l3 3' />
          </svg>
          Editor JSON
        </button>
        <button
          className='btn btn-export'
          onClick={onExport}
          disabled={!flowSelected}
          title={
            !flowSelected ? 'Selecciona un flujo primero' : 'Exportar flujo'
          }
        >
          <svg
            className='icon'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M12 16L7 11L8.4 9.6L11 12.2V4H13V12.2L15.6 9.6L17 11L12 16Z'
              fill='currentColor'
            />
            <path d='M5 20V18H19V20H5Z' fill='currentColor' />
          </svg>
          Exportar JSON
        </button>
        <button
          className='btn btn-import'
          onClick={onImport}
          title='Importar flujo desde archivo JSON'
        >
          <svg
            className='icon'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M12 8L17 13L15.6 14.4L13 11.8V20H11V11.8L8.4 14.4L7 13L12 8Z'
              fill='currentColor'
            />
            <path d='M19 4V6H5V4H19Z' fill='currentColor' />
          </svg>
          Importar JSON
        </button>
      </div>
    </header>
  )
};

export default Header;