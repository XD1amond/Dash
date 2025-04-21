"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

interface PreviewIframeProps {
  document: {
    displayed: {
      _id: string
      _type: string
      slug?: {
        current: string
      }
    }
  }
}

export function PreviewIframe({ document }: PreviewIframeProps) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    // Get the document type and slug
    const { _type, slug } = document.displayed

    // Build the preview URL based on the document type
    if (_type === 'page' && slug?.current) {
      setPreviewUrl(`/api/preview?slug=${slug.current}&type=${_type}`)
    } else if (_type === 'template' && slug?.current) {
      setPreviewUrl(`/api/preview?template=${slug.current}&type=${_type}`)
    } else {
      setPreviewUrl(null)
    }
  }, [document.displayed])

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  if (!previewUrl) {
    return (
      <div className="p-4">
        <p>No preview available for this document type or missing slug.</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-medium">Live Preview</h2>
        <a 
          href={previewUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          Open in new tab
        </a>
      </div>
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <div className="space-y-4 w-full max-w-md p-8">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="pt-4">
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        )}
        <iframe
          src={previewUrl}
          className="w-full h-full border-0"
          onLoad={handleIframeLoad}
          title="Content Preview"
          sandbox="allow-same-origin allow-scripts allow-forms"
        />
      </div>
    </div>
  )
}