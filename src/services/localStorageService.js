const STORAGE_KEY = 'twilio_flows';

class LocalStorageService {
  // Obtener todos los flujos guardados
  getAllFlows() {
    try {
      const flows = localStorage.getItem(STORAGE_KEY);
      return flows ? JSON.parse(flows) : {};
    } catch (error) {
      console.error('Error al obtener flujos:', error);
      return {};
    }
  }

  // Guardar un flujo
  saveFlow(flowData, customName = null) {
    try {
      const flows = this.getAllFlows();
      const flowId = Date.now().toString();
      const flowName = customName || flowData.friendly_name || `Flujo ${flowId}`;
      
      flows[flowId] = {
        id: flowId,
        name: flowName,
        data: flowData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(flows));
      return flowId;
    } catch (error) {
      console.error('Error al guardar flujo:', error);
      throw error;
    }
  }

  // Obtener un flujo específico
  getFlow(flowId) {
    try {
      const flows = this.getAllFlows();
      return flows[flowId] || null;
    } catch (error) {
      console.error('Error al obtener flujo:', error);
      return null;
    }
  }

  // Actualizar un flujo existente
  updateFlow(flowId, flowData) {
    try {
      const flows = this.getAllFlows();
      if (flows[flowId]) {
        flows[flowId].data = flowData;
        flows[flowId].updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(flows));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al actualizar flujo:', error);
      throw error;
    }
  }

  // Eliminar un flujo
  deleteFlow(flowId) {
    try {
      const flows = this.getAllFlows();
      if (flows[flowId]) {
        delete flows[flowId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(flows));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al eliminar flujo:', error);
      throw error;
    }
  }

  // Obtener lista de flujos para el sidebar
  getFlowsList() {
    try {
      const flows = this.getAllFlows();
      return Object.values(flows).map(flow => ({
        id: flow.id,
        name: flow.name,
        createdAt: flow.createdAt,
        updatedAt: flow.updatedAt
      }));
    } catch (error) {
      console.error('Error al obtener lista de flujos:', error);
      return [];
    }
  }
}

export default new LocalStorageService();