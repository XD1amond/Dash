"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, Code, Copy, Check, FileImage, File, Table, Info, Link2 } from "lucide-react"
import { exportChartAsPng, getChartEmbedCode, copyToClipboard, exportToCsv } from "@/lib/export-utils"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Export Menu Component
interface ExportMenuProps {
  chartId: string;
  title: string;
  data?: Record<string, any>[];
}

export const ExportMenu = ({ chartId, title, data }: ExportMenuProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmbed = async () => {
    const embedCode = getChartEmbedCode(chartId);
    const success = await copyToClipboard(embedCode);
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Improved image export with better styling
  const handleImageExport = (format: string) => {
    const chartElement = document.getElementById(chartId);
    if (!chartElement) return;
    
    // Get the current theme from the document
    const isDarkTheme = document.documentElement.classList.contains('dark');
    
    // Apply current theme and styling before export
    const originalBackground = chartElement.style.background;
    const originalPadding = chartElement.style.padding;
    const originalColor = chartElement.style.color;
    
    // Set temporary styles for better export
    chartElement.style.background = isDarkTheme ? 'var(--background)' : 'white';
    chartElement.style.color = isDarkTheme ? 'white' : 'black';
    chartElement.style.padding = '20px';
    
    // Export with proper filename
    exportChartAsPng(
      chartId, 
      `${title.toLowerCase().replace(/\s+/g, '-')}.${format}`
    );
    
    // Restore original styles
    setTimeout(() => {
      chartElement.style.background = originalBackground;
      chartElement.style.padding = originalPadding;
      chartElement.style.color = originalColor;
    }, 500);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleImageExport('png')}>
          <File className="h-4 w-4 mr-2" />
          Export as PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleImageExport('jpg')}>
          <FileImage className="h-4 w-4 mr-2" />
          Export as JPG
        </DropdownMenuItem>
        {data && data.length > 0 && (
          <DropdownMenuItem onClick={() => exportToCsv(data, `${title.toLowerCase().replace(/\s+/g, '-')}.csv`)}>
            <Table className="h-4 w-4 mr-2" />
            Export as CSV
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleCopyEmbed}>
          <Code className="h-4 w-4 mr-2" />
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2 text-green-500" />
              Copied!
            </>
          ) : (
            "Copy Embed Code"
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Expanded Widget View Component
interface ExpandedWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  chartId: string;
  children: React.ReactNode;
  data?: Record<string, any>[];
  relatedWidgets?: Array<{id: string, name: string, description: string}>;
}

export const ExpandedWidgetView = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  chartId, 
  children,
  data = [],
  relatedWidgets = []
}: ExpandedWidgetProps) => {
  const [activeTab, setActiveTab] = useState("widget");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[80vw] max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex flex-col h-full">
          <DialogHeader className="flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </div>
          </DialogHeader>
          
          {/* Top half: Widget display */}
          <div className="border rounded-lg p-4 bg-card mb-4 overflow-auto max-h-[40vh]">
            <div id={`expanded-${chartId}`} className="w-full">
              {children}
            </div>
          </div>
          
          {/* Bottom half: Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start mb-4">
              <TabsTrigger value="widget">
                <Info className="h-4 w-4 mr-2" />
                Description
              </TabsTrigger>
              <TabsTrigger value="data">
                <Table className="h-4 w-4 mr-2" />
                Data
              </TabsTrigger>
              <TabsTrigger value="related">
                <Link2 className="h-4 w-4 mr-2" />
                Related
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="widget" className="flex-1 overflow-auto">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">About this widget</h3>
                <p>{description}</p>
                <p className="text-muted-foreground">
                  This widget provides valuable insights into your business performance.
                  You can use this data to make informed decisions and track your progress over time.
                </p>
                <div className="pt-4">
                  <h4 className="font-medium mb-2">Widget Details</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Category: {title.split(" ")[0]}</li>
                    <li>Data updated: Daily</li>
                    <li>Last updated: Today</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="data" className="flex-1 overflow-auto">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Raw Data</h3>
                  <ExportMenu chartId={`expanded-${chartId}`} title={title} data={data} />
                </div>
                {data.length > 0 ? (
                  <div className="border rounded-md overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          {Object.keys(data[0]).map((key, i) => (
                            <th key={i} className="text-left font-medium p-2">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((row, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                            {Object.values(row).map((value, j) => (
                              <td key={j} className="p-2">{value}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No data available for this widget.</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="related" className="flex-1 overflow-auto">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Related Widgets</h3>
                <p className="text-muted-foreground mb-4">
                  These widgets provide complementary insights to {title}.
                </p>
                {relatedWidgets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedWidgets.map((widget) => (
                      <Card key={widget.id} className="overflow-hidden">
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">{widget.name}</CardTitle>
                          <CardDescription>{widget.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No related widgets available.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Widget Wrapper Component
interface WidgetWrapperProps {
  title: string;
  description: string;
  chartId: string;
  children: React.ReactNode;
  data?: Record<string, any>[];
  relatedWidgets?: Array<{id: string, name: string, description: string}>;
}

export const WidgetWrapper = ({ 
  title, 
  description, 
  chartId, 
  children,
  data = [],
  relatedWidgets = []
}: WidgetWrapperProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div 
        className="cursor-pointer transition-transform hover:scale-[1.005] duration-150 ease-out"
        onClick={() => setIsExpanded(true)}
      >
        <Card className="overflow-hidden border hover:border-primary/50 transition-colors duration-150">
          <CardHeader className="flex flex-row items-center">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div id={chartId}>
              {children}
            </div>
          </CardContent>
        </Card>
      </div>

      <ExpandedWidgetView
        isOpen={isExpanded}
        onClose={() => setIsExpanded(false)}
        title={title}
        description={description}
        chartId={chartId}
        data={data}
        relatedWidgets={relatedWidgets}
      >
        {children}
      </ExpandedWidgetView>
    </>
  );
};