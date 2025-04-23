"use client"

import { SanityDashboard } from "@/components/cms/sanity-dashboard"

interface CMSDashboardProps {
  pages?: any[]
  templates?: any[]
  mediaItems?: any[]
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
  // We're now using the Sanity implementation
  return (
    <SanityDashboard 
      initialData={{
        pages: pages || [],
        templates: templates || [],
        media: mediaItems || []
      }}
    />
  )
}