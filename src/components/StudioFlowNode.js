import React from 'react'
import { Handle, Position } from '@xyflow/react'
import '../styles/StudioFlowNode.css'

// Mapeo de tipos de widgets a nombres amigables
const WidgetFriendlyNames = {
  // Flow Control
  trigger: 'Disparador',
  'split-based-on': 'División Condicional',
  'set-variables': 'Establecer Variables',

  // Voice
  'say-play': 'Reproducir/Decir',
  'gather-input-on-call': 'Recopilar Entrada',
  'connect-call-to': 'Conectar Llamada',
  'make-outgoing-call': 'Llamada Saliente',
  'record-voicemail': 'Grabar Buzón',
  'call-recording': 'Grabación de Llamada',
  'enqueue-call': 'Encolar Llamada',
  'capture-payments': 'Capturar Pagos',
  'fork-stream': 'Bifurcar Stream',
  'connect-virtual-agent': 'Agente Virtual',

  // Messaging
  'send-message': 'Enviar Mensaje',
  'send-and-wait-for-reply': 'Enviar y Esperar',

  // Tools & Code Execution
  'run-function': 'Ejecutar Función',
  'http-request': 'Petición HTTP',
  'twiml-redirect': 'Redirección TwiML',

  // Connect Other Products
  'send-to-flex': 'Enviar a Flex',
  'search-for-a-profile': 'Buscar Perfil',

  // Subflows
  'run-subflow': 'Ejecutar Subflujo',

  // Default
  default: 'Widget'
}

// Iconos para los diferentes tipos de nodos
const NodeIcons = {
  trigger: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <polygon points='5 3 19 12 5 21 5 3'></polygon>
    </svg>
  ),
  'send-to-flex': (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'></path>
    </svg>
  ),
  'gather-input-on-call': (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'></path>
      <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'></path>
    </svg>
  ),
  'split-based-on': (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M6 3v12'></path>
      <path d='M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'></path>
      <path d='M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'></path>
      <path d='M15 6a9 9 0 0 1 0 12'></path>
      <path d='M18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'></path>
      <path d='M6 15v-3a6 6 0 0 1 6-6h6'></path>
    </svg>
  ),
  'set-variables': (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34'></path>
      <polygon points='18 2 22 6 12 16 8 16 8 12 18 2'></polygon>
    </svg>
  ),
  'run-function': (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <polyline points='16 18 22 12 16 6'></polyline>
      <polyline points='8 6 2 12 8 18'></polyline>
    </svg>
  ),
  'send-message': (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'></path>
    </svg>
  ),
  'run-subflow': (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M5 12h14'></path>
      <path d='M12 5v14'></path>
    </svg>
  ),
  'say-play': (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <polygon points='11 5 6 9 2 9 2 15 6 15 11 19 11 5'></polygon>
      <path d='M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07'></path>
    </svg>
  ),
  'connect-call-to': (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'></path>
      <path d='M14.05 2a9 9 0 0 1 8 7.94'></path>
      <path d='M14.05 6A5 5 0 0 1 18 10'></path>
    </svg>
  ),
  'http-request': (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='12' cy='12' r='10'></circle>
      <path d='M8 14s1.5 2 4 2 4-2 4-2'></path>
      <line x1='9' y1='9' x2='9.01' y2='9'></line>
      <line x1='15' y1='9' x2='15.01' y2='9'></line>
    </svg>
  ),
  'send-and-wait-for-reply': (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'></path>
      <circle cx='12' cy='11' r='1'></circle>
      <circle cx='8' cy='11' r='1'></circle>
      <circle cx='16' cy='11' r='1'></circle>
    </svg>
  ),
  default: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <rect x='3' y='3' width='18' height='18' rx='2' ry='2'></rect>
    </svg>
  )
}

const StudioFlowNode = ({ data }) => {
  const { label, type } = data
  const icon = NodeIcons[type] || NodeIcons.default
  const friendlyName = WidgetFriendlyNames[type] || WidgetFriendlyNames.default

  return (
    <div className='studio-flow-node' data-type={type}>
      <Handle type='target' position={Position.Top} />
      <div className='node-header'>
        <div className='node-icon'>{icon}</div>
        <div className='node-type-friendly'>{friendlyName}</div>
      </div>
      <div className='node-content'>
        <div className='node-label'>{label}</div>
        <div className='node-type-small'>{type}</div>
      </div>
      <Handle type='source' position={Position.Bottom} />
    </div>
  )
}

export default StudioFlowNode
