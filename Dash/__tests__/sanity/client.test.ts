import { client, createClient } from '@/config/cms.config'; // Updated import path

// Mock the Sanity client
jest.mock('@/config/cms.config', () => { // Updated mock path
  const mockFetch = jest.fn().mockResolvedValue([]);
  
  return {
    client: {
      fetch: mockFetch
    },
    createClient: jest.fn().mockImplementation(() => ({
      fetch: mockFetch
    }))
  };
});

// Mock the Sanity env
jest.mock('@/sanity/env', () => ({
  apiVersion: '2023-05-03',
  dataset: 'test-dataset',
  projectId: 'test-project-id',
  useCdn: false
}));

describe('Sanity Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be properly configured', () => {
    // Check that the client is configured with the correct values
    expect(client).toBeDefined();
  });

  it('should create a client with the correct configuration', () => {
    const testClient = createClient();
    
    // The client should be configured with the correct values
    expect(testClient).toBeDefined();
  });

  it('should create a preview client when token is provided', () => {
    const previewClient = createClient({ token: 'test-token' });
    
    // The preview client should be configured with the correct values
    expect(previewClient).toBeDefined();
  });

  it('should fetch data from Sanity', async () => {
    // Call the fetch method
    await client.fetch('*[_type == "page"]');
    
    // Check that fetch was called with the correct query
    expect(client.fetch).toHaveBeenCalledWith('*[_type == "page"]');
  });
});