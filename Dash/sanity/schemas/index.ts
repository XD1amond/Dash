// Use explicit file extensions to ensure TypeScript can find all modules
import page from './page'
import template from './template'
import media from './media'
import siteSettings from './siteSettings'
import blockContent from './blockContent'

export const schemaTypes = [
  // Document types
  page,
  template,
  media,
  siteSettings,
  
  // Object types
  blockContent,
]