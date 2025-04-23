# Sanity.io CMS Integration

This document provides instructions on how to set up and use the Sanity.io CMS integration for the ecommerce dashboard.

## Overview

The ecommerce dashboard now uses Sanity.io as its content management system. This allows for:

- Visual editing of website pages
- Custom page templates
- Rich text editing with blocks
- Media management
- SEO optimization
- Real-time collaboration
- Version history
- Role-based access control

## Setup Instructions

### 1. Create a Sanity.io Project

1. Sign up for a Sanity.io account at [https://www.sanity.io/](https://www.sanity.io/)
2. Create a new project from the Sanity dashboard
3. Note your project ID, dataset name, and API token

### 2. Configure Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
SANITY_API_TOKEN=your-api-token
SANITY_PREVIEW_SECRET=your-preview-secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Replace the placeholder values with your actual Sanity project information.

### 3. Deploy the Sanity Studio

The Sanity Studio is already configured in this project and can be accessed at `/studio` when the application is running.

## Using the CMS

### Accessing the CMS

There are two ways to access the CMS:

1. **Dashboard Interface**: Navigate to `/cms` in your browser to access the custom CMS dashboard
2. **Sanity Studio**: Navigate to `/studio` to access the full Sanity Studio interface

### Content Types

The CMS supports the following content types:

#### Pages

Pages are the main content type and represent individual pages on your website. Each page has:

- Title
- URL slug
- Content (rich text with blocks)
- SEO metadata
- Status (draft, published, archived)

#### Templates

Templates define the structure for pages. They can include:

- Predefined sections
- Default content
- Layout settings

#### Media

The media library stores all images, videos, and documents used in your content.

### Editing Content

1. Navigate to the CMS dashboard at `/cms`
2. Select the content type you want to edit (Pages, Templates, or Media)
3. Click on an existing item to edit it, or create a new one
4. For more advanced editing, click "Edit in Studio" to open the item in Sanity Studio

### Preview Mode

You can preview your content before publishing:

1. While editing content in Sanity Studio, click the "Preview" tab
2. This will show you how the content will look on the actual website
3. You can continue making edits and see the changes in real-time

### Publishing Content

1. In Sanity Studio, edit your content
2. Change the status from "Draft" to "Published"
3. Click "Publish" to make the content live

## Advanced Features

### Custom Blocks

The rich text editor supports various custom blocks:

- Images with captions
- Call-out boxes (info, warning, error, success)
- Buttons with different styles
- Code blocks with syntax highlighting

### Role-Based Access

Sanity.io provides role-based access control:

1. Go to your Sanity project dashboard
2. Navigate to "Members & Invitations"
3. Invite team members and assign appropriate roles

### Version History

All content changes are tracked:

1. In Sanity Studio, open a document
2. Click on the "History" tab to see all previous versions
3. You can restore previous versions if needed

## Troubleshooting

If you encounter issues:

1. Check that your environment variables are correctly set
2. Ensure you have the necessary permissions in your Sanity project
3. Check the browser console for any error messages
4. Verify that your Sanity project is on the correct plan for your needs

## Additional Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js + Sanity Integration](https://www.sanity.io/docs/nextjs)
- [Sanity Content Lake API](https://www.sanity.io/docs/content-lake-api)
- [Sanity Studio Customization](https://www.sanity.io/docs/studio-customization)