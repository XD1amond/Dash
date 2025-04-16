"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { VisualEditor } from "@/components/cms/visual-editor"
import {
  Search,
  Filter,
  Plus,
  Upload,
  MoreHorizontal,
  Edit,
  Trash,
  Copy,
  Eye,
  Calendar,
  Image,
  FileText,
  File,
  Video,
  Save,
  X,
  ChevronDown
} from "lucide-react"

interface Page {
  id: string
  title: string
  slug: string
  status: string
  updatedAt: string
}

interface Template {
  id: string
  name: string
  description: string
}

interface MediaItem {
  id: string
  name: string
  type: string
  url: string
  size: number
}

interface CMSDashboardProps {
  pages: Page[]
  templates: Template[]
  mediaItems: MediaItem[]
  onCreatePage?: () => void
  onCreateTemplate?: () => void
  onUploadMedia?: () => void
  onSearch?: (query: string) => void
  onFilter?: (filter: any) => void
}

export function CMSDashboard({
  pages,
  templates,
  mediaItems,
  onCreatePage,
  onCreateTemplate,
  onUploadMedia,
  onSearch,
  onFilter
}: CMSDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("pages")
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [editedContent, setEditedContent] = useState<string>("")
  
  // Example page content for demo
  const pageContents: Record<string, string> = {
    "page-1": `
      <div class="max-w-4xl mx-auto py-12 px-4">
        <h1 class="text-4xl font-bold mb-6">Welcome to Our Store</h1>
        <p class="text-lg mb-8">Discover the latest products and exclusive deals.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-4">New Arrivals</h2>
            <p>Check out our latest products and collections.</p>
            <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Shop Now</button>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-4">Special Offers</h2>
            <p>Limited time deals on selected items.</p>
            <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded">View Offers</button>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-4">Customer Reviews</h2>
            <p>See what our customers are saying about us.</p>
            <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Read Reviews</button>
          </div>
        </div>
        
        <div class="bg-gray-100 p-8 rounded-lg">
          <h2 class="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p class="mb-4">Stay updated with the latest products and exclusive offers.</p>
          <div class="flex gap-2">
            <input type="email" placeholder="Your email address" class="px-4 py-2 rounded flex-1" />
            <button class="px-4 py-2 bg-blue-600 text-white rounded">Subscribe</button>
          </div>
        </div>
      </div>
    `,
    "page-2": `
      <div class="max-w-4xl mx-auto py-12 px-4">
        <h1 class="text-4xl font-bold mb-6">About Us</h1>
        <p class="text-lg mb-8">Learn more about our company and mission.</p>
        
        <div class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">Our Story</h2>
          <p class="mb-4">
            Founded in 2010, our company has grown from a small startup to a leading e-commerce platform.
            We are dedicated to providing high-quality products and exceptional customer service.
          </p>
          <p>
            Our mission is to make online shopping easy, enjoyable, and accessible to everyone.
            We carefully select our products to ensure they meet our standards of quality and value.
          </p>
        </div>
        
        <div class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">Our Team</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-4 rounded-lg shadow-md text-center">
              <div class="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 class="font-semibold">John Doe</h3>
              <p class="text-sm text-gray-600">CEO & Founder</p>
            </div>
            
            <div class="bg-white p-4 rounded-lg shadow-md text-center">
              <div class="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 class="font-semibold">Jane Smith</h3>
              <p class="text-sm text-gray-600">CTO</p>
            </div>
            
            <div class="bg-white p-4 rounded-lg shadow-md text-center">
              <div class="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 class="font-semibold">Mike Johnson</h3>
              <p class="text-sm text-gray-600">Head of Design</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-100 p-8 rounded-lg">
          <h2 class="text-2xl font-bold mb-4">Contact Us</h2>
          <p class="mb-4">Have questions or feedback? We'd love to hear from you!</p>
          <button class="px-4 py-2 bg-blue-600 text-white rounded">Get in Touch</button>
        </div>
      </div>
    `,
    "page-3": `
      <div class="max-w-4xl mx-auto py-12 px-4">
        <h1 class="text-4xl font-bold mb-6">Contact Us</h1>
        <p class="text-lg mb-8">We'd love to hear from you. Get in touch with our team.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 class="text-2xl font-semibold mb-4">Send Us a Message</h2>
            <form class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1">Name</label>
                <input type="text" class="w-full px-4 py-2 border rounded" placeholder="Your name" />
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-1">Email</label>
                <input type="email" class="w-full px-4 py-2 border rounded" placeholder="Your email" />
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-1">Subject</label>
                <input type="text" class="w-full px-4 py-2 border rounded" placeholder="Subject" />
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-1">Message</label>
                <textarea class="w-full px-4 py-2 border rounded h-32" placeholder="Your message"></textarea>
              </div>
              
              <button class="px-6 py-2 bg-blue-600 text-white rounded">Send Message</button>
            </form>
          </div>
          
          <div>
            <h2 class="text-2xl font-semibold mb-4">Contact Information</h2>
            <div class="space-y-4">
              <div>
                <h3 class="font-semibold">Address</h3>
                <p>123 Commerce Street, Business City, BC 12345</p>
              </div>
              
              <div>
                <h3 class="font-semibold">Phone</h3>
                <p>+1 (555) 123-4567</p>
              </div>
              
              <div>
                <h3 class="font-semibold">Email</h3>
                <p>info@example.com</p>
              </div>
              
              <div>
                <h3 class="font-semibold">Business Hours</h3>
                <p>Monday - Friday: 9am - 5pm</p>
                <p>Saturday: 10am - 2pm</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-100 p-8 rounded-lg">
          <h2 class="text-2xl font-bold mb-4">Follow Us</h2>
          <p class="mb-4">Stay connected with us on social media.</p>
          <div class="flex gap-4">
            <button class="p-2 bg-blue-600 text-white rounded-full">FB</button>
            <button class="p-2 bg-blue-400 text-white rounded-full">TW</button>
            <button class="p-2 bg-pink-600 text-white rounded-full">IG</button>
            <button class="p-2 bg-blue-800 text-white rounded-full">LI</button>
          </div>
        </div>
      </div>
    `
  }
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }
  
  // Handle page selection
  const handlePageSelect = (page: Page) => {
    setSelectedPage(page)
    setEditedContent(pageContents[page.id] || "")
    setIsEditing(false)
    setPreviewMode(true)
  }
  
  // Handle edit mode
  const handleEditMode = () => {
    setIsEditing(true)
    setPreviewMode(false)
  }
  
  // Handle preview mode
  const handlePreviewMode = () => {
    setIsEditing(false)
    setPreviewMode(true)
  }
  
  // Handle save content
  const handleSaveContent = (components: any) => {
    if (selectedPage) {
      // In a real implementation, this would save to a database
      console.log("Saving components:", components)
      setIsEditing(false)
      setPreviewMode(true)
    }
  }
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    else return (bytes / 1048576).toFixed(1) + ' MB'
  }
  
  // Get media icon
  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-6 w-6" />
      case 'video':
        return <Video className="h-6 w-6" />
      case 'document':
        return <FileText className="h-6 w-6" />
      default:
        return <File className="h-6 w-6" />
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">
            Manage your website content, pages, and media
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-r-none w-full md:w-auto"
            />
            <Button type="submit" variant="secondary" className="rounded-l-none">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>
      
      {selectedPage ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{selectedPage.title}</h2>
              <p className="text-sm text-muted-foreground">/{selectedPage.slug}</p>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handlePreviewMode}>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button onClick={handleSaveContent}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setSelectedPage(null)}>
                    <X className="mr-2 h-4 w-4" />
                    Close
                  </Button>
                  <Button onClick={handleEditMode}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Visual Page Editor</CardTitle>
                <CardDescription>
                  Drag and drop to build your page
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px]">
                  <VisualEditor onSave={handleSaveContent} />
                </div>
              </CardContent>
            </Card>
          ) : previewMode && (
            <Card>
              <CardHeader>
                <CardTitle>Page Preview</CardTitle>
                <CardDescription>
                  Preview how the page will look on your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4 min-h-[400px] bg-white">
                  <h1 className="text-3xl font-bold mb-4">Welcome to Our Store</h1>
                  <p className="mb-6">Discover the latest products and exclusive deals.</p>
                  
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-50 p-4 rounded-md">
                      <h2 className="text-xl font-semibold mb-2">New Arrivals</h2>
                      <p>Check out our latest products and collections.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <h2 className="text-xl font-semibold mb-2">Special Offers</h2>
                      <p>Limited time deals on selected items.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <h2 className="text-xl font-semibold mb-2">Customer Reviews</h2>
                      <p>See what our customers are saying about us.</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-100 p-6 rounded-md">
                    <h2 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
                    <p className="mb-4">Stay updated with the latest products and exclusive offers.</p>
                    <div className="flex gap-2">
                      <input type="email" placeholder="Your email address" className="px-4 py-2 rounded flex-1 border" />
                      <button className="px-4 py-2 bg-blue-600 text-white rounded">Subscribe</button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="media">Media Library</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pages" className="space-y-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Website Pages</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={onCreatePage}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Page
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Page</DialogTitle>
                    <DialogDescription>
                      Enter the details for your new page
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Page Title</Label>
                      <Input id="title" placeholder="Enter page title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input id="slug" placeholder="enter-url-slug" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="template">Template</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Page</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pages.map(page => (
                <Card key={page.id} className="cursor-pointer hover:border-primary" onClick={() => handlePageSelect(page)}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{page.title}</CardTitle>
                      <Badge variant={page.status === "published" ? "default" : "outline"}>
                        {page.status}
                      </Badge>
                    </div>
                    <CardDescription>/{page.slug}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      Updated {new Date(page.updatedAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="flex justify-between items-center w-full">
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/preview/${page.slug}`, '_blank');
                      }}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handlePageSelect(page);
                            handleEditMode();
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Page Templates</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={onCreateTemplate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Template
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Template</DialogTitle>
                    <DialogDescription>
                      Enter the details for your new template
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Template Name</Label>
                      <Input id="name" placeholder="Enter template name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Enter template description" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Template</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map(template => (
                <Card key={template.id}>
                  <CardHeader>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <div className="flex justify-between items-center w-full">
                      <Button variant="ghost" size="sm" onClick={() => {
                        // Open template in visual editor
                        setSelectedPage({
                          id: template.id,
                          title: template.name,
                          slug: template.id,
                          status: "template",
                          updatedAt: new Date().toISOString()
                        });
                        setPreviewMode(true);
                      }}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            // Open template in visual editor
                            setSelectedPage({
                              id: template.id,
                              title: template.name,
                              slug: template.id,
                              status: "template",
                              updatedAt: new Date().toISOString()
                            });
                            handleEditMode();
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="media" className="space-y-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Media Library</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={onUploadMedia}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Media
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Media</DialogTitle>
                    <DialogDescription>
                      Upload images, videos, or documents to your media library
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="border-2 border-dashed rounded-md p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop files here or click to browse
                      </p>
                      <Button variant="outline" size="sm">
                        Browse Files
                      </Button>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Upload</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {mediaItems.map(item => (
                <Card key={item.id}>
                  <div className="aspect-square relative bg-muted flex items-center justify-center">
                    {item.type === "image" ? (
                      <img 
                        src={item.url} 
                        alt={item.name} 
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        {getMediaIcon(item.type)}
                        <span className="text-sm mt-2">{item.type}</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <div className="truncate font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{formatFileSize(item.size)}</div>
                  </CardContent>
                  <CardFooter className="p-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full">
                          Actions
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}