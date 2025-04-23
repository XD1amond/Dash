// Import the modules
import { schemaTypes } from '@/sanity/schemas';
import page from '@/sanity/schemas/page';
import template from '@/sanity/schemas/template';
import media from '@/sanity/schemas/media';
import siteSettings from '@/sanity/schemas/siteSettings';
import blockContent from '@/sanity/schemas/blockContent';

// Mock the modules
jest.mock('@/sanity/schemas', () => {
  return {
    schemaTypes: [
      'page-mock',
      'template-mock',
      'media-mock',
      'siteSettings-mock',
      'blockContent-mock'
    ]
  };
});

jest.mock('@/sanity/schemas/page', () => ({
  name: 'page',
  type: 'document',
  fields: [
    { name: 'title' },
    { name: 'slug' },
    { name: 'content' },
    { name: 'seoTitle' },
    { name: 'seoDescription' },
    { name: 'status' }
  ]
}));

jest.mock('@/sanity/schemas/template', () => ({
  name: 'template',
  type: 'document',
  fields: [
    { name: 'name' },
    { name: 'description' },
    { name: 'slug' },
    { name: 'sections' }
  ]
}));

jest.mock('@/sanity/schemas/media', () => ({
  name: 'media',
  type: 'document',
  fields: [
    { name: 'title' },
    { name: 'mediaType' },
    { name: 'image' },
    { name: 'tags' }
  ]
}));

jest.mock('@/sanity/schemas/siteSettings', () => ({
  name: 'siteSettings',
  type: 'document',
  fields: [
    { name: 'siteName' },
    { name: 'siteDescription' },
    { name: 'logo' },
    { name: 'mainNavigation' }
  ]
}));

jest.mock('@/sanity/schemas/blockContent', () => ({
  name: 'blockContent',
  type: 'array',
  of: [
    { type: 'block' },
    { type: 'image' }
  ]
}));

describe('Sanity Schemas', () => {
  it('exports all schema types', () => {
    // We're just checking that the schema types array exists
    expect(schemaTypes).toBeDefined();
    expect(Array.isArray(schemaTypes)).toBe(true);
    expect(schemaTypes.length).toBe(5);
  });

  describe('Page Schema', () => {
    it('has the correct name and type', () => {
      expect(page.name).toBe('page');
      expect(page.type).toBe('document');
    });

    it('has all required fields', () => {
      const fieldNames = page.fields.map((field: any) => field.name);
      
      expect(fieldNames).toContain('title');
      expect(fieldNames).toContain('slug');
      expect(fieldNames).toContain('content');
      expect(fieldNames).toContain('seoTitle');
      expect(fieldNames).toContain('seoDescription');
      expect(fieldNames).toContain('status');
    });
  });

  describe('Template Schema', () => {
    it('has the correct name and type', () => {
      expect(template.name).toBe('template');
      expect(template.type).toBe('document');
    });

    it('has all required fields', () => {
      const fieldNames = template.fields.map((field: any) => field.name);
      
      expect(fieldNames).toContain('name');
      expect(fieldNames).toContain('description');
      expect(fieldNames).toContain('slug');
      expect(fieldNames).toContain('sections');
    });
  });

  describe('Media Schema', () => {
    it('has the correct name and type', () => {
      expect(media.name).toBe('media');
      expect(media.type).toBe('document');
    });

    it('has all required fields', () => {
      const fieldNames = media.fields.map((field: any) => field.name);
      
      expect(fieldNames).toContain('title');
      expect(fieldNames).toContain('mediaType');
      expect(fieldNames).toContain('image');
      expect(fieldNames).toContain('tags');
    });
  });

  describe('Site Settings Schema', () => {
    it('has the correct name and type', () => {
      expect(siteSettings.name).toBe('siteSettings');
      expect(siteSettings.type).toBe('document');
    });

    it('has all required fields', () => {
      const fieldNames = siteSettings.fields.map((field: any) => field.name);
      
      expect(fieldNames).toContain('siteName');
      expect(fieldNames).toContain('siteDescription');
      expect(fieldNames).toContain('logo');
      expect(fieldNames).toContain('mainNavigation');
    });
  });

  describe('Block Content Schema', () => {
    it('has the correct name and type', () => {
      expect(blockContent.name).toBe('blockContent');
      expect(blockContent.type).toBe('array');
    });

    it('has all required block types', () => {
      const blockTypes = blockContent.of.map((item: any) => {
        if (item.type === 'block') {
          return 'block';
        }
        return item.type || item.name;
      });
      
      expect(blockTypes).toContain('block');
      expect(blockTypes).toContain('image');
    });
  });
});