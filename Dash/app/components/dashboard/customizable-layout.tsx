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

// Export LayoutSection type
export interface LayoutSection {
  id: string
  title: string
  widgets: string[] // IDs of widgets
}

// --- Final Props for Controlled Component ---
interface CustomizableLayoutProps {
  instanceId: string // Unique ID for this instance (e.g., 'header', 'overview', 'business')
  isEditing: boolean // Controlled by parent
  availableWidgets: WidgetDefinition[] // All widgets potentially available for this area
  layout: LayoutSection[] // Current layout state, controlled by parent
  onLayoutChange: (instanceId: string, newLayout: LayoutSection[]) => void // Reports layout changes to parent
  onAreaSelect: (instanceId: string, sectionId: string, availableWidgetsForArea: WidgetDefinition[]) => void // Reports click when editing
}

export function CustomizableLayout({
  instanceId,
  isEditing,
  availableWidgets,
  layout, // Use layout from props
  onLayoutChange,
  onAreaSelect
}: CustomizableLayoutProps) {
  // Removed ALL internal state related to layout, editing, sidebar

  // Find widget definition by ID from the available widgets for this instance
  const getWidgetById = (id: string) => {
    return availableWidgets.find(widget => widget.id === id)
    // Removed grouping/filtering logic - sidebar is gone
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
          
          // Report change to parent instead of setting local state
          onLayoutChange(instanceId, newLayout)
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
        
        // Report change to parent
        onLayoutChange(instanceId, newLayout)
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
        
        // Report change to parent
        onLayoutChange(instanceId, newLayout)
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
        
        // Report change to parent
        onLayoutChange(instanceId, newLayout)
      }
    }
  }

  // Remove widget from section - Reports change via prop
  const removeWidgetFromSection = (widgetId: string, sectionId: string, index: number) => {
    const newLayout = layout.map(section => {
      if (section.id === sectionId) {
        const widgets = [...section.widgets]
        widgets.splice(index, 1)
        return { ...section, widgets }
      }
      return section
    })
    // Report change to parent
    onLayoutChange(instanceId, newLayout)
  }

  // Removed internal state management functions:
  // resetLayout, toggleCustomizeMode, openSidebarForSection, closeSidebar

  // Handle click on the layout area to trigger selection in parent
  const handleAreaClick = () => {
    if (isEditing && layout.length > 0) {
      // Call parent handler with the instance ID, the ID of the first section in this layout,
      // and the list of widgets available for this specific layout instance.
      onAreaSelect(instanceId, layout[0].id, availableWidgets);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {/* Wrapper div for click handling and outline */}
      <div
        className={cn(
          "customizable-layout-area p-1", // Add slight padding for outline visibility
          isEditing ? "cursor-pointer hover:bg-muted/20 rounded-md" : "" // Change cursor and add hover effect when editing
          // Outline style will be applied by parent based on active tab/header focus
        )}
        onClick={handleAreaClick}
        role="button" // Semantics for clickability
        tabIndex={isEditing ? 0 : -1} // Make focusable when editing
        aria-label={isEditing ? `Select ${instanceId} area for customization` : ""}
      >
        {/* Removed local Customize button */}
        {/* Removed outer relative flex container */}
        {/* Removed sidebar rendering */}

        {/* Dashboard Layout Sections */}
        {layout.map(section => (
          <div key={section.id} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{section.title}</h3>
              {/* Removed Add Widget button */}
            </div>
            <Droppable droppableId={section.id} type="WIDGET">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[100px] rounded-md border p-2", // Keep padding, ensure border is always present for transitions
                    // Drag-over state: Softer background, solid border
                    snapshot.isDraggingOver ? "bg-blue-100/50 dark:bg-blue-900/30 border-solid border-blue-400 transition-colors duration-150" :
                    // Default editing state: Dashed border, slightly darker on hover
                    isEditing ? "border-dashed border-border/50 hover:border-border/80 transition-colors duration-150" :
                    // Default non-editing state: Transparent border
                    "border-transparent"
                  )}
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
                      <Draggable key={widgetId} draggableId={widgetId} index={index} isDragDisabled={!isEditing}>
                        {(providedDraggable, snapshotDraggable) => (
                          <div
                            ref={providedDraggable.innerRef}
                            {...providedDraggable.draggableProps}
                            // Apply drag handle props here ONLY when editing
                            {...(isEditing ? providedDraggable.dragHandleProps : {})}
                            className={cn(
                              "relative group transition-shadow transition-transform duration-200", // Add transition-transform
                              sizeClasses[widget.defaultSize],
                              snapshotDraggable.isDragging ? "opacity-80 shadow-xl rounded-md z-50" : "z-10", // Ensure dragging item is on top, add shadow/rounding
                              isEditing ? "hover:shadow-md rounded-md cursor-move" : "" // Add hover shadow and move cursor when editing
                            )}
                            style={{
                              // Required for smooth animation when items move
                              ...providedDraggable.draggableProps.style,
                            }}
                          >
                            {isEditing && (
                              <>
                                {/* Drag Handle - REMOVED */}

                                {/* Remove Button - More visible */}
                                <div className="absolute -top-2 -right-2 z-40">
                                  <Button
                                    variant="destructive" // Use destructive variant
                                    size="icon"
                                    className="h-6 w-6 rounded-full shadow opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity" // Show button on hover/focus
                                    onClick={(e) => {
                                       e.stopPropagation(); // Prevent area click when removing
                                       removeWidgetFromSection(widgetId, section.id, index)
                                    }}
                                    aria-label="Remove widget"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                                {/* Content - No extra padding needed now */}
                                <div>
                                  {widget.component}
                                </div>
                              </>
                            )}
                            {!isEditing && widget.component} {/* Render normally */}
                          </div>
                        )}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder} {/* Ensure placeholder is rendered */}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}