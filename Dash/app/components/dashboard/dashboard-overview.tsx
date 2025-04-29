"use client"

import React, { useState, useEffect, useCallback } from "react" // Added React and useCallback
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, Pencil, X, Plus, Move, Save, ChevronLeft, Filter, Search } from "lucide-react" // Added Filter and Search
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Input } from "@/components/ui/input" // Added Input import
// Removed StatCard import as it's used within widgets
// Removed Chart imports as they are used within widgets
import { CustomizableLayout, WidgetDefinition, LayoutSection } from "@/components/dashboard/customizable-layout" // Ensure LayoutSection is imported
import { cn } from "@/lib/utils"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd" // Added dnd imports and DropResult type
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu" // Added dropdown menu imports

// Import widget modules & layouts
import { createStatCardWidgets } from "@/components/dashboard/widgets/stat-card-widgets"
import { analyticsWidgets, defaultAnalyticsLayout } from "@/components/dashboard/widgets/analytics-widgets"
import { performanceWidgets, defaultPerformanceLayout } from "@/components/dashboard/widgets/performance-widgets"
import { forecastWidgets, defaultForecastLayout } from "@/components/dashboard/widgets/forecast-widgets"
import { createOverviewWidgets, defaultOverviewLayout } from "@/components/dashboard/widgets/overview-widgets"
import { businessWidgets, defaultBusinessLayout } from "@/components/dashboard/widgets/business-widgets"
import { websiteWidgets, defaultWebsiteLayout } from "@/components/dashboard/widgets/website-widgets"
import { marketingWidgets, defaultMarketingLayout } from "@/components/dashboard/widgets/marketing-widgets"
import { productWidgets, defaultProductLayout } from "@/components/dashboard/widgets/product-widgets"
import { customerWidgets, defaultCustomerLayout } from "@/components/dashboard/widgets/customer-widgets"

import { DateRange } from "react-day-picker"

interface DashboardOverviewProps {
  stats: Array<{
    title: string
    value: string
    change: number
    changeType: "increase" | "decrease"
  }>
  revenueData: any[]
  salesData: any[]
  visitorsData: any[]
  conversionData: any[]
  onDateRangeChange?: (range: { from: Date; to: Date }) => void
  onExport?: () => void
}

