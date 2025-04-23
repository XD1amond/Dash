"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>('vertical')
  
  // Check for orientation changes
  useEffect(() => {
    const checkOrientation = () => {
      const body = document.body;
      if (body.classList.contains('layout-horizontal')) {
        setOrientation('horizontal');
      } else {
        setOrientation('vertical');
      }
    };
    
    // Initial check
    checkOrientation();
    
    // Create a mutation observer to watch for class changes on body
    const observer = new MutationObserver(checkOrientation);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {orientation === 'horizontal' ? (
        // Horizontal layout
        <div className="flex-1 flex flex-col">
          <div className="border-b">
            <Sidebar orientation="horizontal" pathname={pathname} />
          </div>
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      ) : (
        // Vertical layout
        <div className="flex-1">
          <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-4rem)]">
            <ResizablePanel
              defaultSize={20}
              minSize={15}
              maxSize={20}
              collapsible={true}
              collapsedSize={4}
              onCollapse={() => setCollapsed(true)}
              onExpand={() => setCollapsed(false)}
              className="border-r"
            >
              <Sidebar collapsed={collapsed} pathname={pathname} orientation="vertical" />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={80}>
              <main className="p-6">
                {children}
              </main>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </div>
  )
}