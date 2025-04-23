"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Label } from "../ui/label"
import { Badge } from "../ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Skeleton } from "../ui/skeleton"
import { client } from "../../../sanity/lib/client"
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
  ExternalLink,
  X,
  ChevronDown,
  Settings
} from "lucide-react"

interface SanityDashboardProps {
  initialData?: {
    pages?: any[]
    templates?: any[]
    media?: any[]
  }
}

export function SanityDashboard({ initialData }: SanityDashboardProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("pages")
  const [isLoading, setIsLoading] = useState(true)
  
  const [pages, setPages] = useState<any[]>(initialData?.pages || [])
  const [templates, setTemplates] = useState<any[]>(initialData?.templates || [])
  const [media, setMedia] = useState<any[]>(initialData?.media || [])

  // Fetch data from Sanity
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch pages
        const pagesData = await client.fetch(`
          *[_type == "page"] {
            _id,
            title,
            "slug": slug.current,
            status,
            _updatedAt
          }
        `)
        setPages(pagesData)

        // Fetch templates
        const templatesData = await client.fetch(`
          *[_type == "template"] {
            _id,
            name,
            description,
            "slug": slug.current,
            _updatedAt
          }
        `)
        setTemplates(templatesData)

        // Fetch media
        const mediaData = await client.fetch(`
          *[_type == "media"] {
            _id,
            title,
            mediaType,
            "url": image.asset->url,
            "size": image.asset->size,
            _updatedAt
          }
        `)
        setMedia(mediaData)
      } catch (error) {
        console.error("Error fetching data from Sanity:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!initialData) {
      fetchData()
    } else {
      setIsLoading(false)
    }
  }, [initialData])

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      // Search across all content types
      const searchResults = await client.fetch<{
        pages: any[];
        templates: any[];
        media: any[];
      }>(`
        {
          "pages": *[_type == "page" && (title match $query || content[].children[].text match $query)] {
            _id,
            title,
            "slug": slug.current,
            status,
            _updatedAt
          },
          "templates": *[_type == "template" && (name match $query || description match $query)] {
            _id,
            name,
            description,
            "slug": slug.current,
            _updatedAt
          },
          "media": *[_type == "media" && (title match $query || altText match $query)] {
            _id,
            title,
            mediaType,
            "url": image.asset->url,
            "size": image.asset->size,
            _updatedAt
          }
        }
      `, { query: `*${searchQuery}*` } as Record<string, any>)

      setPages(searchResults.pages)
      setTemplates(searchResults.templates)
      setMedia(searchResults.media)
    } catch (error) {
      console.error("Error searching content:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (!bytes) return "Unknown size"
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

  // Handle opening Sanity Studio
  const openSanityStudio = (documentId?: string, documentType?: string) => {
    if (documentId && documentType) {
      window.open(`/studio/${documentType};${documentId}`, '_blank')
    } else {
      window.open('/studio', '_blank')
    }
  }

  // Handle preview
  const handlePreview = (slug: string) => {
    window.open(`/api/preview?slug=${slug}&type=page`, '_blank')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">
            Manage your website content, pages, and media with Sanity.io
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
          <Button variant="outline" onClick={() => openSanityStudio()}>
            <Settings className="mr-2 h-4 w-4" />
            Open Studio
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="media">Media Library</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pages" className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Website Pages</h2>
            <Button onClick={() => openSanityStudio(undefined, "page")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Page
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="flex justify-between items-center w-full">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pages.length > 0 ? pages.map(page => (
                <Card key={page._id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{page.title}</CardTitle>
                      <Badge variant={page.status === "published" ? "default" : "outline"}>
                        {page.status || "draft"}
                      </Badge>
                    </div>
                    <CardDescription>/{page.slug}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      Updated {new Date(page._updatedAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="flex justify-between items-center w-full">
                      <Button variant="ghost" size="sm" onClick={() => handlePreview(page.slug)}>
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
                          <DropdownMenuItem onClick={() => openSanityStudio(page._id, "page")}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit in Studio
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(`/${page.slug}`, '_blank')}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Live
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardFooter>
                </Card>
              )) : (
                <div className="col-span-3 text-center py-12">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <File className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No pages found</h3>
                  <p className="text-muted-foreground mb-4">Get started by creating your first page</p>
                  <Button onClick={() => openSanityStudio(undefined, "page")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Page
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Page Templates</h2>
            <Button onClick={() => openSanityStudio(undefined, "template")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3 mt-1" />
                  </CardHeader>
                  <CardFooter>
                    <div className="flex justify-between items-center w-full">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.length > 0 ? templates.map(template => (
                <Card key={template._id}>
                  <CardHeader>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <div className="flex justify-between items-center w-full">
                      <Button variant="ghost" size="sm" onClick={() => handlePreview(template.slug)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openSanityStudio(template._id, "template")}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )) : (
                <div className="col-span-3 text-center py-12">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No templates found</h3>
                  <p className="text-muted-foreground mb-4">Get started by creating your first template</p>
                  <Button onClick={() => openSanityStudio(undefined, "template")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Template
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="media" className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Media Library</h2>
            <Button onClick={() => openSanityStudio(undefined, "media")}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Media
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map(i => (
                <Card key={i}>
                  <div className="aspect-square relative bg-muted">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <CardContent className="p-3">
                    <Skeleton className="h-5 w-full mb-1" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {media.length > 0 ? media.map(item => (
                <Card key={item._id}>
                  <div className="aspect-square relative bg-muted flex items-center justify-center">
                    {item.mediaType === "image" && item.url ? (
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        {getMediaIcon(item.mediaType)}
                        <span className="text-sm mt-2">{item.mediaType}</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <div className="truncate font-medium">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{formatFileSize(item.size)}</div>
                  </CardContent>
                  <CardFooter className="p-2">
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => openSanityStudio(item._id, "media")}>
                      Edit in Studio
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )) : (
                <div className="col-span-4 text-center py-12">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Image className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No media found</h3>
                  <p className="text-muted-foreground mb-4">Get started by uploading your first media item</p>
                  <Button onClick={() => openSanityStudio(undefined, "media")}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Media
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}