export function DashboardOverview({
  stats,
  revenueData,
  salesData,
  visitorsData,
  conversionData,
  onDateRangeChange,
  onExport
}: DashboardOverviewProps) {
  // --- Global State ---
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview") // Track active tab
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })

  // --- Widget Definitions (Memoized) ---
  // Use useCallback to memoize widget creation functions based on dependencies
  const statCardWidgets = React.useMemo(() => createStatCardWidgets(stats), [stats]);
  const overviewChartWidgets = React.useMemo(() => createOverviewWidgets(revenueData, salesData, visitorsData, conversionData), [revenueData, salesData, visitorsData, conversionData]);

  // Combine all widgets available for the 'overview' tab instance
  const allOverviewTabWidgets = React.useMemo(() => [
      ...statCardWidgets, ...overviewChartWidgets, ...businessWidgets, ...websiteWidgets,
      ...marketingWidgets, ...productWidgets, ...customerWidgets, ...analyticsWidgets,
      ...performanceWidgets, ...forecastWidgets
  ], [statCardWidgets, overviewChartWidgets]); // Dependencies include memoized widgets

  // Map instance IDs to their full available widget lists
  const availableWidgetsMap: Record<string, WidgetDefinition[]> = React.useMemo(() => ({
    header: statCardWidgets,
    overview: allOverviewTabWidgets,
    business: businessWidgets,
    website: websiteWidgets,
    marketing: marketingWidgets,
    products: productWidgets,
    customers: customerWidgets,
    analytics: analyticsWidgets,
    performance: performanceWidgets,
    forecast: forecastWidgets,
  }), [statCardWidgets, allOverviewTabWidgets]); // Dependency

  // --- Layout State ---
  const [headerLayoutState, setHeaderLayoutState] = useState<LayoutSection[]>(() => [
    { id: "header-stats", title: "Key Performance Indicators", widgets: statCardWidgets.map(w => w.id) }
  ]);
  const [tabLayoutStates, setTabLayoutStates] = useState<Record<string, LayoutSection[]>>({
    overview: defaultOverviewLayout,
    business: defaultBusinessLayout,
    website: defaultWebsiteLayout,
    marketing: defaultMarketingLayout,
    products: defaultProductLayout,
    customers: defaultCustomerLayout,
    analytics: defaultAnalyticsLayout,
    performance: defaultPerformanceLayout,
    forecast: defaultForecastLayout,
  });

  // --- Sidebar State ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTargetInstanceId, setSidebarTargetInstanceId] = useState<string | null>(null);
  const [sidebarTargetSectionId, setSidebarTargetSectionId] = useState<string | null>(null);
  const [sidebarAvailableWidgets, setSidebarAvailableWidgets] = useState<WidgetDefinition[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [sizeFilter, setSizeFilter] = useState<string | null>(null);

  // --- Event Handlers ---
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range) {
        setDateRange(range);
        if (range.from && range.to && onDateRangeChange) {
            onDateRangeChange({ from: range.from, to: range.to });
        }
    }
  };

  // Called by CustomizableLayout when its layout changes (drag/drop internal)
  const handleLayoutChange = useCallback((instanceId: string, newLayout: LayoutSection[]) => {
    console.log(`Layout change reported for instance: ${instanceId}`, newLayout);
    if (instanceId === 'header') {
      setHeaderLayoutState(newLayout);
      // TODO: Persist header layout change here
    } else {
      setTabLayoutStates(prev => ({
        ...prev,
        [instanceId]: newLayout,
      }));
      // TODO: Persist tab layout change here
    }
  }, []); // No dependencies needed if it only sets state

  // Called by CustomizableLayout when its area is clicked in edit mode
  const handleAreaSelect = useCallback((instanceId: string, sectionId: string, availableWidgetsForArea: WidgetDefinition[]) => {
    if (!isEditing) return;
    console.log(`Area selected: instance=${instanceId}, section=${sectionId}`);

    const currentLayout = instanceId === 'header' ? headerLayoutState : tabLayoutStates[instanceId];
    const currentWidgetsInSection = currentLayout.find(s => s.id === sectionId)?.widgets || [];

    // For header (Key Performance Indicators), allow any small widget regardless of section
    let filteredWidgets;
    if (instanceId === 'header') {
      filteredWidgets = Object.values(availableWidgetsMap)
        .flat()
        .filter(widget =>
          widget.defaultSize === "small" &&
          !currentWidgetsInSection.includes(widget.id)
        );
    } else {
      filteredWidgets = availableWidgetsForArea.filter(
        widget => !currentWidgetsInSection.includes(widget.id)
      );
    }

    setSidebarTargetInstanceId(instanceId);
    setSidebarTargetSectionId(sectionId);
    setSidebarAvailableWidgets(filteredWidgets);
    setSidebarOpen(true);
    
    // Set the initial tab based on the instance
    if (instanceId === 'header' || instanceId === 'overview') {
      setSelectedTab(null); // Show all tabs for header and overview
    } else {
      setSelectedTab(instanceId); // Show only the relevant tab for other sections
    }
  }, [isEditing, headerLayoutState, tabLayoutStates, availableWidgetsMap]); // Dependencies

  // Called by the sidebar to add a widget OR when dragging from library
  const addWidgetToTarget = useCallback((widgetId: string, targetInstanceId: string, targetSectionId: string, targetIndex?: number) => {
    console.log(`Adding widget ${widgetId} to instance ${targetInstanceId}, section ${targetSectionId} at index ${targetIndex}`);

    const isHeader = targetInstanceId === 'header';
    const currentLayout = isHeader ? headerLayoutState : tabLayoutStates[targetInstanceId];

    const newLayout = currentLayout.map(section => {
      if (section.id === targetSectionId) {
        const newWidgets = [...section.widgets];
        if (!newWidgets.includes(widgetId)) { // Prevent duplicates
          if (targetIndex !== undefined && targetIndex !== null) {
            newWidgets.splice(targetIndex, 0, widgetId);
          } else {
            newWidgets.push(widgetId); // Add to end if no index
          }
          return { ...section, widgets: newWidgets };
        }
      }
      return section;
    });

    // Update the state via the main handler
    handleLayoutChange(targetInstanceId, newLayout);

    // If the sidebar is open and targeting this section, re-filter its widgets
    if (sidebarOpen && sidebarTargetInstanceId === targetInstanceId && sidebarTargetSectionId === targetSectionId) {
      setSidebarAvailableWidgets(prev => prev.filter(w => w.id !== widgetId));
    }
  }, [headerLayoutState, tabLayoutStates, handleLayoutChange, sidebarOpen, sidebarTargetInstanceId, sidebarTargetSectionId]); // Dependencies

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
    setSidebarTargetInstanceId(null);
    setSidebarTargetSectionId(null);
    setSidebarAvailableWidgets([]);
    setSearchQuery("");
    setSizeFilter(null);
    setSelectedTab(null);
  }, []);

  // Toggle Edit Mode - also closes sidebar
  const toggleEditing = useCallback(() => {
    const nextEditingState = !isEditing;
    setIsEditing(nextEditingState);
    if (!nextEditingState) {
      closeSidebar();
    }
  }, [isEditing, closeSidebar]);

  // --- Drag and Drop Handler for Library -> Dashboard ---
  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside a valid destination
    if (!destination) {
      return;
    }

    // Ensure it's dragging from the library to a dashboard section
    if (source.droppableId === "widget-library" && destination.droppableId !== "widget-library") {
      const widgetId = draggableId.replace("library-", ""); // Extract widget ID
      const targetInstanceId = Object.keys(tabLayoutStates).find(key => tabLayoutStates[key].some(sec => sec.id === destination.droppableId)) || (headerLayoutState.some(sec => sec.id === destination.droppableId) ? 'header' : null);
      const targetSectionId = destination.droppableId;
      const targetIndex = destination.index;

      if (widgetId && targetInstanceId && targetSectionId) {
         // // Check if the drop target instance matches the sidebar target (if open)
         // // This prevents adding to a section that wasn't explicitly selected via click
         // if (sidebarOpen && (sidebarTargetInstanceId !== targetInstanceId || sidebarTargetSectionId !== targetSectionId)) {
         //    console.warn("Drag target does not match selected area. Ignoring drop.");
         //    // Optionally provide user feedback here
         //    return;
         // }
         // If sidebar isn't open, or if target matches, proceed to add
         // --- Allow adding even if target doesn't match selected area ---
         addWidgetToTarget(widgetId, targetInstanceId, targetSectionId, targetIndex);
      } else {
          console.error("Could not determine target instance or section for drop");
      }
    }
    // Internal reordering within a CustomizableLayout is handled by its own onDragEnd -> onLayoutChange
  }, [addWidgetToTarget, headerLayoutState, tabLayoutStates, sidebarOpen, sidebarTargetInstanceId, sidebarTargetSectionId]);


  return (
    // Wrap relevant parts in DragDropContext for library -> dashboard drag
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="relative space-y-6">
        {/* Header Section (Title, Buttons) */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your e-commerce performance and key metrics
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={toggleEditing}
              className="mr-2"
            >
              {isEditing ? <><Save className="mr-2 h-4 w-4" />Save Layout</> : <><Pencil className="mr-2 h-4 w-4" />Customize</>}
            </Button>
            <DateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              align="end"
            />
            <Button variant="outline" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Customizable Header Area */}
        <div className={cn("mb-6 rounded-lg", isEditing ? "bg-muted/10 ring-1 ring-blue-300/50 transition-all duration-200" : "")}>
          {/* Note: Outline applied to wrapper, padding handled by CustomizableLayout's internal wrapper */}
          <CustomizableLayout
            instanceId="header"
            isEditing={isEditing}
            availableWidgets={availableWidgetsMap['header']}
            layout={headerLayoutState}
            onLayoutChange={handleLayoutChange}
            onAreaSelect={handleAreaSelect}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="website">Website</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
          </TabsList>

          {/* Render TabsContent dynamically */}
          {Object.keys(tabLayoutStates).map(tabId => (
            <TabsContent key={tabId} value={tabId} className="mt-0"> {/* Ensure no top margin from TabsContent */}
               <div className={cn("space-y-4 rounded-lg", isEditing && activeTab === tabId ? "bg-muted/10 ring-1 ring-blue-300/50 transition-all duration-200" : "")}>
                 <CustomizableLayout
                   instanceId={tabId}
                   isEditing={isEditing}
                   availableWidgets={availableWidgetsMap[tabId]}
                   layout={tabLayoutStates[tabId]}
                   onLayoutChange={handleLayoutChange}
                   onAreaSelect={handleAreaSelect}
                 />
               </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* --- Render Sidebar --- */}
        <div
          className={`fixed top-0 right-0 h-full bg-background border-l shadow-lg z-[60] transition-transform duration-300 transform ${ // Increased z-index
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ width: '350px' }}
          aria-hidden={!sidebarOpen}
        >
          <div className="h-full flex flex-col p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg">Widget Library</h3>
              <Button variant="ghost" size="icon" onClick={closeSidebar} className="h-8 w-8" aria-label="Close widget library">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {sidebarTargetSectionId
                ? `Available for: ${sidebarTargetInstanceId} / ${sidebarTargetSectionId}`
                : "Select an area to customize"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
               Drag widgets to the target section or click the Add button below.
            </p>

            {/* Search, Tabs, and Filter controls */}
            <div className="space-y-4 mb-4">
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search widgets..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Tabs for sections */}
              <Tabs
                value={selectedTab || "all"}
                onValueChange={(value) => setSelectedTab(value === "all" ? null : value)}
                className="w-full"
              >
                <TabsList className="w-full flex flex-wrap h-auto py-1">
                  <TabsTrigger value="all" className="flex-grow">All</TabsTrigger>
                  {(sidebarTargetInstanceId === 'header' || sidebarTargetInstanceId === 'overview') ? (
                    // Show all tabs for header and overview
                    <>
                      <TabsTrigger value="business" className="flex-grow">Business</TabsTrigger>
                      <TabsTrigger value="website" className="flex-grow">Website</TabsTrigger>
                      <TabsTrigger value="marketing" className="flex-grow">Marketing</TabsTrigger>
                      <TabsTrigger value="products" className="flex-grow">Products</TabsTrigger>
                      <TabsTrigger value="customers" className="flex-grow">Customers</TabsTrigger>
                      <TabsTrigger value="analytics" className="flex-grow">Analytics</TabsTrigger>
                      <TabsTrigger value="performance" className="flex-grow">Performance</TabsTrigger>
                      <TabsTrigger value="forecast" className="flex-grow">Forecast</TabsTrigger>
                    </>
                  ) : (
                    // Show only the relevant tab for other sections
                    <TabsTrigger value={sidebarTargetInstanceId || ""} className="flex-grow">
                      {sidebarTargetInstanceId ? sidebarTargetInstanceId.charAt(0).toUpperCase() + sidebarTargetInstanceId.slice(1) : ""}
                    </TabsTrigger>
                  )}
                </TabsList>
              </Tabs>
              
              {/* Size filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {sizeFilter ? `Size: ${sizeFilter}` : "Filter by size"}
                    <Filter className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 z-[70]"> {/* Added higher z-index */}
                  <DropdownMenuCheckboxItem
                    checked={sizeFilter === null}
                    onCheckedChange={() => setSizeFilter(null)}
                  >
                    All sizes
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sizeFilter === "small"}
                    onCheckedChange={() => setSizeFilter(sizeFilter === "small" ? null : "small")}
                  >
                    Small
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sizeFilter === "medium"}
                    onCheckedChange={() => setSizeFilter(sizeFilter === "medium" ? null : "medium")}
                  >
                    Medium
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sizeFilter === "large"}
                    onCheckedChange={() => setSizeFilter(sizeFilter === "large" ? null : "large")}
                  >
                    Large
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sizeFilter === "full"}
                    onCheckedChange={() => setSizeFilter(sizeFilter === "full" ? null : "full")}
                  >
                    Full
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              {/* Droppable area for the library items */}
              <Droppable droppableId="widget-library" type="WIDGET" isDropDisabled={true}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-3"
                  >
                    {sidebarAvailableWidgets.length === 0 && sidebarTargetSectionId && (
                       <p className="text-sm text-muted-foreground italic text-center py-4">No more widgets available for this section.</p>
                    )}
                    {sidebarAvailableWidgets
                      .filter(widget => {
                        // Apply search filter
                        const matchesSearch = searchQuery === "" ||
                          widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          widget.description.toLowerCase().includes(searchQuery.toLowerCase());
                        
                        // Apply tab filter
                        const matchesTab = selectedTab === null ||
                          widget.category.toLowerCase() === selectedTab.toLowerCase();
                        
                        // Apply size filter
                        const matchesSize = sizeFilter === null ||
                          widget.defaultSize === sizeFilter;
                        
                        return matchesSearch && matchesTab && matchesSize;
                      })
                      .map((widget, index) => (
                      <Draggable key={widget.id} draggableId={`library-${widget.id}`} index={index}>
                        {(providedDraggable, snapshotDraggable) => (
                          // Wrap with div for ref and props
                          <div
                             ref={providedDraggable.innerRef}
                             {...providedDraggable.draggableProps}
                             {...providedDraggable.dragHandleProps} // Apply handle props here
                             style={{...providedDraggable.draggableProps.style}} // Apply style for smooth drag
                             className={cn(snapshotDraggable.isDragging ? "opacity-80 shadow-lg rounded-md" : "")} // Style during drag
                           >
                            <Card className="cursor-grab hover:border-primary">
                              <CardHeader className="p-3">
                                <CardTitle className="text-sm">{widget.name}</CardTitle>
                                <CardDescription className="text-xs">
                                  {widget.defaultSize} · {widget.category}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="p-3 pt-0">
                                <p className="text-xs text-muted-foreground">{widget.description}</p>
                                <div className="flex justify-end mt-2">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => {
                                        if (sidebarTargetInstanceId && sidebarTargetSectionId) {
                                            addWidgetToTarget(widget.id, sidebarTargetInstanceId, sidebarTargetSectionId);
                                        }
                                    }}
                                    disabled={!sidebarTargetSectionId}
                                    aria-label={`Add ${widget.name} widget`}
                                  >
                                    <Plus className="mr-1 h-3 w-3" />
                                    Add
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {sidebarAvailableWidgets.length > 0 &&
                     sidebarAvailableWidgets.filter(widget => {
                       const matchesSearch = searchQuery === "" ||
                         widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         widget.description.toLowerCase().includes(searchQuery.toLowerCase());
                       
                       const matchesTab = selectedTab === null ||
                         widget.category.toLowerCase() === selectedTab.toLowerCase();
                       
                       const matchesSize = sizeFilter === null ||
                         widget.defaultSize === sizeFilter;
                       
                       return matchesSearch && matchesTab && matchesSize;
                     }).length === 0 && (
                      <p className="text-sm text-muted-foreground italic text-center py-4">
                        No widgets match your filters.
                      </p>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
        {/* --- End Sidebar --- */}
      </div>
    </DragDropContext>
  )
}