/**
 * Utilidad para transformar los datos de un flujo de Twilio Studio
 * en nodos y aristas compatibles con ReactFlow
 */

// Mapeo de tipos de widgets a colores basado en la documentación de Twilio Studio
const typeColors = {
  // Flow Control - Naranja
  'trigger': '#ff9800',
  'split-based-on': '#ff9800',
  'set-variables': '#ff9800',
  
  // Voice - Azul
  'say-play': '#2196f3',
  'gather-input-on-call': '#2196f3',
  'connect-call-to': '#2196f3',
  'make-outgoing-call': '#2196f3',
  'record-voicemail': '#2196f3',
  'call-recording': '#2196f3',
  'enqueue-call': '#2196f3',
  'capture-payments': '#2196f3',
  'fork-stream': '#2196f3',
  'connect-virtual-agent': '#2196f3',
  
  // Messaging - Verde
  'send-message': '#4caf50',
  'send-and-wait-for-reply': '#4caf50',
  
  // Tools & Code Execution - Rosa/Magenta
  'run-function': '#e91e63',
  'http-request': '#e91e63',
  'twiml-redirect': '#e91e63',
  
  // Connect Other Products - Púrpura
  'send-to-flex': '#9c27b0',
  'search-for-a-profile': '#9c27b0',
  
  // Subflows - Índigo
  'run-subflow': '#3f51b5',
  
  // Default
  'default': '#78909c'
};

/**
 * Calcula el layout automático de los nodos basándose en las conexiones
 * @param {Array} states - Estados del flujo
 * @param {string} initialState - Estado inicial del flujo
 * @returns {Object} - Mapa de posiciones para cada nodo
 */
const calculateAutoLayout = (states, initialState) => {
  const positions = {};
  const visited = new Set();
  const levels = {};
  const nodesByLevel = {};
  
  // Configuración del layout vertical
  const HORIZONTAL_SPACING = 300;
  const VERTICAL_SPACING = 250;
  const START_X = 50;
  const START_Y = 50;
  
  // Construir grafo de conexiones
  const connections = {};
  states.forEach(state => {
    connections[state.name] = [];
    if (state.transitions && Array.isArray(state.transitions)) {
      state.transitions.forEach(transition => {
        if (transition.next) {
          connections[state.name].push(transition.next);
        }
      });
    }
  });
  
  // Función recursiva para asignar niveles (BFS modificado)
  const assignLevels = (nodeName, level = 0) => {
    if (visited.has(nodeName) || !connections[nodeName]) return;
    
    visited.add(nodeName);
    levels[nodeName] = Math.max(levels[nodeName] || 0, level);
    
    if (!nodesByLevel[level]) nodesByLevel[level] = [];
    if (!nodesByLevel[level].includes(nodeName)) {
      nodesByLevel[level].push(nodeName);
    }
    
    // Procesar conexiones
    connections[nodeName].forEach(nextNode => {
      if (!visited.has(nextNode)) {
        assignLevels(nextNode, level + 1);
      }
    });
  };
  
  // Comenzar desde el estado inicial
  if (initialState && connections[initialState]) {
    assignLevels(initialState, 0);
  }
  
  // Procesar nodos no visitados (nodos desconectados)
  states.forEach(state => {
    if (!visited.has(state.name)) {
      assignLevels(state.name, Object.keys(nodesByLevel).length);
    }
  });
  
  // Calcular posiciones finales (layout vertical)
  Object.keys(nodesByLevel).forEach(level => {
    const nodesInLevel = nodesByLevel[level];
    const levelNum = parseInt(level);
    
    nodesInLevel.forEach((nodeName, index) => {
      const totalNodesInLevel = nodesInLevel.length;
      const centerOffset = (totalNodesInLevel - 1) * HORIZONTAL_SPACING / 2;
      
      positions[nodeName] = {
        x: START_X + (index * HORIZONTAL_SPACING) - centerOffset + (levelNum * 20), // Distribución horizontal
        y: START_Y + (levelNum * VERTICAL_SPACING) // Progresión vertical por niveles
      };
    });
  });
  
  return positions;
};

/**
 * Transforma los datos de un flujo de Twilio Studio en nodos y aristas para ReactFlow
 * @param {Object} flowData - Datos del flujo de Twilio Studio
 * @param {boolean} useAutoLayout - Si usar el layout automático o las posiciones originales
 * @returns {Object} - Objeto con nodos y aristas para ReactFlow
 */
export const transformFlowToNodesAndEdges = (flowData, useAutoLayout = true) => {
  if (!flowData || !flowData.states || !Array.isArray(flowData.states)) {
    throw new Error('Datos de flujo inválidos');
  }

  const nodes = [];
  const edges = [];
  const nodeMap = {};
  
  // Calcular posiciones automáticas si está habilitado
  const autoPositions = useAutoLayout ? 
    calculateAutoLayout(flowData.states, flowData.initial_state) : {};

  // Crear nodos a partir de los estados del flujo
  flowData.states.forEach((state) => {
    const { name, type, properties, transitions } = state;
    const originalOffset = properties?.offset || { x: 0, y: 0 };
    
    // Usar posición automática o la original
    const position = useAutoLayout && autoPositions[name] ? 
      autoPositions[name] : 
      { x: originalOffset.x, y: originalOffset.y };
    
    // Crear nodo
    const node = {
      id: name,
      type: 'studioFlowNode',
      position: position,
      data: { 
        label: name,
        type: type,
        properties: properties || {},
        transitions: transitions || []
      }
    };
    
    nodes.push(node);
    nodeMap[name] = node;
  });

  // Crear aristas a partir de las transiciones
  flowData.states.forEach((state) => {
    const { name, transitions } = state;
    
    if (transitions && Array.isArray(transitions)) {
      transitions.forEach((transition) => {
        const { event, next } = transition;
        
        if (next && nodeMap[next]) {
          const edge = {
            id: `${name}-${event}-${next}`,
            source: name,
            target: next,
            label: event,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#888' },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#888',
            },
          };
          
          edges.push(edge);
        }
      });
    }
  });

  return { nodes, edges };
};
// Importar MarkerType de @xyflow/react
import { MarkerType } from '@xyflow/react';
