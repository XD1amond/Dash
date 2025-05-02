# Dash Data Configuration System

This directory contains a production-ready data configuration system for the Dash e-commerce dashboard. It provides a comprehensive solution for integrating your e-commerce website with the dashboard, with features designed to handle Amazon-scale data volumes.

## Features

- **Type Safety**: Comprehensive TypeScript interfaces for all data structures
- **Input Validation**: Runtime validation of all inputs using Zod
- **Response Validation**: Runtime validation of all API responses
- **Caching**: Intelligent caching with TTL and memory management
- **Error Handling**: Consistent error handling and logging
- **Pagination**: Support for paginated data fetching
- **Filtering**: Flexible filtering options for all data types
- **Real-time Updates**: WebSocket, SSE, and polling support for real-time data
- **Adapter System**: Pluggable adapters for different data sources (REST, GraphQL, etc.)
- **Mock Data**: Built-in mock data generation for development and testing
- **Performance Optimization**: Batch fetching, connection pooling, and request deduplication
- **Extensive Documentation**: Comprehensive documentation and examples
- **Testing**: Unit and integration tests for all components

## Directory Structure

```
Dash/config/data/
├── adapters/              # Data source adapters
│   ├── base.adapter.ts    # Base adapter interface
│   ├── rest.adapter.ts    # REST API adapter
│   └── index.ts           # Adapter exports and factory functions
├── examples/              # Integration examples
│   └── integration.ts     # Example integration with React and Next.js
├── realtime/              # Real-time data support
│   └── index.ts           # WebSocket, SSE, and polling implementations
├── services/              # Data services
│   ├── analytics.service.ts # Analytics data service
│   └── index.ts           # Service exports and factory functions
├── tests/                 # Tests
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── mocks/             # Test mocks
├── types/                 # Type definitions
│   ├── analytics.types.ts # Analytics data types
│   ├── business.types.ts  # Business data types
│   ├── customer.types.ts  # Customer data types
│   ├── forecast.types.ts  # Forecast data types
│   ├── order.types.ts     # Order data types
│   ├── product.types.ts   # Product data types
│   └── index.ts           # Type exports
├── utils/                 # Utility functions
│   └── cache.ts           # Caching utilities
├── validation/            # Validation schemas
│   ├── analytics.schema.ts # Analytics validation schemas
│   └── index.ts           # Validation exports
├── index.ts               # Main entry point
└── README.md              # This file
```

## Getting Started

### Basic Usage

```typescript
import { createServices } from '@/config/data';

// Create services with a REST adapter
const services = createServices({
  adapter: {
    type: 'rest',
    rest: {
      baseUrl: 'https://api.example.com',
      apiKey: process.env.API_KEY
    }
  }
});

// Fetch revenue data
const revenueData = await services.analytics.fetchRevenueData(
  new Date('2024-01-01'),
  new Date('2024-12-31'),
  'month'
);

console.log(revenueData);
```

### Development Mode with Mock Data

```typescript
import { createMockServices } from '@/config/data';

// Create mock services for development
const services = createMockServices();

// Fetch mock revenue data
const revenueData = await services.analytics.fetchRevenueData(
  new Date('2024-01-01'),
  new Date('2024-12-31'),
  'month'
);

console.log(revenueData);
```

### Real-time Updates

```typescript
import { createServices } from '@/config/data';

const services = createServices({
  adapter: { type: 'rest', rest: { baseUrl: 'https://api.example.com' } },
  realtime: {
    enabled: true,
    transport: 'websocket',
    websocketUrl: 'wss://api.example.com/realtime'
  }
});

// Subscribe to real-time revenue updates
const unsubscribe = services.analytics.subscribeToRevenueUpdates(
  (data) => {
    console.log('New revenue data:', data);
    // Update your UI
  }
);

// Later, when you're done:
unsubscribe();
```

## Integration with React

```tsx
import { useEffect, useState } from 'react';
import { createServices } from '@/config/data';

function Dashboard() {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const services = createServices({
      adapter: { type: 'rest', rest: { baseUrl: '/api' } }
    });
    
    async function fetchData() {
      try {
        setLoading(true);
        const from = new Date();
        from.setMonth(from.getMonth() - 6);
        const to = new Date();
        
        const result = await services.analytics.fetchRevenueData(from, to, 'month');
        setRevenueData(result.data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h1>Revenue Data</h1>
      <ul>
        {revenueData.map((item) => (
          <li key={item.date}>
            {item.date}: ${item.revenue.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Customizing the Adapter

### REST Adapter

```typescript
import { createServices } from '@/config/data';

const services = createServices({
  adapter: {
    type: 'rest',
    rest: {
      baseUrl: 'https://api.example.com',
      apiKey: process.env.API_KEY,
      timeout: 10000, // 10 seconds
      retry: {
        maxRetries: 3,
        baseDelay: 1000, // 1 second
        maxDelay: 5000 // 5 seconds
      },
      debug: process.env.NODE_ENV === 'development'
    }
  }
});
```

## Caching Configuration

```typescript
import { createServices } from '@/config/data';

const services = createServices({
  adapter: { type: 'rest', rest: { baseUrl: '/api' } },
  analytics: {
    cacheTTL: {
      revenue: 5 * 60, // 5 minutes
      sales: 5 * 60,
      visitors: 5 * 60,
      conversion: 5 * 60,
      statCard: 2 * 60 // 2 minutes
    }
  },
  cache: {
    maxSize: 50 * 1024 * 1024 // 50MB
  }
});

// Clear the cache
services.analytics.clearCache();
```

## Performance Considerations

The data configuration system is designed to handle large volumes of data efficiently:

1. **Pagination**: All data fetching methods support pagination to limit the amount of data transferred at once.
2. **Caching**: Intelligent caching reduces the number of API calls and improves response times.
3. **Batch Fetching**: The adapter supports batch fetching to reduce the number of network requests.
4. **Request Deduplication**: Identical requests are deduplicated to avoid unnecessary API calls.
5. **Connection Pooling**: The adapter reuses connections to reduce overhead.
6. **Streaming**: Support for streaming large datasets to avoid memory issues.

## Error Handling

```typescript
import { createServices } from '@/config/data';

const services = createServices({
  adapter: { type: 'rest', rest: { baseUrl: '/api' } }
});

try {
  const revenueData = await services.analytics.fetchRevenueData(
    new Date('2024-01-01'),
    new Date('2024-12-31'),
    'month'
  );
  
  console.log(revenueData);
} catch (error) {
  console.error('Error fetching revenue data:', error);
  
  // Handle specific error types
  if (error.message.includes('timeout')) {
    // Handle timeout error
  } else if (error.message.includes('unauthorized')) {
    // Handle authentication error
  } else {
    // Handle other errors
  }
}
```

## Testing

The data configuration system includes comprehensive tests:

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration
```

## Contributing

1. Create a new branch for your feature or bugfix
2. Make your changes
3. Add tests for your changes
4. Run the tests to ensure they pass
5. Submit a pull request

## License

MIT