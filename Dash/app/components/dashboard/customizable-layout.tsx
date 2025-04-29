"use client"

import { useState, useRef, useEffect, useMemo } from "react" // Added useMemo
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, X, Plus, Move, Save, RotateCcw, ChevronLeft, Filter, Search, GripVertical } from "lucide-react" // Added GripVertical
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay, // Added for visual feedback during drag
  UniqueIdentifier
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy, // Keep if needed, but grid might be better
  rectSortingStrategy, // Use for grid layout
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities'; // Added for transform/transition
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
  // --- dnd-kit setup ---
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null); // Track the actively dragged item ID
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Find widget definition by ID from the available widgets for this instance
  const getWidgetById = (id: string | UniqueIdentifier) => {
    // Ensure id is treated as string for comparison
    const stringId = String(id);
    return availableWidgets.find(widget => widget.id === stringId);
  }

  // Memoize the widget IDs for SortableContext performance
  const sectionWidgetIds = useMemo(() => {
    const map = new Map<string, string[]>();
    layout.forEach(section => map.set(section.id, section.widgets));
    return map;
  }, [layout]);

  // Handle drag start
  function handleDragStart(event: DragEndEvent) {
    setActiveId(event.active.id);
  }

  // Handle drag end for dnd-kit
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null); // Reset active ID

    if (!over) {
      console.log("Drag ended outside a droppable area");
      return; // Dropped outside any droppable area
    }

    const activeId = active.id;
    const overId = over.id;

    // Find the sections involved
    const activeSectionId = active.data.current?.sortable?.containerId;
    // over.id might be a widget ID or a section ID if dropped directly on the container
    const overSectionId = over.data.current?.sortable?.containerId ?? over.id;

    console.log(`Drag End: Active ID: ${activeId}, Over ID: ${overId}, Active Section: ${activeSectionId}, Over Section: ${overSectionId}`);


    if (!activeSectionId || !overSectionId) {
        console.error("Could not determine source or destination section.");
        return; // Should not happen if setup correctly
    }

    const activeSection = layout.find(s => s.id === activeSectionId);
    const overSection = layout.find(s => s.id === overSectionId);

    if (!activeSection) {
        console.error(`Source section ${activeSectionId} not found.`);
        return;
    }

    const activeIndex = activeSection.widgets.indexOf(String(activeId));

    // Case 1: Reordering within the same section
    if (activeSectionId === overSectionId) {
        console.log(`Reordering in section ${activeSectionId}`);
        if (!overSection) {
            console.error(`Destination section ${overSectionId} not found for reordering.`);
            return;
        }
        const overIndex = overSection.widgets.indexOf(String(overId));

        if (activeIndex !== overIndex && overIndex !== -1) {
            const newWidgets = arrayMove(activeSection.widgets, activeIndex, overIndex);
            const newLayout = layout.map(section =>
                section.id === activeSectionId ? { ...section, widgets: newWidgets } : section
            );
            console.log("Layout Change (Reorder):", newLayout);
            onLayoutChange(instanceId, newLayout);
        } else {
             console.log("No reorder needed (same index or invalid overIndex)");
        }
    }
    // Case 2: Moving between different sections
    else {
        console.log(`Moving from section ${activeSectionId} to ${overSectionId}`);
        if (!overSection) {
            console.error(`Destination section ${overSectionId} not found for move.`);
            return;
        }

        const overIndex = over.data.current?.sortable?.index ?? overSection.widgets.length; // If dropped on container, add to end, otherwise use index

        console.log(`Source Index: ${activeIndex}, Target Index: ${overIndex}`);


        let newLayout = [...layout];
        const sourceWidgets = [...activeSection.widgets];
        const [movedWidget] = sourceWidgets.splice(activeIndex, 1);

        // Update source section
        newLayout = newLayout.map(section =>
            section.id === activeSectionId ? { ...section, widgets: sourceWidgets } : section
        );

        // Find the target section *again* in the potentially updated layout array
        const targetSectionIndex = newLayout.findIndex(s => s.id === overSectionId);
        if (targetSectionIndex === -1) {
             console.error(`Target section ${overSectionId} not found after source update.`);
             return;
        }

        const destWidgets = [...newLayout[targetSectionIndex].widgets];
        // Ensure overIndex is valid for the destination list
        const validOverIndex = Math.max(0, Math.min(overIndex, destWidgets.length));
        destWidgets.splice(validOverIndex, 0, movedWidget);


        // Update destination section
        newLayout = newLayout.map(section =>
            section.id === overSectionId ? { ...section, widgets: destWidgets } : section
        );

        console.log("Layout Change (Move):", newLayout);
        onLayoutChange(instanceId, newLayout);
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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Wrapper div for click handling and outline */}
      <div
        className={cn(
          "customizable-layout-area p-1",
          isEditing ? "cursor-pointer hover:bg-muted/20 rounded-md" : ""
        )}
        onClick={handleAreaClick}
        role="button"
        tabIndex={isEditing ? 0 : -1}
        aria-label={isEditing ? `Select ${instanceId} area for customization` : ""}
      >
        {/* Dashboard Layout Sections */}
        {layout.map(section => (
          <div key={section.id} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{section.title}</h3>
            </div>
            {/* Use SortableContext for each section */}
            <SortableContext
              id={section.id} // Crucial for identifying the container in handleDragEnd
              items={sectionWidgetIds.get(section.id) || []} // Provide the list of widget IDs in this section
              strategy={rectSortingStrategy} // Use grid strategy
              disabled={!isEditing}
            >
              <div
                className={cn(
                  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[100px] rounded-md border p-2",
                  instanceId === 'header' && "grid-flow-col", // Keep header specific style if needed
                  // isOver state is handled by useSortable, apply styles to individual items or use DragOverlay
                  isEditing ? "border-dashed border-border/50 hover:border-border/80 transition-colors duration-150" : "border-transparent"
                )}
              >
                {(sectionWidgetIds.get(section.id) || []).map((widgetId) => (
                   <SortableWidget
                     key={widgetId}
                     id={widgetId}
                     widget={getWidgetById(widgetId)}
                     isEditing={isEditing}
                     instanceId={instanceId} // Pass instanceId if needed by SortableWidget
                     sectionId={section.id} // Pass sectionId
                     onRemoveWidget={removeWidgetFromSection} // Pass remove handler
                   />
                ))}
                {/* dnd-kit doesn't use a placeholder div like @hello-pangea/dnd */}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
      {/* DragOverlay for better visual feedback while dragging */}
      <DragOverlay>
        {activeId ? (
          <WidgetOverlayContent widget={getWidgetById(activeId)} isEditing={isEditing} />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}


// --- Sortable Widget Wrapper ---
interface SortableWidgetProps {
  id: string;
  widget: WidgetDefinition | undefined;
  isEditing: boolean;
  instanceId: string; // Example prop, adjust as needed
  sectionId: string;
  onRemoveWidget: (widgetId: string, sectionId: string, index: number) => void; // Use index from useSortable if needed, or adjust signature
}

function SortableWidget({ id, widget, isEditing, sectionId, onRemoveWidget }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // Provided by useSortable
    index // The current index of the item
  } = useSortable({ id: id, disabled: !isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms ease, box-shadow 250ms ease', // Add smooth transition
    zIndex: isDragging ? 50 : 10, // Ensure dragging item is on top
    opacity: isDragging ? 0.8 : 1, // Slightly transparent when dragging
    boxShadow: isDragging ? '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' : '', // Add shadow when dragging
  };

  if (!widget) return null; // Handle case where widget definition might be missing

  const sizeClasses = {
    small: "md:col-span-1",
    medium: "md:col-span-1 lg:col-span-2",
    large: "md:col-span-2 lg:col-span-2",
    full: "md:col-span-2 lg:col-span-4"
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group", // Base classes
        sizeClasses[widget.defaultSize],
        isEditing ? "cursor-grab" : "", // Use grab cursor when editable
        isDragging ? "cursor-grabbing" : "" // Use grabbing cursor when dragging
        // Removed hover:shadow-md as shadow is applied during drag
      )}
      // Spread attributes for accessibility etc.
      {...attributes}
      // Only spread listeners (drag handle) when editing
      // Apply listeners to the whole div for now, or create a specific handle element
      {...(isEditing ? listeners : {})}
    >
      {/* Render content directly or conditionally based on isEditing */}
      {widget.component}

      {/* Controls shown only when editing */}
      {isEditing && (
        <>
          {/* Optional: Explicit Drag Handle (can apply listeners here instead of whole div) */}
          {/* <button {...listeners} className="absolute top-1 left-1 z-20 p-1 cursor-grab"><GripVertical className="h-4 w-4" /></button> */}

          {/* Remove Button */}
          <div className="absolute -top-2 -right-2 z-40">
            <Button
              variant="destructive"
              size="icon"
              className="h-6 w-6 rounded-full shadow opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation(); // Prevent drag start/area click
                // Need the index here, useSortable provides it
                onRemoveWidget(id, sectionId, index);
              }}
              aria-label="Remove widget"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// --- Content for DragOverlay ---
// Renders the appearance of the widget while it's being dragged
interface WidgetOverlayProps {
    widget: WidgetDefinition | undefined;
    isEditing: boolean; // Pass editing state if overlay appearance depends on it
}

function WidgetOverlayContent({ widget, isEditing }: WidgetOverlayProps) {
    if (!widget) return null;

    const sizeClasses = {
        small: "md:col-span-1",
        medium: "md:col-span-1 lg:col-span-2",
        large: "md:col-span-2 lg:col-span-2",
        full: "md:col-span-2 lg:col-span-4"
    };

    // Render a simplified version or the full component for the overlay
    // Apply necessary classes for sizing and basic styling
    return (
        <div className={cn(
            "rounded-md bg-background shadow-lg border", // Overlay specific styles
            sizeClasses[widget.defaultSize]
        )}>
             {/* You might want a placeholder or the actual component */}
             {/* Using the actual component might be heavy, consider a lighter representation */}
             {widget.component}
             {/* Add a grabbing cursor style */}
             <style>{`.cursor-grabbing { cursor: grabbing !important; }`}</style>
        </div>
    );
}