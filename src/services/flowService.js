/**
 * Servicio para manejar la exportación e importación de flujos
 */

/**
 * Exporta un flujo a formato JSON
 * @param {Object} flowData - Datos del flujo a exportar
 * @param {string} fileName - Nombre del archivo a generar
 * @returns {void}
 */
export const exportFlowToJson = (flowData, fileName) => {
  try {
    const jsonString = JSON.stringify(flowData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'studio-flow.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al exportar el flujo:', error);
    throw error;
  }
};

/**
 * Importa un flujo desde un archivo JSON
 * @param {File} file - Archivo a importar
 * @returns {Promise<Object>} - Datos del flujo importado
 */
export const importFlowFromJson = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const flowData = JSON.parse(event.target.result);
        resolve(flowData);
      } catch (error) {
        reject(new Error('El archivo no contiene un JSON válido'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Valida que un objeto tenga la estructura correcta de un flujo de Twilio Studio
 * @param {Object} flowData - Datos del flujo a validar
 * @returns {boolean} - Indica si el flujo es válido
 */
export const validateFlowStructure = (flowData) => {
  // Verificar que tenga las propiedades básicas de un flujo de Twilio Studio
  if (!flowData || typeof flowData !== 'object') return false;
  if (!flowData.states || !Array.isArray(flowData.states)) return false;
  if (!flowData.initial_state || typeof flowData.initial_state !== 'string') return false;
  
  // Verificar que cada estado tenga las propiedades necesarias
  for (const state of flowData.states) {
    if (!state.name || typeof state.name !== 'string') return false;
    if (!state.type || typeof state.type !== 'string') return false;
    if (!state.properties || typeof state.properties !== 'object') return false;
    if (!state.transitions || !Array.isArray(state.transitions)) return false;
  }
  
  return true;
};

/**
 * Encuentra un widget (estado) por su nombre en los datos del flujo
 * @param {Object} flowData - Datos del flujo
 * @param {string} widgetName - Nombre del widget a buscar
 * @returns {Object|null} - Widget encontrado o null si no existe
 */
export const findWidgetByName = (flowData, widgetName) => {
  if (!flowData || !flowData.states || !Array.isArray(flowData.states)) return null;
  
  return flowData.states.find(state => state.name === widgetName) || null;
};

/**
 * Actualiza un widget (estado) en los datos del flujo
 * @param {Object} flowData - Datos del flujo
 * @param {Object} updatedWidget - Widget actualizado
 * @returns {Object} - Datos del flujo actualizados
 */
export const updateWidgetInFlow = (flowData, updatedWidget) => {
  if (!flowData || !flowData.states || !Array.isArray(flowData.states)) {
    throw new Error('Datos de flujo inválidos');
  }
  
  if (!updatedWidget || !updatedWidget.name) {
    throw new Error('Widget inválido');
  }
  
  const updatedFlowData = { ...flowData };
  const widgetIndex = updatedFlowData.states.findIndex(state => state.name === updatedWidget.name);
  
  if (widgetIndex === -1) {
    throw new Error(`Widget "${updatedWidget.name}" no encontrado en el flujo`);
  }
  
  updatedFlowData.states[widgetIndex] = updatedWidget;
  
  return updatedFlowData;
};