import { SanityDashboard } from "../components/cms/sanity-dashboard"
import { client } from "../../sanity/lib/client"

export const revalidate = 60 // Revalidate this page every 60 seconds

export default async function CMSPage() {
  // Pre-fetch initial data for the dashboard
  const initialData = await getInitialData()
  
  return (
    <div className="container mx-auto py-8">
      <SanityDashboard initialData={initialData} />
    </div>
  )
}

async function getInitialData() {
  try {
    // Fetch initial data for the dashboard
    const data = await client.fetch<{
      pages: any[];
      templates: any[];
      media: any[];
    }>(`{
      "pages": *[_type == "page"][0...12] {
        _id,
        title,
        "slug": slug.current,
        status,
        _updatedAt
      },
      "templates": *[_type == "template"][0...12] {
        _id,
        name,
        description,
        "slug": slug.current,
        _updatedAt
      },
      "media": *[_type == "media"][0...12] {
        _id,
        title,
        mediaType,
        "url": image.asset->url,
        "size": image.asset->size,
        _updatedAt
      }
    }`)
    
    return data
  } catch (error) {
    console.error("Error fetching initial data:", error)
    return {
      pages: [],
      templates: [],
      media: []
    }
  }
}