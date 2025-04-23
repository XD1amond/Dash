import { createClient as createSanityClient, SanityClient } from 'next-sanity' // Import SanityClient type
import { apiVersion, dataset, projectId, useCdn, token as sanityBaseToken } from '../env' // Import base token

// Define a dummy client that warns and returns null
const dummyClient = {
  fetch: async (...args: any[]) => {
    console.warn('Sanity project ID not configured. Skipping Sanity fetch.', args);
    return null;
  },
  // Add other methods if needed to prevent runtime errors, make them no-ops
  config: () => ({ projectId: 'dummy', dataset: 'dummy' }),
  withConfig: () => dummyClient,
  request: async () => { console.warn('Sanity not configured.'); return null; },
  listen: () => { console.warn('Sanity not configured.'); return { unsubscribe: () => {} }; },
  // Add any other methods your app might potentially call on the client
} as unknown as SanityClient; // Use type assertion

let resolvedClient: SanityClient;
let resolvedCreateClient: (preview?: { token?: string }) => SanityClient;

// Check if projectId is the placeholder
if (projectId === 'your-project-id') {
  console.warn('Sanity project ID is placeholder. Using dummy Sanity client.');
  resolvedClient = dummyClient;
  resolvedCreateClient = (_preview?: { token?: string }) => dummyClient;
} else {
  // Original client creation logic
  resolvedClient = createSanityClient({
    apiVersion,
    dataset,
    projectId,
    useCdn,
    token: sanityBaseToken, // Use base token if available
    perspective: 'published', // Default perspective
  });

  // Original createClient function logic
  resolvedCreateClient = (preview?: { token?: string }) => {
    // Determine token to use: preview token > base token > undefined
    const tokenToUse = preview?.token || sanityBaseToken;
    return createSanityClient({
      apiVersion,
      dataset,
      projectId,
      useCdn: !preview, // Use CDN only if not in preview
      token: tokenToUse, // Use the determined token
      perspective: preview ? 'previewDrafts' : 'published',
    });
  };
}

// Export the resolved client and function
export const client = resolvedClient;
export const createClient = resolvedCreateClient;


// Modify sanityFetch to use the resolved createClient and check for dummy client
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
  // Early exit if the base client is the dummy client
  if (client === dummyClient) {
    // Warning already issued when client was resolved
    return null as QueryResponse; // Return null, assuming callers can handle it
  }

  const isDraftMode = preview

  // Check for token only if draft mode is requested
  if (isDraftMode && !token && !sanityBaseToken) {
    // Allow draft mode if base token exists, otherwise require specific token
    console.warn('Sanity draft mode requested but no token provided (either via fetch options or SANITY_API_TOKEN env var).');
    // Depending on requirements, you might throw, or fallback to published
    // Let's fallback to published perspective by not passing preview options
    // return sanityFetch({ query, params, tags, preview: false }); // Recursive call - careful!
    // Safer: create a non-preview client directly
     const sanityClient = createClient(); // Uses resolvedCreateClient without preview options
     return sanityClient.fetch<QueryResponse>(query, params, {
       next: { tags },
     });
  }

  // Use the resolved createClient, passing preview token if available
  const sanityClient = createClient({
    token: isDraftMode ? token : undefined, // Pass specific token for preview
  })

  // Fetch will use the correct perspective ('previewDrafts' or 'published')
  // based on how createClient was resolved and the preview options passed
  return sanityClient.fetch<QueryResponse>(query, params, {
    next: {
      tags, // For Next.js cache revalidation
    },
  })
}