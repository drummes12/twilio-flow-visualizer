/**
 * Servicio para manejar la carga y guardado de archivos de flujo
 */

/**
 * Carga un archivo de flujo desde la ruta especificada
 * @param {string} filePath - Ruta del archivo a cargar
 * @returns {Promise<Object>} - Datos del flujo en formato JSON
 */
export const loadFlowFile = async (filePath) => {
  try {
    // En un entorno real, esto podría ser una llamada a una API o un servicio de backend
    // Para este ejemplo, simulamos la carga del archivo
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Error al cargar el archivo: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al cargar el archivo de flujo:', error);
    throw error;
  }
};

/**
 * Guarda un archivo de flujo en la ruta especificada
 * @param {string} filePath - Ruta donde guardar el archivo
 * @param {Object} flowData - Datos del flujo a guardar
 * @returns {Promise<boolean>} - Indica si el guardado fue exitoso
 */
export const saveFlowFile = async (filePath, flowData) => {
  try {
    // En un entorno real, esto podría ser una llamada a una API o un servicio de backend
    // Para este ejemplo, simulamos el guardado del archivo
    const jsonString = JSON.stringify(flowData, null, 2);
    
    // En un entorno de navegador, podemos ofrecer la descarga del archivo
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filePath.split('/').pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error al guardar el archivo de flujo:', error);
    throw error;
  }
};

/**
 * Obtiene la lista de archivos de flujo disponibles
 * @returns {Promise<Array<string>>} - Lista de nombres de archivos de flujo
 */
export const getAvailableFlows = async () => {
  try {
    // En un entorno real, esto podría ser una llamada a una API o un servicio de backend
    // Para este ejemplo, devolvemos una lista estática
    return [
      'Chat Flow.json',
      'IVR-MPW-MX-OMNI.json',
      'IVR-MPW-MX.json',
      'Messaging Flow.json',
      'Voice IVR.json',
      'WA-MPW-CHATBOT-MX.json'
    ];
  } catch (error) {
    console.error('Error al obtener la lista de flujos disponibles:', error);
    throw error;
  }
};