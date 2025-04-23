# E-commerce Dashboard

A comprehensive E-commerce Dashboard with analytics, CMS, order management, CRM, product management, data pipeline visualization, and system configuration.

## Project Structure

The project is organized into two main parts:

- `/app` - Core dashboard application (reusable components)
- `/demo` - Example implementation with mock data

### Core Dashboard (`/app`)

The core dashboard contains all the reusable components and modules:

- `/app/components` - UI components
  - `/app/components/dashboard` - Dashboard-specific components
  - `/app/components/ui` - Generic UI components (based on shadcn/ui)
- `/app/hooks` - Custom React hooks
- `/app/lib` - Utility functions and libraries
- `/app/styles` - Global styles
- `/app/types` - TypeScript type definitions
- `/app/utils` - Utility functions

### Demo Implementation (`/demo`)

The demo implementation shows how to use the dashboard with mock data:

- `/demo/data` - Mock data generators
- `/demo/implementation` - Example implementation

## Features

### 1. Analytics Dashboard

- Real-time overview with key performance metrics
- Business analytics with revenue trends, conversion rates, and growth indicators
- Website performance metrics including traffic sources, user behavior, and page performance
- Advanced data visualization with customizable charts and graphs
- One-click export functionality in multiple formats (CSV, Excel, PDF)

### 2. Content Management System

- WYSIWYG page editor with component-based design
- Custom template creation and management
- Collection and item management with versioning
- Media library with optimization features
- Scheduled content publishing and archiving

### 3. Order Management

- Real-time order tracking and status updates
- Advanced filtering and sorting capabilities
- Detailed order information with customer data
- Bulk actions for order processing
- Export functionality with customizable fields

### 4. Customer Relationship Management

- Comprehensive customer profiles with purchase history
- Segmentation tools based on behavior and demographics
- Advanced search, sort, and filter capabilities
- Customer journey visualization
- Data export with privacy compliance features

### 5. Product Management

- Complete inventory control with variant management
- Bulk editing and creation tools
- Advanced categorization and tagging
- SEO optimization tools for product listings
- Export functionality with customizable fields

### 6. Data Pipeline Visualization

- Interactive flowchart/DAG and Sankey diagram visualizations
- Real-time data flow tracking from creation to analytics
- Customizable node and connection styling
- Filtering capabilities by data type and timestamp
- Image export functionality in multiple formats

### 7. System Configuration

- Theme management with light/dark modes and custom theming
- Business information management
- Notification system with customizable triggers
- User roles and permissions
- Integration settings for third-party services

## Technical Stack

- **Frontend**: React 18+ with Next.js 14+
- **UI Components**: shadcn/ui with Tailwind CSS
- **CMS**: Payload CMS integration
- **Database**: Integrates with user's supabase
- **Animations/microinteractions**: Framer Motion
- **State Management**: React Query for server state, Zustand for client state
- **Testing**: Jest, React Testing Library, and Cypress
- **Documentation**: Storybook with component documentation

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/ecommerce-dashboard.git
   cd ecommerce-dashboard
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Running the Demo

To run the demo implementation:

```bash
npm run demo
```

## Usage

### Integrating with Your Application

The dashboard is designed to be modular and easy to integrate with your existing application:

1. Import the components you need from the `/app` directory
2. Connect your data sources to the components
3. Customize the UI to match your brand

Example:

```tsx
import { RevenueChart } from '@/components/dashboard/charts/revenue-chart'
import { fetchRevenueData } from '@/api/analytics'

function AnalyticsDashboard() {
  const [revenueData, setRevenueData] = useState([])
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchRevenueData()
      setRevenueData(data)
    }
    
    fetchData()
  }, [])
  
  return (
    <div>
      <h1>Analytics Dashboard</h1>
      <RevenueChart data={revenueData} />
    </div>
  )
}
```

## Architecture

The dashboard follows a modular architecture with clear separation of concerns:

1. **Core Components**: Reusable UI components that accept data via props
2. **Data Layer**: Separate from the UI components, allowing for easy integration with different data sources
3. **Demo Implementation**: Shows how to use the components with mock data

This architecture allows for:

- Easy customization and extension
- Integration with different data sources
- Separation of UI and business logic

## License

MIT