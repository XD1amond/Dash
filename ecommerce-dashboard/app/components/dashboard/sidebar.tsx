"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  FileText,
  ShoppingCart,
  Users,
  Package,
  GitBranch,
  Settings,
  ChevronRight,
  Home,
  Menu,
  X,
  Edit3
} from "lucide-react"

interface SidebarProps {
  collapsed?: boolean
  pathname?: string
  orientation?: 'vertical' | 'horizontal'
}

interface SidebarItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  submenu?: {
    title: string
    href: string
  }[]
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    submenu: [
      {
        title: "Overview",
        href: "/dashboard/analytics",
      },
      {
        title: "Business Analytics",
        href: "/dashboard/analytics/business",
      },
      {
        title: "Website Performance",
        href: "/dashboard/analytics/website",
      },
    ],
  },
  {
    title: "Content",
    href: "/dashboard/content",
    icon: FileText,
    submenu: [
      {
        title: "Pages",
        href: "/dashboard/content/pages",
      },
      {
        title: "Templates",
        href: "/dashboard/content/templates",
      },
      {
        title: "Media",
        href: "/dashboard/content/media",
      },
    ],
  },
  {
    title: "CMS",
    href: "/cms",
    icon: Edit3,
    submenu: [
      {
        title: "Dashboard",
        href: "/cms",
      },
      {
        title: "Sanity Studio",
        href: "/studio",
      },
    ],
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    submenu: [
      {
        title: "All Orders",
        href: "/dashboard/orders",
      },
      {
        title: "Processing",
        href: "/dashboard/orders/processing",
      },
      {
        title: "Completed",
        href: "/dashboard/orders/completed",
      },
    ],
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
    submenu: [
      {
        title: "All Customers",
        href: "/dashboard/customers",
      },
      {
        title: "Segments",
        href: "/dashboard/customers/segments",
      },
      {
        title: "Journey",
        href: "/dashboard/customers/journey",
      },
    ],
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
    submenu: [
      {
        title: "All Products",
        href: "/dashboard/products",
      },
      {
        title: "Categories",
        href: "/dashboard/products/categories",
      },
      {
        title: "Inventory",
        href: "/dashboard/products/inventory",
      },
    ],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    submenu: [
      {
        title: "General",
        href: "/dashboard/settings",
      },
      {
        title: "Theme",
        href: "/dashboard/settings/theme",
      },
      {
        title: "Users & Permissions",
        href: "/dashboard/settings/users",
      },
      {
        title: "Integrations",
        href: "/dashboard/settings/integrations",
      },
    ],
  },
]

export function Sidebar({ collapsed = false, orientation = 'vertical' }: SidebarProps) {
  const pathname = usePathname() || "/"
  const [isOpen, setIsOpen] = useState(false)
  const [currentOrientation, setCurrentOrientation] = useState<'vertical' | 'horizontal'>(orientation)
  
  // Check for orientation changes
  useEffect(() => {
    const checkOrientation = () => {
      const body = document.body;
      if (body.classList.contains('layout-horizontal')) {
        setCurrentOrientation('horizontal');
      } else {
        setCurrentOrientation('vertical');
      }
    };
    
    // Initial check
    checkOrientation();
    
    // Create a mutation observer to watch for class changes on body
    const observer = new MutationObserver(checkOrientation);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);
  
  if (currentOrientation === 'horizontal') {
    return (
      <div 
        data-sidebar
        data-orientation="horizontal"
        className="w-full border-b bg-background z-20"
      >
        <div className="container mx-auto">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center mr-6">
              <span className="font-bold text-lg">E-commerce</span>
            </Link>
            
            <nav className="flex-1 overflow-auto">
              <ul className="flex space-x-1">
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                  
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    )
  }
  
  // Vertical sidebar
  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 border-b bg-background">
        <Link href="/" className="flex items-center">
          <span className="font-bold text-lg">E-commerce Dashboard</span>
        </Link>
        <button 
          className="p-2 rounded-md hover:bg-secondary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      
      <div
        data-sidebar
        data-orientation="vertical"
        className={cn(
          "fixed inset-0 z-20 bg-background md:bg-transparent transition-transform md:static md:translate-x-0 border-r",
          isOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "md:w-[70px]" : "md:w-[240px]"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="p-4 hidden md:flex items-center">
            <Link href="/" className="flex items-center">
              {collapsed ? (
                <Home className="h-6 w-6" />
              ) : (
                <span className="font-bold text-xl">E-commerce</span>
              )}
            </Link>
          </div>
          
          <div className="flex flex-col gap-1 p-2 flex-1 overflow-auto">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              
              return (
                <div key={item.href} className="flex flex-col">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("mr-2 h-4 w-4", collapsed && "mr-0")} />
                    {!collapsed && <span>{item.title}</span>}
                    {!collapsed && item.submenu && (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    )}
                  </Link>
                  
                  {!collapsed && isActive && item.submenu && (
                    <div className="ml-4 mt-1 flex flex-col gap-1">
                      {item.submenu.map((submenuItem) => {
                        const isSubmenuActive = pathname === submenuItem.href
                        
                        return (
                          <Link
                            key={submenuItem.href}
                            href={submenuItem.href}
                            className={cn(
                              "flex h-8 items-center rounded-md px-3 text-sm transition-colors",
                              isSubmenuActive
                                ? "bg-secondary font-medium text-foreground"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                          >
                            {submenuItem.title}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}