"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, X, Plus, Move, Save, RotateCcw, ChevronLeft, Filter, Search } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export interface WidgetDefinition {
  id: string
  name: string
  description: string
  component: React.ReactNode
  defaultSize: "small" | "medium" | "large" | "full"
  category: string
}

interface LayoutSection {
  id: string
  title: string
  widgets: string[] // IDs of widgets
}

interface CustomizableLayoutProps {
  availableWidgets: WidgetDefinition[]
  defaultLayout: LayoutSection[]
  onLayoutChange?: (layout: LayoutSection[]) => void
  isEditingExternal?: boolean
  onEditingChange?: (isEditing: boolean) => void
}

export function CustomizableLayout({
  availableWidgets,
  defaultLayout,
  onLayoutChange,
  isEditingExternal,
  onEditingChange
}: CustomizableLayoutProps) {
  const [layout, setLayout] = useState<LayoutSection[]>(defaultLayout)
  const [isEditing, setIsEditing] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["small", "medium", "large", "full"])
  
  // Group widgets by category
  const widgetCategories = availableWidgets
    .map(widget => widget.category)
    .filter((category, index, self) => self.indexOf(category) === index);
    
  // Filter widgets based on search term, category, and size
  const filteredWidgets = availableWidgets.filter(widget => {
    const matchesSearch = searchTerm === "" ||
      widget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      widget.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || widget.category === selectedCategory;
    const matchesSize = selectedSizes.includes(widget.defaultSize);
    return matchesSearch && matchesCategory && matchesSize;
  });
  
  // Sync with external editing state if provided
  useEffect(() => {
    if (isEditingExternal !== undefined) {
      setIsEditing(isEditingExternal);
      setSidebarOpen(isEditingExternal);
    }
  }, [isEditingExternal]);
  
  // Find widget by ID
  const getWidgetById = (id: string) => {
    return availableWidgets.find(widget => widget.id === id)
  }

  // Handle drag end
  const handleDragEnd = (result: any) => {
    const { source, destination, draggableId } = result

    // Dropped outside the list
    if (!destination) {
      return
    }
    
    // Handle dragging from widget library to dashboard
    if (source.droppableId === "widget-library") {
      // Find the widget by ID (draggableId contains the widget ID)
      const widgetId = draggableId.replace("library-", "")
      const widget = availableWidgets.find(w => w.id === widgetId)
      
      if (widget) {
        // Add widget to the destination section
        const destSection = layout.find(section => section.id === destination.droppableId)
        
        if (destSection) {
          const destWidgets = [...destSection.widgets]
          destWidgets.splice(destination.index, 0, widgetId)
          
          const newLayout = layout.map(section => {
            if (section.id === destination.droppableId) {
              return { ...section, widgets: destWidgets }
            }
            return section
          })
          
          setLayout(newLayout)
          if (onLayoutChange) {
            onLayoutChange(newLayout)
          }
        }
      }
      return
    }
    
    // Handle dragging from dashboard to widget library (removing widget)
    if (destination.droppableId === "widget-library") {
      const sourceSection = layout.find(section => section.id === source.droppableId)
      
      if (sourceSection) {
        const sourceWidgets = [...sourceSection.widgets]
        sourceWidgets.splice(source.index, 1)
        
        const newLayout = layout.map(section => {
          if (section.id === source.droppableId) {
            return { ...section, widgets: sourceWidgets }
          }
          return section
        })
        
        setLayout(newLayout)
        if (onLayoutChange) {
          onLayoutChange(newLayout)
        }
      }
      return
    }

    // Handle moving between sections
    if (source.droppableId !== destination.droppableId) {
      const sourceSection = layout.find(section => section.id === source.droppableId)
      const destSection = layout.find(section => section.id === destination.droppableId)
      
      if (sourceSection && destSection) {
        const sourceWidgets = [...sourceSection.widgets]
        const destWidgets = [...destSection.widgets]
        const [movedWidget] = sourceWidgets.splice(source.index, 1)
        destWidgets.splice(destination.index, 0, movedWidget)
        
        const newLayout = layout.map(section => {
          if (section.id === source.droppableId) {
            return { ...section, widgets: sourceWidgets }
          }
          if (section.id === destination.droppableId) {
            return { ...section, widgets: destWidgets }
          }
          return section
        })
        
        setLayout(newLayout)
        if (onLayoutChange) {
          onLayoutChange(newLayout)
        }
      }
    } else {
      // Handle reordering within the same section
      const section = layout.find(section => section.id === source.droppableId)
      
      if (section) {
        const widgets = [...section.widgets]
        const [movedWidget] = widgets.splice(source.index, 1)
        widgets.splice(destination.index, 0, movedWidget)
        
        const newLayout = layout.map(s => {
          if (s.id === source.droppableId) {
            return { ...s, widgets }
          }
          return s
        })
        
        setLayout(newLayout)
        if (onLayoutChange) {
          onLayoutChange(newLayout)
        }
      }
    }
  }

  // Add widget to section
  const addWidgetToSection = (widgetId: string, sectionId: string) => {
    const newLayout = layout.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          widgets: [...section.widgets, widgetId]
        }
      }
      return section
    })
    
    setLayout(newLayout)
    if (onLayoutChange) {
      onLayoutChange(newLayout)
    }
  }

  // Remove widget from section
  const removeWidgetFromSection = (widgetId: string, sectionId: string, index: number) => {
    const newLayout = layout.map(section => {
      if (section.id === sectionId) {
        const widgets = [...section.widgets]
        widgets.splice(index, 1)
        return {
          ...section,
          widgets
        }
      }
      return section
    })
    
    setLayout(newLayout)
    if (onLayoutChange) {
      onLayoutChange(newLayout)
    }
  }

  // Reset to default layout
  const resetLayout = () => {
    setLayout(defaultLayout)
    if (onLayoutChange) {
      onLayoutChange(defaultLayout)
    }
  }

  // Toggle editing mode
  const toggleEditing = () => {
    const newEditingState = !isEditing;
    setIsEditing(newEditingState);
    setSidebarOpen(newEditingState);
    
    // Notify parent component if callback provided
    if (onEditingChange) {
      onEditingChange(newEditingState);
    }
  };

  return (
    <div className="space-y-4">
      {/* Only show customize button if not controlled externally */}
      {isEditingExternal === undefined && (
        <div className="flex justify-end mb-4">
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={toggleEditing}
          >
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Layout
              </>
            ) : (
              <>
                <Pencil className="mr-2 h-4 w-4" />
                Customize
              </>
            )}
          </Button>
        </div>
      )}

      <div className="flex relative">
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'pr-4' : ''}`}>
          {isEditing && (
            <div className="mb-4">
              <h2 className="text-lg font-medium mb-2">Customize Dashboard Layout</h2>
              <p className="text-sm text-muted-foreground">
                Drag widgets to rearrange them or drag from the sidebar to add new widgets
              </p>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={resetLayout}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset Layout
                </Button>
              </div>
            </div>
          )}

          {/* Dashboard Layout */}
          {layout.map(section => (
            <div key={section.id} className="space-y-4">
              <h3 className="text-lg font-medium">{section.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {section.widgets.map((widgetId, index) => {
                  const widget = getWidgetById(widgetId)
                  if (!widget) return null
                  
                  const sizeClasses = {
                    small: "md:col-span-1",
                    medium: "md:col-span-1 lg:col-span-2",
                    large: "md:col-span-2 lg:col-span-2",
                    full: "md:col-span-2 lg:col-span-4"
                  }
                  
                  return (
                    <div
                      key={`${section.id}-${widgetId}-${index}`}
                      className={cn(
                        "relative",
                        sizeClasses[widget.defaultSize]
                      )}
                    >
                      {isEditing && (
                        <>
                          <div
                            className="absolute top-0 left-0 right-0 h-8 bg-muted/20 cursor-move z-10 flex items-center justify-between px-2"
                          >
                            <span className="text-xs text-muted-foreground">Drag to move</span>
                            <Move className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <div className="absolute top-2 right-2 z-20">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm"
                              onClick={() => removeWidgetFromSection(widgetId, section.id, index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </>
                      )}
                      {widget.component}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Slide-in sidebar with available widgets */}
        <div
          className={`fixed top-0 right-0 h-full bg-background border-l shadow-lg z-50 transition-all duration-300 transform ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ width: '350px' }}
        >
          <div className="h-full flex flex-col p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg">Widget Library</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">
              Drag widgets to add them to your dashboard or click the Add button
            </p>
            
            {/* Search and filter */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search widgets..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    checked={selectedSizes.includes("small")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSizes([...selectedSizes, "small"]);
                      } else {
                        setSelectedSizes(selectedSizes.filter(size => size !== "small"));
                      }
                    }}
                  >
                    Small Widgets
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedSizes.includes("medium")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSizes([...selectedSizes, "medium"]);
                      } else {
                        setSelectedSizes(selectedSizes.filter(size => size !== "medium"));
                      }
                    }}
                  >
                    Medium Widgets
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedSizes.includes("large")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSizes([...selectedSizes, "large"]);
                      } else {
                        setSelectedSizes(selectedSizes.filter(size => size !== "large"));
                      }
                    }}
                  >
                    Large Widgets
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedSizes.includes("full")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSizes([...selectedSizes, "full"]);
                      } else {
                        setSelectedSizes(selectedSizes.filter(size => size !== "full"));
                      }
                    }}
                  >
                    Full-width Widgets
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <Tabs defaultValue="all" className="flex-1 overflow-hidden flex flex-col">
              <TabsList className="mb-4 w-full justify-start overflow-x-auto">
                <TabsTrigger value="all" onClick={() => setSelectedCategory("all")}>All</TabsTrigger>
                {widgetCategories.map(category => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="space-y-3">
                  {filteredWidgets.map((widget, index) => (
                    <Card key={widget.id} className="cursor-pointer hover:border-primary">
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm">{widget.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {widget.defaultSize} · {widget.category}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <p className="text-xs text-muted-foreground">{widget.description}</p>
                        <div className="flex justify-end mt-2">
                          {layout.length > 0 && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => addWidgetToSection(widget.id, layout[0].id)}
                            >
                              <Plus className="mr-1 h-3 w-3" />
                              Add
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </Tabs>
            
            <div className="pt-4 border-t mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={resetLayout}
                className="w-full"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Layout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}