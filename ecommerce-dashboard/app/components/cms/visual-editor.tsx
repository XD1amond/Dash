"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Label } from "../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Text,
  Columns,
  Plus,
  Move,
  Trash,
  Settings,
  ChevronDown,
  ChevronUp,
  Copy
} from "lucide-react"

interface ComponentProps {
  id: string
  type: string
  content: any
  settings: any
}

interface VisualEditorProps {
  initialComponents?: ComponentProps[]
  onSave?: (components: ComponentProps[]) => void
}

export function VisualEditor({ initialComponents = [], onSave }: VisualEditorProps) {
  const [components, setComponents] = useState<ComponentProps[]>(initialComponents.length > 0 ? initialComponents : [
    {
      id: "heading-1",
      type: "heading",
      content: { text: "Welcome to Our Store" },
      settings: { level: "h1", align: "left" }
    },
    {
      id: "paragraph-1",
      type: "paragraph",
      content: { text: "Discover the latest products and exclusive deals." },
      settings: { align: "left" }
    }
  ])
  
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"content" | "style" | "settings">("content")
  
  // Get the selected component
  const selectedComponent = components.find(c => c.id === selectedComponentId)
  
  // Add a new component
  const addComponent = (type: string) => {
    const newId = `${type}-${Date.now()}`
    let newComponent: ComponentProps = {
      id: newId,
      type,
      content: {},
      settings: {}
    }
    
    // Set default content and settings based on component type
    switch (type) {
      case "heading":
        newComponent.content = { text: "New Heading" }
        newComponent.settings = { level: "h2", align: "left" }
        break
      case "paragraph":
        newComponent.content = { text: "New paragraph text" }
        newComponent.settings = { align: "left" }
        break
      case "image":
        newComponent.content = { src: "https://via.placeholder.com/800x400", alt: "Image description" }
        newComponent.settings = { width: "100%", align: "center" }
        break
      case "button":
        newComponent.content = { text: "Click Me", url: "#" }
        newComponent.settings = { variant: "primary", size: "medium", align: "left" }
        break
      case "divider":
        newComponent.content = {}
        newComponent.settings = { style: "solid", color: "#e2e8f0", margin: "medium" }
        break
      case "columns":
        newComponent.content = {
          columns: [
            { id: `column-${Date.now()}-1`, components: [] },
            { id: `column-${Date.now()}-2`, components: [] }
          ]
        }
        newComponent.settings = { gap: "medium", distribution: "equal" }
        break
    }
    
    // Add the new component to the list
    const newComponents = [...components, newComponent]
    setComponents(newComponents)
    setSelectedComponentId(newId)
    setActiveTab("content")
    
    // Save changes
    if (onSave) {
      onSave(newComponents)
    }
  }
  
  // Update a component
  const updateComponent = (id: string, updates: Partial<ComponentProps>) => {
    const newComponents = components.map(component => {
      if (component.id === id) {
        return { ...component, ...updates }
      }
      return component
    })
    
    setComponents(newComponents)
    
    // Save changes
    if (onSave) {
      onSave(newComponents)
    }
  }
  
  // Remove a component
  const removeComponent = (id: string) => {
    const newComponents = components.filter(component => component.id !== id)
    setComponents(newComponents)
    setSelectedComponentId(null)
    
    // Save changes
    if (onSave) {
      onSave(newComponents)
    }
  }
  
  // Render a component based on its type
  const renderComponent = (component: ComponentProps) => {
    const isSelected = component.id === selectedComponentId
    
    switch (component.type) {
      case "heading":
        const HeadingTag = component.settings.level || "h2"
        return (
          <div 
            className={`relative p-2 my-2 rounded-md ${isSelected ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-primary/20'}`}
            onClick={() => setSelectedComponentId(component.id)}
          >
            {isSelected && (
              <div className="absolute top-0 right-0 flex bg-background border rounded-md shadow-sm -mt-3 -mr-3 z-10">
                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                  <Move className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeComponent(component.id); }}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}
            <HeadingTag 
              className={`text-${component.settings.align || 'left'}`}
              style={{ margin: 0 }}
            >
              {component.content.text || "Heading"}
            </HeadingTag>
          </div>
        )
        
      case "paragraph":
        return (
          <div 
            className={`relative p-2 my-2 rounded-md ${isSelected ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-primary/20'}`}
            onClick={() => setSelectedComponentId(component.id)}
          >
            {isSelected && (
              <div className="absolute top-0 right-0 flex bg-background border rounded-md shadow-sm -mt-3 -mr-3 z-10">
                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                  <Move className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeComponent(component.id); }}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}
            <p 
              className={`text-${component.settings.align || 'left'}`}
              style={{ margin: 0 }}
            >
              {component.content.text || "Paragraph text"}
            </p>
          </div>
        )
        
      case "image":
        return (
          <div 
            className={`relative p-2 my-2 rounded-md ${isSelected ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-primary/20'}`}
            onClick={() => setSelectedComponentId(component.id)}
          >
            {isSelected && (
              <div className="absolute top-0 right-0 flex bg-background border rounded-md shadow-sm -mt-3 -mr-3 z-10">
                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                  <Move className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeComponent(component.id); }}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className={`text-${component.settings.align || 'center'}`}>
              <img 
                src={component.content.src || "https://via.placeholder.com/800x400"} 
                alt={component.content.alt || "Image"} 
                style={{ 
                  width: component.settings.width || "100%",
                  maxWidth: "100%"
                }}
              />
            </div>
          </div>
        )
        
      default:
        return (
          <div 
            className={`relative p-2 my-2 rounded-md ${isSelected ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-primary/20'}`}
            onClick={() => setSelectedComponentId(component.id)}
          >
            {isSelected && (
              <div className="absolute top-0 right-0 flex bg-background border rounded-md shadow-sm -mt-3 -mr-3 z-10">
                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                  <Move className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeComponent(component.id); }}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="p-4 border border-dashed border-gray-300 rounded-md text-center text-gray-500">
              Unknown component type: {component.type}
            </div>
          </div>
        )
    }
  }
  
  // Render the editor sidebar for the selected component
  const renderEditorSidebar = () => {
    if (!selectedComponent) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          <p>Select a component to edit its properties</p>
        </div>
      )
    }
    
    return (
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="w-full">
          <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
          <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="p-4 space-y-4">
          {selectedComponent.type === "heading" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="heading-text">Heading Text</Label>
                <Input 
                  id="heading-text" 
                  value={selectedComponent.content.text || ""} 
                  onChange={(e) => updateComponent(selectedComponent.id, { 
                    content: { ...selectedComponent.content, text: e.target.value } 
                  })}
                />
              </div>
            </div>
          )}
          
          {selectedComponent.type === "paragraph" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="paragraph-text">Paragraph Text</Label>
                <Textarea 
                  id="paragraph-text" 
                  value={selectedComponent.content.text || ""} 
                  onChange={(e) => updateComponent(selectedComponent.id, { 
                    content: { ...selectedComponent.content, text: e.target.value } 
                  })}
                  rows={5}
                />
              </div>
            </div>
          )}
          
          {selectedComponent.type === "image" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-src">Image URL</Label>
                <Input 
                  id="image-src" 
                  value={selectedComponent.content.src || ""} 
                  onChange={(e) => updateComponent(selectedComponent.id, { 
                    content: { ...selectedComponent.content, src: e.target.value } 
                  })}
                />
              </div>
              <div>
                <Label htmlFor="image-alt">Alt Text</Label>
                <Input 
                  id="image-alt" 
                  value={selectedComponent.content.alt || ""} 
                  onChange={(e) => updateComponent(selectedComponent.id, { 
                    content: { ...selectedComponent.content, alt: e.target.value } 
                  })}
                />
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="style" className="p-4 space-y-4">
          {(selectedComponent.type === "heading" || selectedComponent.type === "paragraph") && (
            <div>
              <Label>Alignment</Label>
              <div className="flex mt-2 space-x-2">
                <Button 
                  variant={selectedComponent.settings.align === "left" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => updateComponent(selectedComponent.id, { 
                    settings: { ...selectedComponent.settings, align: "left" } 
                  })}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant={selectedComponent.settings.align === "center" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => updateComponent(selectedComponent.id, { 
                    settings: { ...selectedComponent.settings, align: "center" } 
                  })}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button 
                  variant={selectedComponent.settings.align === "right" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => updateComponent(selectedComponent.id, { 
                    settings: { ...selectedComponent.settings, align: "right" } 
                  })}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {selectedComponent.type === "heading" && (
            <div>
              <Label>Heading Level</Label>
              <Select 
                value={selectedComponent.settings.level || "h2"} 
                onValueChange={(value) => updateComponent(selectedComponent.id, { 
                  settings: { ...selectedComponent.settings, level: value } 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select heading level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">Heading 1</SelectItem>
                  <SelectItem value="h2">Heading 2</SelectItem>
                  <SelectItem value="h3">Heading 3</SelectItem>
                  <SelectItem value="h4">Heading 4</SelectItem>
                  <SelectItem value="h5">Heading 5</SelectItem>
                  <SelectItem value="h6">Heading 6</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {selectedComponent.type === "image" && (
            <div className="space-y-4">
              <div>
                <Label>Width</Label>
                <Select 
                  value={selectedComponent.settings.width || "100%"} 
                  onValueChange={(value) => updateComponent(selectedComponent.id, { 
                    settings: { ...selectedComponent.settings, width: value } 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select width" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25%">25%</SelectItem>
                    <SelectItem value="50%">50%</SelectItem>
                    <SelectItem value="75%">75%</SelectItem>
                    <SelectItem value="100%">100%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="settings" className="p-4 space-y-4">
          <div>
            <Label>Component Type</Label>
            <div className="mt-1 text-sm font-medium">{selectedComponent.type}</div>
          </div>
          <div>
            <Label>Component ID</Label>
            <div className="mt-1 text-sm font-mono text-muted-foreground">{selectedComponent.id}</div>
          </div>
          <Button 
            variant="destructive" 
            size="sm" 
            className="w-full mt-4"
            onClick={() => removeComponent(selectedComponent.id)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Component
          </Button>
        </TabsContent>
      </Tabs>
    )
  }
  
  return (
    <div className="flex h-full">
      <div className="flex-1 p-4 border-r overflow-auto">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-medium">Visual Page Editor</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedComponentId(null)}>
              Deselect
            </Button>
            <Button size="sm" onClick={() => onSave && onSave(components)}>
              Save Changes
            </Button>
          </div>
        </div>
        
        <div className="bg-white border rounded-md p-6 min-h-[500px]">
          {components.map(component => renderComponent(component))}
          
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Button variant="outline" onClick={() => addComponent("heading")}>
              <Heading1 className="mr-2 h-4 w-4" />
              Heading
            </Button>
            <Button variant="outline" onClick={() => addComponent("paragraph")}>
              <Text className="mr-2 h-4 w-4" />
              Paragraph
            </Button>
            <Button variant="outline" onClick={() => addComponent("image")}>
              <ImageIcon className="mr-2 h-4 w-4" />
              Image
            </Button>
          </div>
        </div>
      </div>
      
      <div className="w-80 border-l">
        {renderEditorSidebar()}
      </div>
    </div>
  )
}
