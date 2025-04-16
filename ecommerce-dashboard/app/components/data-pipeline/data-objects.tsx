"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Database, ShoppingBag, Users, Package, BarChart4, FileText, Tag } from "lucide-react"
import { PipelineVisualization } from "@/components/data-pipeline/pipeline-visualization"

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

interface DataObject {
  id: string
  name: string
  type: string
  description: string
  icon?: React.ReactNode
  usedBy: string[]
}

interface DataObjectsProps {
  dataObjects: DataObject[]
  dataFlow: DataFlow
  onSearch?: (query: string) => void
}

export function DataObjects({ dataObjects, dataFlow, onSearch }: DataObjectsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedObject, setSelectedObject] = useState<string | null>(null)
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }
  
  const filteredObjects = searchQuery 
    ? dataObjects.filter(obj => 
        obj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obj.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : dataObjects
  
  // Filter data flow to only show connections related to the selected object
  const getFilteredDataFlow = () => {
    if (!selectedObject) return null
    
    const selectedObjectData = dataObjects.find(obj => obj.id === selectedObject)
    if (!selectedObjectData) return null
    
    // Find all nodes that use this data object
    const relatedModules = selectedObjectData.usedBy
    
    // Create a filtered version of the data flow
    const filteredNodes = dataFlow.nodes.filter((node: DataNode) =>
      node.id === selectedObject ||
      relatedModules.includes(node.id) ||
      node.inputs.includes(selectedObject) ||
      node.outputs.includes(selectedObject)
    )
    
    const filteredConnections = dataFlow.connections.filter((conn: DataConnection) =>
      filteredNodes.some((node: DataNode) => node.id === conn.source) &&
      filteredNodes.some((node: DataNode) => node.id === conn.target)
    )
    
    return { nodes: filteredNodes, connections: filteredConnections }
  }
  
  const getIconForType = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="h-5 w-5" />
      case "customer":
        return <Users className="h-5 w-5" />
      case "product":
        return <Package className="h-5 w-5" />
      case "analytics":
        return <BarChart4 className="h-5 w-5" />
      case "content":
        return <FileText className="h-5 w-5" />
      case "category":
        return <Tag className="h-5 w-5" />
      default:
        return <Database className="h-5 w-5" />
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Data Pipeline</h1>
          <p className="text-muted-foreground">
            Visualize how data flows through your e-commerce platform
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex w-full md:w-1/3">
          <Input
            placeholder="Search data objects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-r-none"
          />
          <Button type="submit" variant="secondary" className="rounded-l-none">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>
      
      {selectedObject ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {dataObjects.find(obj => obj.id === selectedObject)?.name} Data Flow
            </h2>
            <Button variant="outline" onClick={() => setSelectedObject(null)}>
              Back to All Data Objects
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Flow Visualization</CardTitle>
              <CardDescription>
                How {dataObjects.find(obj => obj.id === selectedObject)?.name} data flows through your system
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[600px]">
              {getFilteredDataFlow() ? (
                <PipelineVisualization
                  dataFlow={getFilteredDataFlow() as DataFlow}
                  onExport={(format) => console.log("Export as:", format)}
                  onRefresh={() => console.log("Refresh data flow")}
                  onNodeClick={(id) => console.log("Node clicked:", id)}
                  onConnectionClick={(id) => console.log("Connection clicked:", id)}
                  onFilterChange={(filter) => console.log("Filter changed:", filter)}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No data flow visualization available</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Used By</CardTitle>
              <CardDescription>
                Modules that use this data object
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dataObjects.find(obj => obj.id === selectedObject)?.usedBy.map(moduleId => {
                  const module = dataFlow.nodes.find((node: DataNode) => node.id === moduleId)
                  return module ? (
                    <Card key={module.id} className="bg-muted/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{module.name}</CardTitle>
                        <CardDescription>{module.type}</CardDescription>
                      </CardHeader>
                    </Card>
                  ) : null
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredObjects.map(dataObject => (
            <Card 
              key={dataObject.id} 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => setSelectedObject(dataObject.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <div className="mr-2 p-1.5 rounded-md bg-primary/10">
                      {getIconForType(dataObject.type)}
                    </div>
                    {dataObject.name}
                  </CardTitle>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">
                    {dataObject.type}
                  </span>
                </div>
                <CardDescription>{dataObject.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Used by {dataObject.usedBy.length} module{dataObject.usedBy.length !== 1 ? 's' : ''}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}