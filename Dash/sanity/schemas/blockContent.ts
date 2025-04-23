import { defineType, defineArrayMember } from 'sanity'

/**
 * This is the schema definition for the rich text fields used for
 * for content in the website. It defines various block types and
 * annotations that can be used in the rich text editor.
 */
export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      // Styles let you set what your user can mark up blocks with. These
      // correspond with HTML tags, but you can set any title or value
      // you want and decide how you want to deal with it where you want to
      // use your content.
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Number', value: 'number' },
      ],
      // Marks let you mark up inline text in the block editor.
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting by editors.
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
          { title: 'Underline', value: 'underline' },
          { title: 'Strike', value: 'strike-through' },
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
                validation: (Rule) =>
                  Rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              },
              {
                title: 'Open in new tab',
                name: 'blank',
                type: 'boolean',
                initialValue: false,
              },
            ],
          },
        ],
      },
    }),
    // You can add additional types here. For example:
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
          description: 'Caption displayed below the image',
        },
      ],
    }),
    defineArrayMember({
      type: 'object',
      name: 'callout',
      title: 'Callout',
      fields: [
        {
          name: 'content',
          type: 'text',
          title: 'Content',
        },
        {
          name: 'type',
          type: 'string',
          title: 'Type',
          options: {
            list: [
              { title: 'Info', value: 'info' },
              { title: 'Warning', value: 'warning' },
              { title: 'Error', value: 'error' },
              { title: 'Success', value: 'success' },
            ],
            layout: 'radio',
          },
          initialValue: 'info',
        },
      ],
      preview: {
        select: {
          title: 'content',
          subtitle: 'type',
        },
      },
    }),
    defineArrayMember({
      type: 'object',
      name: 'button',
      title: 'Button',
      fields: [
        {
          name: 'text',
          type: 'string',
          title: 'Button Text',
        },
        {
          name: 'url',
          type: 'url',
          title: 'URL',
        },
        {
          name: 'style',
          type: 'string',
          title: 'Style',
          options: {
            list: [
              { title: 'Primary', value: 'primary' },
              { title: 'Secondary', value: 'secondary' },
              { title: 'Outline', value: 'outline' },
              { title: 'Ghost', value: 'ghost' },
            ],
            layout: 'radio',
          },
          initialValue: 'primary',
        },
        {
          name: 'size',
          type: 'string',
          title: 'Size',
          options: {
            list: [
              { title: 'Small', value: 'sm' },
              { title: 'Medium', value: 'md' },
              { title: 'Large', value: 'lg' },
            ],
            layout: 'radio',
          },
          initialValue: 'md',
        },
      ],
      preview: {
        select: {
          title: 'text',
          subtitle: 'url',
        },
      },
    }),
    defineArrayMember({
      type: 'object',
      name: 'codeBlock',
      title: 'Code Block',
      fields: [
        {
          name: 'code',
          type: 'text',
          title: 'Code',
        },
        {
          name: 'language',
          type: 'string',
          title: 'Language',
          options: {
            list: [
              { title: 'JavaScript', value: 'javascript' },
              { title: 'HTML', value: 'html' },
              { title: 'CSS', value: 'css' },
              { title: 'TypeScript', value: 'typescript' },
              { title: 'JSON', value: 'json' },
              { title: 'Markdown', value: 'markdown' },
              { title: 'Plain text', value: 'text' },
            ],
          },
          initialValue: 'javascript',
        },
      ],
      preview: {
        select: {
          title: 'language',
          subtitle: 'code',
        },
        prepare({ title, subtitle }) {
          return {
            title: `Code: ${title}`,
            subtitle: subtitle ? subtitle.slice(0, 50) + '...' : '',
          }
        },
      },
    }),
  ],
})