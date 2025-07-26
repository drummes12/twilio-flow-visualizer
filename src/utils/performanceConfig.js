// Configuración de rendimiento para flujos grandes
export const PERFORMANCE_CONFIG = {
  // Límites para activar optimizaciones
  LARGE_FLOW_NODE_THRESHOLD: 70,
  VERY_LARGE_FLOW_NODE_THRESHOLD: 100,

  // Configuraciones de ReactFlow optimizadas
  OPTIMIZED_REACT_FLOW_PROPS: {
    // Desactivar características costosas en flujos grandes
    zoomOnDoubleClick: false,
    selectNodesOnDrag: false,
    preventScrolling: false,

    // Configuración de viewport optimizada
    defaultViewport: { x: 0, y: 0, zoom: 0.8 },
    minZoom: 0.1,
    maxZoom: 1.5
  },

  // Configuraciones de Background optimizadas
  BACKGROUND_CONFIG: {
    small: { gap: 16, size: 1 },
    medium: { gap: 24, size: 1 },
    large: { gap: 32, size: 1 }
  },

  // Configuraciones de animaciones
  ANIMATION_CONFIG: {
    // Duraciones reducidas para mejor rendimiento
    fast: '0.1s',
    normal: '0.15s',
    slow: '0.2s'
  }
}

// Función para determinar el nivel de optimización basado en el número de nodos
export const getOptimizationLevel = (nodeCount) => {
  if (nodeCount < PERFORMANCE_CONFIG.LARGE_FLOW_NODE_THRESHOLD) {
    return 'normal'
  } else if (nodeCount < PERFORMANCE_CONFIG.VERY_LARGE_FLOW_NODE_THRESHOLD) {
    return 'optimized'
  } else {
    return 'aggressive'
  }
}

// Función para obtener configuración de background basada en el número de nodos
export const getBackgroundConfig = (nodeCount) => {
  const level = getOptimizationLevel(nodeCount)

  switch (level) {
    case 'normal':
      return PERFORMANCE_CONFIG.BACKGROUND_CONFIG.small
    case 'optimized':
      return PERFORMANCE_CONFIG.BACKGROUND_CONFIG.medium
    case 'aggressive':
      return PERFORMANCE_CONFIG.BACKGROUND_CONFIG.large
    default:
      return PERFORMANCE_CONFIG.BACKGROUND_CONFIG.medium
  }
}

// Función para determinar si mostrar el minimap
export const shouldShowMinimap = (nodeCount, userPreference) => {
  if (!userPreference) return false
  return nodeCount < PERFORMANCE_CONFIG.LARGE_FLOW_NODE_THRESHOLD
}

// Función para determinar si activar efectos de resaltado de aristas
export const shouldHighlightEdges = (nodeCount) => {
  return nodeCount < PERFORMANCE_CONFIG.VERY_LARGE_FLOW_NODE_THRESHOLD
}
