import { createClient as createSanityClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from '../env'

export const client = createSanityClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
})

export function createClient(preview?: { token?: string }) {
  return createSanityClient({
    apiVersion,
    dataset,
    projectId,
    useCdn: !preview,
    token: preview?.token,
    perspective: preview ? 'previewDrafts' : 'published',
  })
}

// Helper function to fetch data with preview mode support
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags = [],
  preview = false,
  token,
}: {
  query: string
  params?: Record<string, any>
  tags?: string[]
  preview?: boolean
  token?: string
}) {
  const isDraftMode = preview

  if (isDraftMode && !token) {
    throw new Error('Missing token for draft mode')
  }

  const sanityClient = createClient({
    token: isDraftMode ? token : undefined,
  })

  return sanityClient.fetch<QueryResponse>(query, params, {
    next: {
      tags,
    },
  })
}