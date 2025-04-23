// Import Jest DOM extensions
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  redirect: jest.fn(),
}));

// Mock next/headers
jest.mock('next/headers', () => ({
  draftMode: () => ({
    isEnabled: false,
    enable: jest.fn(),
    disable: jest.fn(),
  }),
  cookies: () => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  }),
  headers: () => ({
    get: jest.fn(),
    has: jest.fn(),
    entries: jest.fn(),
    values: jest.fn(),
    keys: jest.fn(),
    forEach: jest.fn(),
  }),
}));

// Mock the environment variables
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project-id';
process.env.NEXT_PUBLIC_SANITY_DATASET = 'test-dataset';
process.env.NEXT_PUBLIC_SANITY_API_VERSION = '2023-05-03';