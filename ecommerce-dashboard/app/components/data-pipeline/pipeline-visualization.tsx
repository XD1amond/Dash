"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, RefreshCw, Filter } from "lucide-react"

interface DataNode {
  id: string
  name: string
  type: string
  status: string
  inputs: string[]
  outputs: string[]
  position: { x: number; y: number }
}

interface DataConnection {
  id: string
  source: string
  target: string
  label?: string
}

interface DataFlow {
  nodes: DataNode[]
  connections: DataConnection[]
}

interface PipelineVisualizationProps {
  dataFlow: DataFlow
  onExport?: (format: string) => void
  onRefresh?: () => void
  onNodeClick?: (id: string) => void
  onConnectionClick?: (id: string) => void
  onFilterChange?: (filter: string) => void
}

export function PipelineVisualization({
  dataFlow,
  onExport,
  onRefresh,
  onNodeClick,
  onConnectionClick,
  onFilterChange
}: PipelineVisualizationProps) {
  const [filter, setFilter] = useState<string>("all")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null)
  
  // Calculate node positions and sizes
  const nodeWidth = 150
  const nodeHeight = 60
  const horizontalSpacing = 200
  const verticalSpacing = 100
  
  // Draw the pipeline visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size to match container
    const container = canvas.parentElement
    if (container) {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    } else {
      canvas.width = 800
      canvas.height = 600
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Filter nodes if needed
    const filteredNodes = filter === 'all' 
      ? dataFlow.nodes 
      : dataFlow.nodes.filter(node => node.type === filter || node.status === filter)
    
    // Draw connections
    dataFlow.connections.forEach(connection => {
      const sourceNode = dataFlow.nodes.find(node => node.id === connection.source)
      const targetNode = dataFlow.nodes.find(node => node.id === connection.target)
      
      if (sourceNode && targetNode) {
        // Only draw connections for filtered nodes
        if (filter !== 'all' && !filteredNodes.includes(sourceNode) && !filteredNodes.includes(targetNode)) {
          return
        }
        
        const startX = sourceNode.position.x + nodeWidth / 2
        const startY = sourceNode.position.y + nodeHeight / 2
        const endX = targetNode.position.x + nodeWidth / 2
        const endY = targetNode.position.y + nodeHeight / 2
        
        // Draw connection line
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        
        // Create a curved line
        const controlPointX = (startX + endX) / 2
        const controlPointY = (startY + endY) / 2 + 30
        
        ctx.quadraticCurveTo(controlPointX, controlPointY, endX, endY)
        
        // Style based on hover state
        if (hoveredConnection === connection.id) {
          ctx.strokeStyle = '#0284c7' // blue-600
          ctx.lineWidth = 3
        } else {
          ctx.strokeStyle = '#94a3b8' // slate-400
          ctx.lineWidth = 2
        }
        
        ctx.stroke()
        
        // Draw arrow at the end
        const angle = Math.atan2(endY - controlPointY, endX - controlPointX)
        const arrowSize = 10
        
        ctx.beginPath()
        ctx.moveTo(endX, endY)
        ctx.lineTo(
          endX - arrowSize * Math.cos(angle - Math.PI / 6),
          endY - arrowSize * Math.sin(angle - Math.PI / 6)
        )
        ctx.lineTo(
          endX - arrowSize * Math.cos(angle + Math.PI / 6),
          endY - arrowSize * Math.sin(angle + Math.PI / 6)
        )
        ctx.closePath()
        ctx.fillStyle = hoveredConnection === connection.id ? '#0284c7' : '#94a3b8'
        ctx.fill()
      }
    })
    
    // Draw nodes
    dataFlow.nodes.forEach(node => {
      // Skip nodes that don't match the filter
      if (filter !== 'all' && !filteredNodes.includes(node)) {
        return
      }
      
      // Node background
      ctx.beginPath()
      ctx.roundRect(
        node.position.x, 
        node.position.y, 
        nodeWidth, 
        nodeHeight, 
        8 // border radius
      )
      
      // Style based on node type and hover state
      if (hoveredNode === node.id) {
        ctx.fillStyle = '#f1f5f9' // slate-100
        ctx.strokeStyle = '#0284c7' // blue-600
        ctx.lineWidth = 3
      } else {
        ctx.fillStyle = '#ffffff' // white
        ctx.strokeStyle = getNodeColor(node.status)
        ctx.lineWidth = 2
      }
      
      ctx.fill()
      ctx.stroke()
      
      // Node title
      ctx.font = 'bold 14px sans-serif'
      ctx.fillStyle = '#0f172a' // slate-900
      ctx.textAlign = 'center'
      ctx.fillText(
        node.name, 
        node.position.x + nodeWidth / 2, 
        node.position.y + 25
      )
      
      // Node type
      ctx.font = '12px sans-serif'
      ctx.fillStyle = '#64748b' // slate-500
      ctx.fillText(
        node.type, 
        node.position.x + nodeWidth / 2, 
        node.position.y + 45
      )
    })
    
  }, [dataFlow, filter, hoveredNode, hoveredConnection])
  
  // Handle canvas mouse events
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Check if mouse is over a node
    let foundNode = false
    for (const node of dataFlow.nodes) {
      if (
        x >= node.position.x && 
        x <= node.position.x + nodeWidth && 
        y >= node.position.y && 
        y <= node.position.y + nodeHeight
      ) {
        setHoveredNode(node.id)
        foundNode = true
        break
      }
    }
    
    if (!foundNode) {
      setHoveredNode(null)
      
      // Check if mouse is over a connection
      const ctx = canvas.getContext('2d')
      if (ctx) {
        for (const connection of dataFlow.connections) {
          const sourceNode = dataFlow.nodes.find(node => node.id === connection.source)
          const targetNode = dataFlow.nodes.find(node => node.id === connection.target)
          
          if (sourceNode && targetNode) {
            const startX = sourceNode.position.x + nodeWidth / 2
            const startY = sourceNode.position.y + nodeHeight / 2
            const endX = targetNode.position.x + nodeWidth / 2
            const endY = targetNode.position.y + nodeHeight / 2
            const controlPointX = (startX + endX) / 2
            const controlPointY = (startY + endY) / 2 + 30
            
            // Check if mouse is near the curve
            ctx.beginPath()
            ctx.moveTo(startX, startY)
            ctx.quadraticCurveTo(controlPointX, controlPointY, endX, endY)
            
            if (ctx.isPointInStroke(x, y)) {
              setHoveredConnection(connection.id)
              break
            } else {
              setHoveredConnection(null)
            }
          }
        }
      }
    }
  }
  
  const handleCanvasClick = () => {
    if (hoveredNode && onNodeClick) {
      onNodeClick(hoveredNode)
    } else if (hoveredConnection && onConnectionClick) {
      onConnectionClick(hoveredConnection)
    }
  }
  
  const handleFilterChange = (value: string) => {
    setFilter(value)
    if (onFilterChange) {
      onFilterChange(value)
    }
  }
  
  const getNodeColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981' // emerald-500
      case 'warning':
        return '#f59e0b' // amber-500
      case 'error':
        return '#ef4444' // red-500
      case 'pending':
        return '#6366f1' // indigo-500
      default:
        return '#94a3b8' // slate-400
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Data Pipeline</h2>
          <p className="text-muted-foreground">
            Visualize how data flows through your system
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Nodes</SelectItem>
              <SelectItem value="source">Sources</SelectItem>
              <SelectItem value="transform">Transformations</SelectItem>
              <SelectItem value="merge">Merge Points</SelectItem>
              <SelectItem value="filter">Filters</SelectItem>
              <SelectItem value="sink">Destinations</SelectItem>
              <SelectItem value="active">Active Status</SelectItem>
              <SelectItem value="warning">Warning Status</SelectItem>
              <SelectItem value="error">Error Status</SelectItem>
              <SelectItem value="pending">Pending Status</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Select onValueChange={onExport ? onExport : () => {}}>
            <SelectTrigger className="w-[130px]">
              <Download className="mr-2 h-4 w-4" />
              <span>Export</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG Image</SelectItem>
              <SelectItem value="svg">SVG Vector</SelectItem>
              <SelectItem value="json">JSON Data</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="relative w-full h-[600px] bg-slate-50 rounded-md overflow-hidden">
            <div className="absolute inset-0">
              <canvas
                ref={canvasRef}
                className="w-full h-full"
                onMouseMove={handleCanvasMouseMove}
                onClick={handleCanvasClick}
              />
            </div>
            
            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white p-3 rounded-md shadow-sm border">
              <div className="text-sm font-medium mb-2">Legend</div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                  <span className="text-xs">Active</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span className="text-xs">Warning</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-xs">Error</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                  <span className="text-xs">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}