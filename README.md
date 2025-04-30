<p align="center">
  <img src="./assets/logo.png" alt="Dash Logo" width="200">
</p>

# Dash - E-commerce Dashboard

A comprehensive E-commerce Dashboard component library with analytics, CMS, order management, CRM, product management, and system configuration, designed to be integrated into existing Next.js applications.

## Quick Start (Repository Demo)

This repository contains the core dashboard library (`/Dash`) and a demonstration implementation (`/demo`).

### Installation (for Demo)

```bash
# Install dependencies for both root and Dash/
npm run install-deps
```

### Running the Demo

```bash
# Run the dashboard demo (uses mock data)
npm run demo
```
This will start the Next.js development server for the `/demo` application, showcasing how the `/Dash` components can be used.

---

## Core Dashboard Library (`/Dash`)

The `/Dash` directory contains the reusable dashboard components and configuration intended for integration into your host application.

### Project Structure (`Dash/`)

The core dashboard library is organized as follows:

- `/app/components/`: Reusable React components, organized by feature.
  - `/cms/`: Components related to Sanity CMS integration.
  - `/crm/`: Components for Customer Relationship Management.
  - `/dashboard/`: Components for the main dashboard layout, overview, charts, and widgets.
  - `/orders/`: Components for Order Management.
  - `/products/`: Components for Product Management.
  - `/settings/`: Components for System Configuration.
  - `/ui/`: Generic UI components (based on shadcn/ui).
  - `index.ts` files within feature directories act as barrel files for easier importing (e.g., `import { OrderManagement } from '@/components/orders';`).
- `/app/hooks/`: Custom React hooks (if any).
- `/app/lib/`: Utility functions and libraries specific to the dashboard components.
- `/app/styles/`: Global styles needed by the dashboard components.
- `/app/types/`: TypeScript type definitions.
- `/app/utils/`: General utility functions.
- `/config/`: Configuration files for integration.
  - `cms.config.ts`: Configures the Sanity client connection. Reads environment variables.
  - `data.config.ts`: **(Requires Implementation)** Defines interfaces and placeholder functions for fetching data (e.g., orders, revenue) from your specific e-commerce backend.
- `/sanity/`: Contains Sanity-specific files like schema definitions (`schemas/`) and environment variable loading (`env.ts`).
- `.env.local.example`: Example environment variables needed for Sanity.
- `.env`: **(Requires Creation/Population in Host App)** Your actual secret environment variables (based on the example). **Do not commit this file.**
- `package.json`: Lists dependencies required by the dashboard components.
- `tailwind.config.js`, `postcss.config.js`: Tailwind CSS configuration.
- `tsconfig.json`: TypeScript configuration.

### Features

- **Analytics Dashboard**: Real-time metrics, revenue trends, traffic sources, customizable charts (Revenue, Sales, Visitors, Conversion), data export.
- **Content Management System (Sanity)**: WYSIWYG editor integration, template management, versioning, media library support, scheduled publishing hooks (requires Sanity setup).
- **Order Management**: Real-time tracking, advanced filtering/sorting, bulk actions, detailed order views, data export.
- **Customer Relationship Management**: Customer profiles, purchase history, segmentation tools, advanced search/filter, journey visualization, privacy-compliant export.
- **Product Management**: Inventory control, variant management, bulk editing, categorization/tagging, SEO tools, data export.
- **Data Pipeline Visualization**: (If components exist) Interactive flowchart/DAG/Sankey diagrams, real-time tracking, filtering, image export.
- **System Configuration**: Theme management (light/dark modes), business info settings, notification triggers, user roles/permissions hooks, third-party integration settings hooks.

### Technical Stack

- **Frontend**: React 18+ with Next.js 14+ (Assumes host application uses Next.js)
- **UI Components**: shadcn/ui with Tailwind CSS
- **CMS**: Sanity CMS integration (requires configuration via `Dash/config/cms.config.ts` and environment variables)
- **Animations/microinteractions**: Framer Motion
- **State Management**: React Query for server state, Zustand for client state (within components)
- **Testing**: Jest, React Testing Library (Tests included within `Dash/` for component verification)

## Installation via npm from GitHub

You can now install the Dash dashboard directly from GitHub using npm:

```bash
# Using npm
npm install github:XD1amond/Dash#main:Dash

# Using yarn
yarn add github:XD1amond/Dash#main:Dash

# Using pnpm
pnpm add github:XD1amond/Dash#main:Dash
```

If you want to install a specific version or branch:

