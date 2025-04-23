import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas/index'
import { structure } from './sanity/desk'

export default defineConfig({
  name: 'default',
  title: 'Ecommerce Dashboard CMS',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [
    deskTool({
      structure
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // For the visual editing experience with live previews
    actions: (prev, context) => {
      return prev
    },
    newDocumentOptions: (prev, context) => {
      return prev
    },
    productionUrl: async (prev, context) => {
      // Define a type for Sanity documents
      type SanityDocument = {
        _type: string;
        _id: string;
        slug?: { current: string };
        [key: string]: any;
      }
      
      const { document } = context as { document: SanityDocument }
      
      if (document._type === 'page') {
        // Now TypeScript knows that document.slug exists when _type is 'page'
        return `${process.env.NEXT_PUBLIC_SITE_URL}/preview?slug=${document.slug?.current || ''}`
      }
      return prev
    },
  },
})