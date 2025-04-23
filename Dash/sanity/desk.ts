import { StructureBuilder } from 'sanity/desk'
import React from 'react'

// Create a simple wrapper component that doesn't use hooks
// This is more compatible with Sanity's desk structure
const PreviewComponent = (props: any) => {
  // Get document data
  const { _id, _type, slug } = props.document.displayed
  
  // Build the preview URL based on the document type
  let previewUrl = `/api/preview?id=${_id}&type=${_type}`
  
  // Add slug if available
  if (slug && slug.current) {
    previewUrl += `&slug=${slug.current}`
  }
  
  // For templates, use the template parameter
  if (_type === 'template' && slug && slug.current) {
    previewUrl += `&template=${slug.current}`
  }
  
  // This is a simple wrapper that will be rendered in the Sanity Studio
  // It doesn't use any client-side hooks that might cause issues
  return React.createElement('div', {
    className: 'sanity-studio-preview',
    style: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column' },
    children: [
      // Header with link to open in new tab
      React.createElement('div', {
        style: {
          padding: '8px 16px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        },
        children: [
          React.createElement('h2', {
            style: { fontSize: '16px', fontWeight: 500 }
          }, 'Live Preview'),
          React.createElement('a', {
            href: previewUrl,
            target: '_blank',
            rel: 'noopener noreferrer',
            style: {
              fontSize: '14px',
              color: '#2563eb',
              textDecoration: 'none'
            }
          }, 'Open in new tab')
        ]
      }),
      // Iframe for preview
      React.createElement('iframe', {
        src: previewUrl,
        style: {
          width: '100%',
          height: '100%',
          border: 0,
          flexGrow: 1
        },
        title: 'Content Preview',
        sandbox: 'allow-same-origin allow-scripts allow-forms'
      })
    ]
  })
}

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Pages
      S.listItem()
        .title('Pages')
        .child(
          S.documentTypeList('page')
            .title('Pages')
            .child((documentId) =>
              S.document()
                .documentId(documentId)
                .schemaType('page')
                .views([
                  S.view.form().title('Content'),
                  S.view
                    .component(PreviewComponent)
                    .title('Preview')
                ])
            )
        ),

      // Templates
      S.listItem()
        .title('Templates')
        .child(
          S.documentTypeList('template')
            .title('Templates')
        ),

      // Media
      S.divider(),
      S.listItem()
        .title('Media Library')
        .child(
          S.documentTypeList('media.tag')
            .title('Media Tags')
        ),

      // Settings
      S.divider(),
      S.listItem()
        .title('Site Settings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
    ])