```bash
# Install a specific version
npm install github:XD1amond/Dash#v1.0.0:Dash

# Install from a specific branch
npm install github:XD1amond/Dash#feature-branch:Dash
```

The `:Dash` suffix is important - it tells npm to only install from the Dash subdirectory of the repository, not the entire repository (which would include the demo folder).

After installation, you can import components directly:

```jsx
import { DashboardOverview, OrderManagement, Button } from '@xd1amond/dash';

function MyAdminPage() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <DashboardOverview />
      <OrderManagement />
    </div>
  );
}
```

To update to the latest version:

```bash
npm update github:XD1amond/Dash#main:Dash
```

## Integration Guide

Follow these steps to integrate the `Dash` components into your existing Next.js e-commerce application:

### 1. Add Dashboard Files to Your Project

You can either:

1. Install directly from GitHub (recommended):
   ```bash
   npm install github:XD1amond/Dash#main:Dash
   ```

2. Copy the entire `Dash/` directory into your project structure. A common location might be `/lib/dashboard` or `/integrations/dashboard`, but you can place it where it makes sense for your project. Adjust path aliases if necessary.

### 2. Install Dependencies

Merge the `dependencies` from `Dash/package.json` into your host application's `package.json`. Ensure you don't have conflicting versions. Then run:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Key peer dependencies you'll likely need include: `react`, `react-dom`, `next`, `@radix-ui/*`, `tailwindcss`, `lucide-react`, `next-sanity`, `sanity`, etc.

### 3. Configure Environment Variables

Create a `.env.local` file in the root of your host application (or wherever you manage environment variables). Copy the variables from `Dash/.env.local.example` and fill in your actual Sanity project details:

```env
# .env.local (in your host app)

# Sanity.io Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=YOUR_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET=YOUR_SANITY_DATASET # e.g., production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03 # Or your desired API version
SANITY_API_TOKEN=YOUR_SANITY_API_READ_TOKEN # Scoped read token (or write if needed)
SANITY_PREVIEW_SECRET=YOUR_SECURE_RANDOM_STRING # For preview mode
NEXT_PUBLIC_SITE_URL=http://localhost:3000 # Your app's local URL

# Add any other environment variables your app needs
```

Ensure the Sanity client configuration in `Dash/config/cms.config.ts` correctly reads these variables.

### 4. Implement Data Fetching

#### If installed via npm:

Create a data provider file in your project that implements the required data fetching functions:

```typescript
// src/lib/dash-data-provider.ts

import {
  RevenueDataPoint,
  Order
} from '@xd1amond/dash';
import { getMyRevenue, getMyOrders } from '@/api/my-ecommerce-api'; // Your actual API functions

export const fetchRevenueData = async (/* params */): Promise<RevenueDataPoint[]> => {
  // Your actual data fetching logic
  const revenue = await getMyRevenue(/* params */);
  // Transform the data if necessary to match the RevenueDataPoint interface
  return revenue.map(item => ({ date: item.month, revenue: item.amount }));
};

export const fetchOrders = async (/* params */): Promise<Order[]> => {
  // Your actual data fetching logic
  const orders = await getMyOrders(/* params */);
  // Transform data if necessary
  return orders.map(order => ({
    id: order.order_id,
    customerName: order.customer_details.name,
    date: order.created_at,
    status: order.status, // Ensure status matches the defined types
    total: order.total_amount,
  }));
};

export const fetchOrderById = async (orderId: string): Promise<Order | null> => {
  // Your actual data fetching logic
  const order = await getMyOrderById(orderId);
  if (!order) return null;
  
  return {
    id: order.order_id,
    customerName: order.customer_details.name,
    date: order.created_at,
    status: order.status,
    total: order.total_amount,
  };
};
```

Then pass these functions to the components:

```tsx
import { OrderManagement } from '@xd1amond/dash';
import { fetchOrders } from '@/lib/dash-data-provider';

export default function OrdersPage() {
  return <OrderManagement fetchOrdersFunction={fetchOrders} />;
}
```

#### If copied into your project:

Open `Dash/config/data.config.ts` (within the copied directory in your host app). This file contains placeholder functions (like `fetchRevenueData`, `fetchOrders`) and interfaces.

**You MUST replace these placeholders with your actual logic** to fetch data from your e-commerce platform's backend API, database, or analytics service. The dashboard components rely on these functions to get the data they need to display.

Example modification:

