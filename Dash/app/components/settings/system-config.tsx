"use client"

import { useState, useEffect } from "react"
import { ThemeSelector } from "./theme-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Save, 
  Moon, 
  Sun, 
  Monitor, 
  User, 
  Users, 
  Bell, 
  Link, 
  Unlink, 
  RefreshCw, 
  Check, 
  X, 
  ChevronRight, 
  Settings, 
  Mail, 
  Phone, 
  MapPin, 
  Globe
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SystemConfigProps {
  config: {
    appearance: {
      theme: "light" | "dark" | "system"
      sidebarOrientation: "vertical" | "horizontal"
      density: "compact" | "comfortable" | "spacious"
      borderRadius: "none" | "small" | "medium" | "large"
      animations: boolean
    }
    businessInfo: {
      name: string
      email: string
      phone: string
      address: string
    }
    notifications: {
      email: boolean
      browser: boolean
      mobile: boolean
    }
    integrations: Array<{
      id: string
      name: string
      status: "connected" | "disconnected"
    }>
  }
  roles?: Array<{
    id: string
    name: string
    permissions: string[]
  }>
  users?: Array<{
    id: string
    name: string
    email: string
    role: string
  }>
  onSave?: (config: any) => void
  onAppearanceChange?: (appearance: any) => void
  onConnectIntegration?: (integrationId: string) => void
  onDisconnectIntegration?: (integrationId: string) => void
  onAddUser?: () => void
  onEditUser?: (userId: string) => void
  onDeleteUser?: (userId: string) => void
  onAddRole?: () => void
  onEditRole?: (roleId: string) => void
  onDeleteRole?: (roleId: string) => void
}

