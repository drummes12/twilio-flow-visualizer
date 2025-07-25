import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FlowVisualizer from './components/FlowVisualizer';
import WidgetEditor from './components/WidgetEditor';
import ImportFlow from './components/ImportFlow';
import Alert from './components/Alert';
import { exportFlowToJson, importFlowFromJson, validateFlowStructure } from './services/flowService';
import { getFlowData } from './data/sampleFlows';
import localStorageService from './services/localStorageService';
import './styles/App.css';
import './styles/FlowVisualizer.css';

const App = () => {
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [flowData, setFlowData] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [currentFlowId, setCurrentFlowId] = useState(null);
  const [savedFlows, setSavedFlows] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleFlowSelect = (flow) => {
    setSelectedFlow(flow);
    setSelectedWidget(null);
    
    // Si es un flujo guardado (tiene ID), cargarlo desde localStorage
    if (typeof flow === 'object' && flow.id) {
      const savedFlow = localStorageService.getFlow(flow.id);
      if (savedFlow) {
        setFlowData(savedFlow.data);
        setCurrentFlowId(flow.id);
        setSelectedFlow(savedFlow.name);
        return;
      }
    }
    
    // Si es un flujo de muestra, cargarlo normalmente
    try {
      const data = getFlowData(flow);
      setFlowData(data);
      setCurrentFlowId(null);
    } catch (error) {
      console.error('Error al cargar el flujo:', error);
      setFlowData(null);
      setCurrentFlowId(null);
    }
  };

  const handleWidgetSelect = (widget) => {
    setSelectedWidget(widget);
  };

  const handleWidgetSave = (updatedWidget) => {
    if (!flowData || !selectedWidget) return;

    // Actualizar el widget en los datos del flujo
    const updatedFlowData = { ...flowData };
    const widgetIndex = updatedFlowData.states.findIndex(state => state.name === selectedWidget.name);
    
    if (widgetIndex !== -1) {
      updatedFlowData.states[widgetIndex] = updatedWidget;
      setFlowData(updatedFlowData);
      
      // Si es un flujo guardado, actualizar automáticamente
      if (currentFlowId) {
        try {
          localStorageService.updateFlow(currentFlowId, updatedFlowData);
        } catch (error) {
          console.error('Error al actualizar flujo:', error);
        }
      }
    }
  };

  const handleExportFlow = () => {
    if (!flowData || !selectedFlow) return;
    exportFlowToJson(flowData, selectedFlow);
    addAlert({
      type: 'success',
      message: `Flujo ${selectedFlow} exportado correctamente`,
    });
  };
  
  const handleImportFlow = () => {
    setShowImportModal(true);
  };
  
  const handleImportComplete = (importedFlow, fileName = null) => {
    setShowImportModal(false);
    
    // Guardar automáticamente el flujo importado
    try {
      // Crear un nombre más descriptivo usando el nombre del archivo si está disponible
      let flowName;
      if (fileName) {
        // Remover la extensión .json del nombre del archivo
        const nameWithoutExtension = fileName.replace(/\.json$/i, '');
        flowName = importedFlow.friendly_name ? 
          `${importedFlow.friendly_name} (${nameWithoutExtension})` : 
          nameWithoutExtension;
      } else {
        flowName = importedFlow.friendly_name || `Flujo importado ${new Date().toLocaleString()}`;
      }
      
      // Actualizar el friendly_name en el flujo para que se guarde con el nuevo nombre
      const flowToSave = { ...importedFlow, friendly_name: flowName };
      
      const flowId = localStorageService.saveFlow(flowToSave);
      
      setFlowData(flowToSave);
      setSelectedFlow(flowName);
      setCurrentFlowId(flowId);
      
      // Actualizar la lista de flujos guardados
      loadSavedFlows();
      
      addAlert({
        type: 'success',
        message: 'Flujo importado y guardado correctamente',
      });
    } catch (error) {
      console.error('Error al guardar flujo importado:', error);
      setFlowData(importedFlow);
      setSelectedFlow('Flujo importado');
      setCurrentFlowId(null);
      addAlert({
        type: 'warning',
        message: 'Flujo importado pero no se pudo guardar',
      });
    }
  };
  
  const handleImportCancel = () => {
    setShowImportModal(false);
  };
  
  // Sistema de alertas
  const addAlert = (alert) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { ...alert, id }]);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
      removeAlert(id);
    }, 5000);
  };
  
  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };
  
  // Cargar flujos guardados
  const loadSavedFlows = () => {
    const flows = localStorageService.getFlowsList();
    setSavedFlows(flows);
  };
  
  // Funciones para los botones del header
  const handleSaveTemp = () => {
    if (!flowData) return;
    
    try {
      const flowId = localStorageService.saveFlow(flowData);
      setCurrentFlowId(flowId);
      loadSavedFlows();
      addAlert({
        type: 'success',
        message: 'Flujo guardado temporalmente',
      });
    } catch (error) {
      addAlert({
        type: 'error',
        message: 'Error al guardar el flujo',
      });
    }
  };
  
  const handleSaveChanges = () => {
    if (!flowData || !currentFlowId) return;
    
    try {
      localStorageService.updateFlow(currentFlowId, flowData);
      addAlert({
        type: 'success',
        message: 'Cambios guardados',
      });
    } catch (error) {
      addAlert({
        type: 'error',
        message: 'Error al guardar cambios',
      });
    }
  };
  
  const handleDeleteFlow = () => {
    if (!currentFlowId) return;
    
    if (window.confirm('¿Estás seguro de que quieres eliminar este flujo?')) {
      try {
        localStorageService.deleteFlow(currentFlowId);
        setCurrentFlowId(null);
        setFlowData(null);
        setSelectedFlow(null);
        loadSavedFlows();
        addAlert({
          type: 'success',
          message: 'Flujo eliminado',
        });
      } catch (error) {
        addAlert({
          type: 'error',
          message: 'Error al eliminar el flujo',
        });
      }
    }
  };
  
  const handleDeleteFlowFromSidebar = (flowId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este flujo?')) {
      try {
        localStorageService.deleteFlow(flowId);
        
        // Si el flujo eliminado es el actual, limpiar la selección
        if (currentFlowId === flowId) {
          setCurrentFlowId(null);
          setFlowData(null);
          setSelectedFlow(null);
        }
        
        loadSavedFlows();
        addAlert({
          type: 'success',
          message: 'Flujo eliminado',
        });
      } catch (error) {
        addAlert({
          type: 'error',
          message: 'Error al eliminar el flujo',
        });
      }
    }
  };
  
  // Funciones para drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Solo ocultar si realmente salimos del área de la app
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const jsonFiles = files.filter(file => file.type === 'application/json' || file.name.endsWith('.json'));
    
    if (jsonFiles.length === 0) {
      addAlert({
        type: 'warning',
        message: 'Por favor arrastra un archivo JSON válido',
      });
      return;
    }
    
    // Procesar el primer archivo JSON encontrado
    const file = jsonFiles[0];
    
    try {
      const flowData = await importFlowFromJson(file);
      
      // Validar la estructura del flujo
      if (!validateFlowStructure(flowData)) {
        addAlert({
          type: 'error',
          message: 'El archivo JSON no tiene la estructura correcta de un flujo de Twilio Studio',
        });
        return;
      }
      
      // Procesar como importación exitosa, pasando el nombre del archivo
      handleImportComplete(flowData, file.name);
      
    } catch (error) {
      addAlert({
        type: 'error',
        message: `Error al procesar el archivo: ${error.message}`,
      });
    }
  };

  // Cargar flujos guardados al inicializar
  useEffect(() => {
    loadSavedFlows();
  }, []);

  return (
    <div 
      className={`app ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Header 
        onExport={handleExportFlow} 
        onImport={handleImportFlow}
        onSaveTemp={handleSaveTemp}
        onSaveChanges={handleSaveChanges}
        onDeleteFlow={handleDeleteFlow}
        flowSelected={!!selectedFlow}
        hasCurrentFlow={!!currentFlowId}
      />
      <div className="main-content">
        <Sidebar
          onFlowSelect={handleFlowSelect}
          selectedFlow={selectedFlow}
          savedFlows={savedFlows}
          onDeleteFlow={handleDeleteFlowFromSidebar}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        {selectedWidget && (
          <WidgetEditor 
            widget={selectedWidget} 
            onSave={handleWidgetSave}
            onClose={() => setSelectedWidget(null)}
          />
        )}
        <div className="visualizer-container">
          <FlowVisualizer 
            flowData={flowData} 
            onWidgetSelect={handleWidgetSelect} 
            selectedWidget={selectedWidget}
          />
        </div>
      </div>
      
      {/* Modal de importación */}
      {showImportModal && (
        <ImportFlow 
          onImportComplete={handleImportComplete}
          onCancel={handleImportCancel}
        />
      )}
      
      {/* Sistema de alertas */}
      <div className="alerts-container">
        {alerts.map(alert => (
          <Alert
            key={alert.id}
            type={alert.type}
            message={alert.message}
            onClose={() => removeAlert(alert.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;