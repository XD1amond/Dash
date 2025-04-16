"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, X, Plus, Move, Save, RotateCcw } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { cn } from "@/lib/utils"

interface WidgetDefinition {
  id: string
  name: string
  description: string
  component: React.ReactNode
  defaultSize: "small" | "medium" | "large" | "full"
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
}

export function CustomizableLayout({
  availableWidgets,
  defaultLayout,
  onLayoutChange
}: CustomizableLayoutProps) {
  const [layout, setLayout] = useState<LayoutSection[]>(defaultLayout)
  const [isEditing, setIsEditing] = useState(false)
  const [availableWidgetsOpen, setAvailableWidgetsOpen] = useState(false)
  
  // Find widget by ID
  const getWidgetById = (id: string) => {
    return availableWidgets.find(widget => widget.id === id)
  }

  // Handle drag end
  const handleDragEnd = (result: {
    draggableId: string;
    type: string;
    source: {
      droppableId: string;
      index: number;
    };
    destination?: {
      droppableId: string;
      index: number;
    };
  }) => {
    const { source, destination } = result

    // Dropped outside the list
    if (!destination) {
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

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button
          variant={isEditing ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setIsEditing(!isEditing);
            if (!isEditing) {
              setAvailableWidgetsOpen(true);
            } else {
              setAvailableWidgetsOpen(false);
            }
          }}
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

      <div className="flex">
        <div className={`flex-1 transition-all duration-300 ${isEditing ? 'pr-4' : ''}`}>
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

          <DragDropContext onDragEnd={handleDragEnd}>
            {layout.map(section => (
              <div key={section.id} className="space-y-4">
                <h3 className="text-lg font-medium">{section.title}</h3>
                <Droppable droppableId={section.id} direction="horizontal">
                  {(provided: {
                    innerRef: React.RefObject<HTMLDivElement>;
                    droppableProps: any;
                    placeholder: React.ReactNode;
                  }) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    >
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
                          <Draggable
                            key={`${section.id}-${widgetId}-${index}`}
                            draggableId={`${section.id}-${widgetId}-${index}`}
                            index={index}
                            isDragDisabled={!isEditing}
                          >
                            {(provided: {
                              innerRef: React.RefObject<HTMLDivElement>;
                              draggableProps: any;
                              dragHandleProps: any;
                            }) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={cn(
                                  "relative",
                                  sizeClasses[widget.defaultSize]
                                )}
                              >
                                {isEditing && (
                                  <>
                                    <div
                                      className="absolute top-0 left-0 right-0 h-8 bg-muted/20 cursor-move z-10 flex items-center justify-between px-2"
                                      {...provided.dragHandleProps}
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
                            )}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </DragDropContext>
        </div>
        
        {/* Sidebar with available widgets */}
        {isEditing && (
          <div className="w-64 border-l pl-4 transition-all duration-300">
            <div className="sticky top-4">
              <h3 className="font-medium mb-3">Available Widgets</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Drag these widgets to add them to your dashboard
              </p>
              <div className="space-y-3">
                {availableWidgets.map(widget => (
                  <Card key={widget.id} className="cursor-pointer hover:border-primary">
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">{widget.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <p className="text-xs text-muted-foreground">{widget.description}</p>
                      <div className="flex justify-end mt-2">
                        {layout.map(section => (
                          <Button
                            key={section.id}
                            variant="ghost"
                            size="sm"
                            onClick={() => addWidgetToSection(widget.id, section.id)}
                          >
                            Add
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}