export function SystemConfig({
  config,
  roles = [],
  users = [],
  onSave,
  onAppearanceChange,
  onConnectIntegration,
  onDisconnectIntegration,
  onAddUser,
  onEditUser,
  onDeleteUser,
  onAddRole,
  onEditRole,
  onDeleteRole
}: SystemConfigProps) {
  const [currentConfig, setCurrentConfig] = useState(config)
  const [isSaving, setIsSaving] = useState(false)

  const handleAppearanceChange = (field: string, value: any) => {
    setCurrentConfig(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [field]: value
      }
    }))
    if (onAppearanceChange) {
      onAppearanceChange({
        ...currentConfig.appearance,
        [field]: value
      })
    }
    
    // Apply theme changes immediately
    if (field === 'theme') {
      const root = window.document.documentElement;
      
      // Remove all theme classes
      root.classList.remove('light', 'dark', 'catppuccin', 'gruvbox', 'nord');
      
      // Add new theme
      if (['light', 'dark', 'catppuccin', 'gruvbox', 'nord'].includes(value)) {
        root.classList.add(value);
      } else if (value === 'system') {
        // Check system preference
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemPreference);
      }
    }
    
    // Apply sidebar orientation changes
    if (field === 'sidebarOrientation') {
      // Update layout classes on body
      if (value === 'vertical') {
        document.body.classList.remove('layout-horizontal');
        document.body.classList.add('layout-vertical');
      } else {
        document.body.classList.remove('layout-vertical');
        document.body.classList.add('layout-horizontal');
      }
      
      // Force a layout refresh by dispatching a custom event
      window.dispatchEvent(new CustomEvent('layout-change', {
        detail: { orientation: value }
      }));
    }
  }

  const handleBusinessInfoChange = (field: string, value: string) => {
    setCurrentConfig(prev => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        [field]: value
      }
    }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setCurrentConfig(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    if (onSave) {
      await onSave(currentConfig)
    }
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Configuration</h1>
          <p className="text-muted-foreground">
            Manage your system settings and preferences
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="business">Business Info</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="users">Users & Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          
          <Card>
            <CardHeader>
              <CardTitle>Language & Region</CardTitle>
              <CardDescription>
                Set your preferred language and regional settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time (ET)</SelectItem>
                      <SelectItem value="cst">Central Time (CT)</SelectItem>
                      <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the appearance of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Use the new ThemeSelector component */}
              <ThemeSelector
                onThemeChange={(theme) => handleAppearanceChange("theme", theme)}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Layout Options</CardTitle>
              <CardDescription>
                Customize the layout of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Sidebar Orientation</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={currentConfig.appearance.sidebarOrientation === "vertical" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center h-24 gap-2"
                    onClick={() => handleAppearanceChange("sidebarOrientation", "vertical")}
                  >
                    <div className="flex h-12 w-full">
                      <div className="w-1/4 bg-primary/20 h-full rounded-l-md"></div>
                      <div className="w-3/4 bg-muted h-full rounded-r-md"></div>
                    </div>
                    <span>Vertical</span>
                  </Button>
                  <Button
                    variant={currentConfig.appearance.sidebarOrientation === "horizontal" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center h-24 gap-2"
                    onClick={() => handleAppearanceChange("sidebarOrientation", "horizontal")}
                  >
                    <div className="flex flex-col h-12 w-full">
                      <div className="h-1/4 bg-primary/20 w-full rounded-t-md"></div>
                      <div className="h-3/4 bg-muted w-full rounded-b-md"></div>
                    </div>
                    <span>Horizontal</span>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Density</Label>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={currentConfig.appearance.density === "compact" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center h-16 gap-1"
                    onClick={() => handleAppearanceChange("density", "compact")}
                  >
                    <span>Compact</span>
                  </Button>
                  <Button
                    variant={currentConfig.appearance.density === "comfortable" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center h-16 gap-1"
                    onClick={() => handleAppearanceChange("density", "comfortable")}
                  >
                    <span>Comfortable</span>
                  </Button>
                  <Button
                    variant={currentConfig.appearance.density === "spacious" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center h-16 gap-1"
                    onClick={() => handleAppearanceChange("density", "spacious")}
                  >
                    <span>Spacious</span>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Border Radius</Label>
                <div className="grid grid-cols-4 gap-4">
                  <Button
                    variant={currentConfig.appearance.borderRadius === "none" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center h-16 gap-1"
                    onClick={() => handleAppearanceChange("borderRadius", "none")}
                  >
                    <div className="h-6 w-6 border-2 border-current"></div>
                    <span className="text-xs">None</span>
                  </Button>
                  <Button
                    variant={currentConfig.appearance.borderRadius === "small" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center h-16 gap-1"
                    onClick={() => handleAppearanceChange("borderRadius", "small")}
                  >
                    <div className="h-6 w-6 border-2 border-current rounded-sm"></div>
                    <span className="text-xs">Small</span>
                  </Button>
                  <Button
                    variant={currentConfig.appearance.borderRadius === "medium" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center h-16 gap-1"
                    onClick={() => handleAppearanceChange("borderRadius", "medium")}
                  >
                    <div className="h-6 w-6 border-2 border-current rounded-md"></div>
                    <span className="text-xs">Medium</span>
                  </Button>
                  <Button
                    variant={currentConfig.appearance.borderRadius === "large" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center h-16 gap-1"
                    onClick={() => handleAppearanceChange("borderRadius", "large")}
                  >
                    <div className="h-6 w-6 border-2 border-current rounded-lg"></div>
                    <span className="text-xs">Large</span>
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="animations">Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable animations throughout the dashboard
                  </p>
                </div>
                <Switch
                  id="animations"
                  checked={currentConfig.appearance.animations}
                  onCheckedChange={(checked) => handleAppearanceChange("animations", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Update your business details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input 
                  id="businessName" 
                  value={currentConfig.businessInfo.name} 
                  onChange={(e) => handleBusinessInfoChange("name", e.target.value)}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Email</Label>
                  <div className="flex">
                    <div className="bg-muted p-2 rounded-l-md flex items-center">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input 
                      id="businessEmail" 
                      className="rounded-l-none"
                      value={currentConfig.businessInfo.email} 
                      onChange={(e) => handleBusinessInfoChange("email", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Phone</Label>
                  <div className="flex">
                    <div className="bg-muted p-2 rounded-l-md flex items-center">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input 
                      id="businessPhone" 
                      className="rounded-l-none"
                      value={currentConfig.businessInfo.phone} 
                      onChange={(e) => handleBusinessInfoChange("phone", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessAddress">Address</Label>
                <div className="flex">
                  <div className="bg-muted p-2 rounded-l-md flex items-center">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Textarea 
                    id="businessAddress" 
                    className="rounded-l-none min-h-[80px]"
                    value={currentConfig.businessInfo.address} 
                    onChange={(e) => handleBusinessInfoChange("address", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch 
                  id="emailNotifications" 
                  checked={currentConfig.notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="browserNotifications">Browser Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications in your browser
                  </p>
                </div>
                <Switch 
                  id="browserNotifications" 
                  checked={currentConfig.notifications.browser}
                  onCheckedChange={(checked) => handleNotificationChange("browser", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="mobileNotifications">Mobile Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications on your mobile device
                  </p>
                </div>
                <Switch 
                  id="mobileNotifications" 
                  checked={currentConfig.notifications.mobile}
                  onCheckedChange={(checked) => handleNotificationChange("mobile", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Services</CardTitle>
              <CardDescription>
                Manage your third-party service integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentConfig.integrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Settings className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium">{integration.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {integration.status === "connected" ? "Connected" : "Disconnected"}
                      </p>
                    </div>
                  </div>
                  {integration.status === "connected" ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDisconnectIntegration && onDisconnectIntegration(integration.id)}
                    >
                      <Unlink className="mr-2 h-4 w-4" />
                      Disconnect
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onConnectIntegration && onConnectIntegration(integration.id)}
                    >
                      <Link className="mr-2 h-4 w-4" />
                      Connect
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Users</CardTitle>
                  <CardDescription>
                    Manage user accounts
                  </CardDescription>
                </div>
                <Button size="sm" onClick={onAddUser}>
                  <User className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium">Name</th>
                        <th className="p-2 text-left font-medium">Email</th>
                        <th className="p-2 text-left font-medium">Role</th>
                        <th className="p-2 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="p-2">{user.name}</td>
                            <td className="p-2">{user.email}</td>
                            <td className="p-2">
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                {user.role}
                              </span>
                            </td>
                            <td className="p-2">
                              <div className="flex space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => onEditUser && onEditUser(user.id)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => onDeleteUser && onDeleteUser(user.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-4 text-center">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Roles & Permissions</CardTitle>
                  <CardDescription>
                    Manage user roles and permissions
                  </CardDescription>
                </div>
                <Button size="sm" onClick={onAddRole}>
                  <Users className="mr-2 h-4 w-4" />
                  Add Role
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium">Role</th>
                        <th className="p-2 text-left font-medium">Permissions</th>
                        <th className="p-2 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roles.length > 0 ? (
                        roles.map((role) => (
                          <tr key={role.id} className="border-b">
                            <td className="p-2 font-medium">{role.name}</td>
                            <td className="p-2">
                              <div className="flex flex-wrap gap-1">
                                {role.permissions.slice(0, 3).map((permission, index) => (
                                  <span key={index} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                                    {permission}
                                  </span>
                                ))}
                                {role.permissions.length > 3 && (
                                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                                    +{role.permissions.length - 3} more
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="flex space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => onEditRole && onEditRole(role.id)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => onDeleteRole && onDeleteRole(role.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="p-4 text-center">
                            No roles found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