```typescript
// YourApp/lib/dashboard/config/data.config.ts (adjust path)

import { getMyRevenue, getMyOrders } from '@/api/my-ecommerce-api'; // Import your API functions

// ... (Interfaces remain the same or adjust as needed) ...

export const fetchRevenueData = async (/* params */): Promise<RevenueDataPoint[]> => {
  // Replace placeholder with your actual data fetching logic
  const revenue = await getMyRevenue(/* params */);
  // Transform the data if necessary to match the RevenueDataPoint interface
  return revenue.map(item => ({ date: item.month, revenue: item.amount }));
};

export const fetchOrders = async (/* params */): Promise<Order[]> => {
  // Replace placeholder with your actual data fetching logic
  const orders = await getMyOrders(/* params */);
  // Transform data if necessary
  return orders.map(order => ({
    id: order.order_id,
    customerName: order.customer_details.name,
    date: order.created_at,
    status: order.status, // Ensure status matches the defined types
    total: order.total_amount,
  }));
};

// ... Implement other required functions ...
```

### 5. Configure Tailwind CSS

#### If installed via npm:

Ensure your host application's `tailwind.config.js` is set up to scan the node_modules directory for the Dash components:

```javascript
// tailwind.config.js (in your host app)
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './node_modules/@xd1amond/dash/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    // Your theme extensions
  },
  plugins: [
    require('tailwindcss-animate'), // Ensure this plugin is installed and added
  ],
}
```

#### If copied into your project:

Ensure your host application's `tailwind.config.js` is set up to scan the copied `Dash/` directory for classes:

```javascript
// tailwind.config.js (in your host app)
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './lib/dashboard/**/*.{js,ts,jsx,tsx}', // Adjust path to where you copied Dash/
  ],
  theme: {
    // Your theme extensions
  },
  plugins: [
    require('tailwindcss-animate'), // Ensure this plugin is installed and added
  ],
}
```

You might also need to merge specific theme settings or plugins from `Dash/tailwind.config.js` if they are essential for the components.

### 6. Set up Path Aliases (Optional, Recommended)

If your host application uses different path aliases (e.g., `~/*` instead of `@/*`), you may need to update the imports within the copied `Dash/` components or configure your `tsconfig.json` / `jsconfig.json` to recognize the `@/*` alias pointing appropriately (e.g., to the root of the copied `Dash/` directory or your project root). The components currently use `@/*` assuming it resolves relative to the `Dash/` structure.

### 7. Use the Components

Import and use the dashboard components within your application pages.

#### If installed via npm:

```tsx
// Example: In your app/admin/orders/page.tsx
import { OrderManagement } from '@xd1amond/dash';

export default function AdminOrdersPage() {
  return (
    <div>
      <h1>Manage Orders</h1>
      <OrderManagement />
    </div>
  );
}
```

#### If copied into your project:

```tsx
// Example: In your app/admin/orders/page.tsx

// Adjust path based on where you placed Dash/ and your alias setup
import { OrderManagement } from '@/lib/dashboard/app/components/orders';

export default function AdminOrdersPage() {
  // The OrderManagement component will use the fetchOrders function
  // you implemented in YourApp/lib/dashboard/config/data.config.ts
  return (
    <div>
      <h1>Manage Orders</h1>
      <OrderManagement />
    </div>
  );
}
```

## Component Overview

- **`/Dash/app/components/cms`**: Components for interacting with Sanity CMS (Dashboard view, Portable Text renderer, Preview).
- **`/Dash/app/components/crm`**: Components for managing customer data.
- **`/Dash/app/components/dashboard`**: Core layout (Sidebar, Header), overview widgets, and various charts (Revenue, Sales, etc.).
- **`/Dash/app/components/orders`**: Components for displaying and managing orders.
- **`/Dash/app/components/products`**: Components for displaying and managing products.
- **`/Dash/app/components/settings`**: Components for configuring system settings (Theme, Business Info, etc.).
- **`/Dash/app/components/ui`**: Base UI elements (Button, Card, Input, etc.) built upon shadcn/ui.

## Architecture

The dashboard library follows a modular architecture:

1.  **Core Components (`/Dash/app/components`)**: Reusable UI components organized by feature. They receive data primarily via props or fetch data using functions defined in `data.config.ts`.
2.  **Configuration Layer (`/Dash/config`)**: Centralizes Sanity client setup (`cms.config.ts`) and defines the contract for data fetching (`data.config.ts`), separating the UI from specific data sources.
3.  **Styling**: Uses Tailwind CSS with base components from shadcn/ui.

This architecture allows for:

- Easier integration by clearly defining the data requirements (`data.config.ts`).
- Customization of appearance via Tailwind.
- Selective use of components based on application needs.

## License

MIT