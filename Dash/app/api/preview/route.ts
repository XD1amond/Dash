import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '../../../config/cms.config' // Updated import path

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const type = searchParams.get('type')
  const template = searchParams.get('template')
  const secret = searchParams.get('secret')

  // Check the secret if you have one configured
  // if (secret !== process.env.SANITY_PREVIEW_SECRET) {
  //   return new Response('Invalid token', { status: 401 })
  // }

  // If no slug or type is provided, we can't preview
  if (!type) {
    return new Response('Missing required parameters', { status: 400 })
  }

  // Enable draft mode
  draftMode().enable()

  // Redirect to the appropriate page based on the document type
  if (type === 'page' && slug) {
    redirect(`/${slug}?preview=true`)
  } else if (type === 'template' && template) {
    redirect(`/preview/template/${template}?preview=true`)
  } else {
    // Default redirect to homepage
    redirect('/?preview=true')
  }
}