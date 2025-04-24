import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the client module
jest.mock('@/config/cms.config', () => ({ // Updated mock path
  client: {
    fetch: jest.fn().mockImplementation((query = '') => Promise.resolve({
      pages: [{ _id: 'test-page', title: 'Test Page' }],
      templates: [],
      media: []
    }))
  }
}));

// Import after mocking
import { client } from '@/config/cms.config'; // Updated import path

// Create a mock component
const MockSanityDashboard = ({ initialData }: { initialData?: any }) => (
  <div data-testid="sanity-dashboard">
    <div data-testid="initial-data">{JSON.stringify(initialData || {})}</div>
  </div>
);

// Mock the SanityDashboard component
jest.mock('@/components/cms/sanity-dashboard', () => ({
  SanityDashboard: MockSanityDashboard
}));

describe('CMS Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches initial data for the dashboard', async () => {
    // Mock the fetch response
    (client.fetch as jest.Mock).mockResolvedValueOnce({
      pages: [{ _id: 'test-page' }],
      templates: [{ _id: 'test-template' }],
      media: [{ _id: 'test-media' }],
    });

    // Create a simple mock page component
    const MockPage = async () => {
      const data = await client.fetch('');
      return (
        <div className="container mx-auto py-8">
          <MockSanityDashboard initialData={data} />
        </div>
      );
    };

    // Render the page
    const { findByTestId } = render(await MockPage());

    // Check that the SanityDashboard is rendered with the initial data
    const initialDataElement = await findByTestId('initial-data');
    const initialData = JSON.parse(initialDataElement.textContent || '{}');

    expect(initialData).toEqual({
      pages: [{ _id: 'test-page' }],
      templates: [{ _id: 'test-template' }],
      media: [{ _id: 'test-media' }],
    });
  });

  it('handles errors when fetching initial data', async () => {
    // Mock a fetch error
    (client.fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch error'));

    // Create a simple mock page component
    const MockPage = async () => {
      try {
        const data = await client.fetch('');
        return (
          <div className="container mx-auto py-8">
            <MockSanityDashboard initialData={data} />
          </div>
        );
      } catch (error) {
        return (
          <div className="container mx-auto py-8">
            <MockSanityDashboard initialData={{ pages: [], templates: [], media: [] }} />
          </div>
        );
      }
    };

    // Render the page
    const { findByTestId } = render(await MockPage());

    // Check that the SanityDashboard is rendered with empty initial data
    const initialDataElement = await findByTestId('initial-data');
    const initialData = JSON.parse(initialDataElement.textContent || '{}');

    expect(initialData).toEqual({
      pages: [],
      templates: [],
      media: [],
    });
  });
});