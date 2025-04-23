import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { client } from '../../sanity/lib/client'
import { PortableText } from '../components/cms/portable-text'

interface PageProps {
  params: {
    slug: string
  }
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export const revalidate = 60 // Revalidate this page every 60 seconds

// Generate static params for all pages at build time
export async function generateStaticParams() {
  const query = `*[_type == "page" && defined(slug.current)][].slug.current`
  const slugs = await client.fetch<string[]>(query)

  // Handle case where Sanity is not configured and fetch returns null
  if (!slugs) {
    console.warn('Sanity not configured: Skipping static param generation for pages.');
    return []; // Return empty array if no slugs found or Sanity inactive
  }

  return slugs.map((slug: string) => ({
    slug,
  }))
}

export default async function Page({ params, searchParams }: PageProps) {
  const preview = draftMode().isEnabled
  const slug = params?.slug
  
  const query = `*[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    content,
    seoTitle,
    seoDescription,
    seoImage,
    publishedAt,
    status
  }`
  
  const page = await client.fetch(query, { slug })
  
  if (!page && !preview) {
    notFound()
  }
  
  return (
    <main className="container mx-auto py-10">
      {preview && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p className="font-bold">Preview Mode</p>
          <p>You are viewing an unpublished version of this page.</p>
        </div>
      )}
      
      <article className="prose lg:prose-xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{page?.title || 'Untitled Page'}</h1>
        
        <div className="prose max-w-none">
          {page?.content ? (
            <PortableText value={page.content} />
          ) : (
            <div className="p-4 border border-gray-200 rounded-md">
              <p className="text-gray-500">No content available for this page yet.</p>
            </div>
          )}
        </div>
      </article>
    </main>
  )
}