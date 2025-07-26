import React, { useEffect, useState, useCallback, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  ReactFlowProvider,
  useReactFlow
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { transformFlowToNodesAndEdges } from '../utils/flowTransformer'
import {
  getBackgroundConfig,
  shouldShowMinimap,
  shouldHighlightEdges,
  getOptimizationLevel
} from '../utils/performanceConfig'
import FlowToolbar from './FlowToolbar'
import NodeDetails from './NodeDetails'
import Spinner from './Spinner'
import EmptyState, { EmptyDocumentIcon } from './EmptyState'
import StudioFlowNode from './StudioFlowNode'

// Definir los tipos de nodos personalizados
const nodeTypes = {
  studioFlowNode: StudioFlowNode
}

const FlowVisualizerContent = ({
  flowData,
  onWidgetSelect,
  selectedWidget
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [loading, setLoading] = useState(false)
  const [selectedNode, setSelectedNode] = useState(null)
  const [showNodeDetails, setShowNodeDetails] = useState(false)
  const [showMinimap, setShowMinimap] = useState(true)
  const [useAutoLayout, setUseAutoLayout] = useState(true)

  const reactFlowInstance = useReactFlow()
  const reactFlowWrapper = useRef(null)
  const prevFlowDataRef = useRef()

  useEffect(() => {
    if (!flowData) {
      setNodes([])
      setEdges([])
      return
    }

    // Solo mostrar loading cuando cambian los datos del flujo, no el layout
    const isFlowDataChange = prevFlowDataRef.current !== flowData
    if (isFlowDataChange) {
      setLoading(true)
      prevFlowDataRef.current = flowData
    }

    try {
      const { nodes: transformedNodes, edges: transformedEdges } =
        transformFlowToNodesAndEdges(flowData, useAutoLayout)

      setNodes(transformedNodes)
      setEdges(transformedEdges)

      // Ajustar la vista después de renderizar
      setTimeout(() => {
        if (reactFlowInstance && transformedNodes.length > 0) {
          reactFlowInstance.fitView({ padding: 0.1 })
        }
        if (isFlowDataChange) {
          setLoading(false)
        }
      }, 100)
    } catch (error) {
      console.error('Error transforming flow data:', error)
      if (isFlowDataChange) {
        setLoading(false)
      }
    }
  }, [flowData, useAutoLayout, reactFlowInstance, setNodes, setEdges])

  // Efecto para cerrar NodeDetails cuando cambie el flujo
  useEffect(() => {
    setSelectedNode(null)
    setShowNodeDetails(false)
  }, [flowData])

  const handleNodeClick = (event, node) => {
    // Solo mostrar detalles del nodo, no abrir el editor directamente
    setSelectedNode(node)
    setShowNodeDetails(true)
  }

  // Efecto para resaltar las conexiones del nodo seleccionado (optimizado)
  useEffect(() => {
    // Solo actualizar si el rendimiento lo permite
    if (!shouldHighlightEdges(nodes.length)) return

    if (!selectedNode) {
      // Restaurar estilos normales de todas las aristas
      setEdges((currentEdges) =>
        currentEdges.map((edge) => ({
          ...edge,
          style: { stroke: '#888', strokeWidth: 2 },
          animated: false, // Desactivar animaciones para mejor rendimiento
          className: 'edge-normal'
        }))
      )
      return
    }

    // Resaltar aristas conectadas al nodo seleccionado
    setEdges((currentEdges) =>
      currentEdges.map((edge) => {
        const isConnected =
          edge.source === selectedNode.id || edge.target === selectedNode.id
        return {
          ...edge,
          style: isConnected
            ? { stroke: '#f22f46', strokeWidth: 3 }
            : { stroke: '#444', strokeWidth: 1, opacity: 0.3 },
          animated: false, // Desactivar animaciones para mejor rendimiento
          className: isConnected ? 'edge-connected' : 'edge-disconnected'
        }
      })
    )
  }, [selectedNode, setEdges, nodes.length])

  const handleCloseNodeDetails = () => {
    setShowNodeDetails(false)
    setSelectedNode(null)
  }

  const handleEditNode = (node) => {
    // Buscar el widget correspondiente y abrirlo en el editor
    if (!flowData) return

    const widget = flowData.states.find(
      (state) => state.name === node.data.label
    )
    if (widget) {
      onWidgetSelect(widget)
      // Mantener el panel de detalles abierto
    }
  }

  // Funciones para la barra de herramientas
  const handleZoomIn = () => {
    reactFlowInstance.zoomIn()
  }

  const handleZoomOut = () => {
    reactFlowInstance.zoomOut()
  }

  const handleZoomReset = () => {
    reactFlowInstance.setViewport({ x: 0, y: 0, zoom: 1 })
  }

  const handleFitView = () => {
    reactFlowInstance.fitView()
  }

  const handleToggleMinimap = () => {
    setShowMinimap(!showMinimap)
  }

  const handleToggleLayout = useCallback(() => {
    setUseAutoLayout(!useAutoLayout)
  }, [useAutoLayout])

  const handlePaneClick = () => {
    // Limpiar selección al hacer clic en el fondo
    setSelectedNode(null)
    setShowNodeDetails(false)
  }

  if (!flowData) {
    return (
      <div className='flow-visualizer'>
        <EmptyState
          title='Selecciona un flujo para visualizar'
          message='Elige un flujo de la lista en el panel lateral'
          icon={<EmptyDocumentIcon />}
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className='flow-visualizer'>
        <div className='flow-loading'>
          <Spinner size='large' text='Cargando visualización del flujo...' />
        </div>
      </div>
    )
  }

  return (
    <div className='flow-visualizer' ref={reactFlowWrapper}>
      <div className='flow-container'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          fitView
          nodeTypes={nodeTypes}
          proOptions={{ hideAttribution: true }}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.1}
          maxZoom={2}
          deleteKeyCode={null}
          multiSelectionKeyCode={null}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          preventScrolling={false}
          zoomOnDoubleClick={false}
          panOnDrag={true}
          selectNodesOnDrag={false}
        >
          <Background
            color='#f8f8f8'
            gap={getBackgroundConfig(nodes.length).gap}
            size={getBackgroundConfig(nodes.length).size}
          />
          {shouldShowMinimap(nodes.length, showMinimap) && (
            <MiniMap
              nodeStrokeColor={(n) => {
                if (n.data?.label === selectedWidget?.name)
                  return 'rgba(242, 47, 70, 1)'
                return 'rgba(125, 125, 125, 0.8)'
              }}
              nodeColor={(n) => {
                if (n.data?.label === selectedWidget?.name)
                  return 'rgba(242, 47, 70, 0.2)'
                return 'rgba(125, 125, 125, 0.6)'
              }}
              maskColor='rgba(242, 47, 70, 0.15)'
            />
          )}
          <FlowToolbar
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onZoomReset={handleZoomReset}
            onFitView={handleFitView}
            onToggleMinimap={handleToggleMinimap}
            minimapVisible={showMinimap}
            onToggleLayout={handleToggleLayout}
            useAutoLayout={useAutoLayout}
          />
        </ReactFlow>

        {showNodeDetails && selectedNode && (
          <NodeDetails
            node={selectedNode}
            onClose={handleCloseNodeDetails}
            onEdit={handleEditNode}
          />
        )}

        {/* Indicador de optimización para flujos grandes */}
        {getOptimizationLevel(nodes.length) !== 'normal' && (
          <div className='performance-indicator'>
            <span className='performance-icon'>⚡</span>
            <span className='performance-text'>
              Modo optimizado activo ({nodes.length} widgets)
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente contenedor que proporciona el contexto de ReactFlow
const FlowVisualizer = (props) => {
  return (
    <ReactFlowProvider>
      <FlowVisualizerContent {...props} />
    </ReactFlowProvider>
  )
}

export default FlowVisualizer
