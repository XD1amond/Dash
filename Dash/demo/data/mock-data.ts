// Mock data generators for the dashboard demo

// Generate orders
export function generateOrders(count = 10) {
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const orders = [];

  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const total = Math.floor(Math.random() * 500) + 20;
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    orders.push({
      id: `order-${i + 1}`,
      orderNumber: `ORD-${10000 + i}`,
      customer: {
        id: `cust-${Math.floor(Math.random() * 100) + 1}`,
        name: `Customer ${Math.floor(Math.random() * 100) + 1}`,
        email: `customer${Math.floor(Math.random() * 100) + 1}@example.com`
      },
      status,
      total,
      items: Math.floor(Math.random() * 5) + 1,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString()
    });
  }

  return orders;
}

// Generate customers
export function generateCustomers(count = 10) {
  const segments = ['new', 'returning', 'loyal', 'at-risk', 'inactive', 'vip'];
  const customers = [];

  for (let i = 0; i < count; i++) {
    const segment = segments[Math.floor(Math.random() * segments.length)];
    const totalOrders = Math.floor(Math.random() * 20) + 1;
    const totalSpent = Math.floor(Math.random() * 2000) + 50;

    customers.push({
      id: `cust-${i + 1}`,
      name: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      phone: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      segment,
      totalOrders,
      totalSpent,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString()
    });
  }

  return customers;
}

// Generate customer segments
export function generateCustomerSegments() {
  return [
    {
      id: 'segment-1',
      name: 'New Customers',
      description: 'Customers who made their first purchase in the last 30 days',
      criteria: 'First purchase within 30 days',
      customerCount: 124
    },
    {
      id: 'segment-2',
      name: 'Loyal Customers',
      description: 'Customers who made more than 5 purchases',
      criteria: 'More than 5 purchases',
      customerCount: 256
    },
    {
      id: 'segment-3',
      name: 'VIP',
      description: 'Customers who spent more than $1000',
      criteria: 'Total spent > $1000',
      customerCount: 58
    },
    {
      id: 'segment-4',
      name: 'At Risk',
      description: 'Customers who haven\'t made a purchase in 60-90 days',
      criteria: 'No purchase in 60-90 days',
      customerCount: 89
    },
    {
      id: 'segment-5',
      name: 'Inactive',
      description: 'Customers who haven\'t made a purchase in over 90 days',
      criteria: 'No purchase in 90+ days',
      customerCount: 143
    }
  ];
}

// Generate products
export function generateProducts(count = 10) {
  const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Toys', 'Beauty', 'Sports'];
  const products = [];

  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const price = Math.floor(Math.random() * 200) + 10;
    const inventory = Math.floor(Math.random() * 100) + 1;

    products.push({
      id: `prod-${i + 1}`,
      name: `Product ${i + 1}`,
      description: `This is a description for Product ${i + 1}`,
      price,
      category,
      inventory,
      tags: generateTags(category),
      images: [
        `https://picsum.photos/seed/product${i + 1}/400/400`
      ],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString()
    });
  }

  return products;
}

// Generate product categories
export function generateProductCategories() {
  return [
    {
      id: 'cat-1',
      name: 'Electronics',
      description: 'Electronic devices and accessories',
      productCount: 42
    },
    {
      id: 'cat-2',
      name: 'Clothing',
      description: 'Apparel and fashion items',
      productCount: 78
    },
    {
      id: 'cat-3',
      name: 'Home & Kitchen',
      description: 'Items for home and kitchen use',
      productCount: 56
    },
    {
      id: 'cat-4',
      name: 'Books',
      description: 'Books and publications',
      productCount: 124
    },
    {
      id: 'cat-5',
      name: 'Toys',
      description: 'Toys and games',
      productCount: 35
    },
    {
      id: 'cat-6',
      name: 'Beauty',
      description: 'Beauty and personal care products',
      productCount: 67
    },
    {
      id: 'cat-7',
      name: 'Sports',
      description: 'Sports and outdoor equipment',
      productCount: 49
    }
  ];
}

// Generate tags based on category
function generateTags(category: string) {
  const tagsByCategory: Record<string, string[]> = {
    'Electronics': ['gadget', 'tech', 'wireless', 'smart', 'portable'],
    'Clothing': ['casual', 'formal', 'summer', 'winter', 'trendy'],
    'Home & Kitchen': ['kitchen', 'decor', 'furniture', 'appliance', 'storage'],
    'Books': ['fiction', 'non-fiction', 'educational', 'bestseller', 'reference'],
    'Toys': ['kids', 'educational', 'outdoor', 'board game', 'collectible'],
    'Beauty': ['skincare', 'makeup', 'organic', 'fragrance', 'haircare'],
    'Sports': ['outdoor', 'fitness', 'team sports', 'equipment', 'accessories']
  };

  const availableTags = tagsByCategory[category] || ['general', 'popular', 'new', 'sale'];
  const numTags = Math.floor(Math.random() * 3) + 1;
  const selectedTags: string[] = [];

  for (let i = 0; i < numTags; i++) {
    const randomTag = availableTags[Math.floor(Math.random() * availableTags.length)];
    if (!selectedTags.includes(randomTag)) {
      selectedTags.push(randomTag);
    }
  }

  return selectedTags;
}


// Generate CMS pages
export function generatePages() {
  return [
    {
      id: 'page-1',
      title: 'Home Page',
      slug: 'home',
      status: 'published',
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'page-2',
      title: 'About Us',
      slug: 'about',
      status: 'published',
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'page-3',
      title: 'Contact',
      slug: 'contact',
      status: 'published',
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'page-4',
      title: 'Products',
      slug: 'products',
      status: 'published',
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'page-5',
      title: 'Blog',
      slug: 'blog',
      status: 'published',
      updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'page-6',
      title: 'New Feature Announcement',
      slug: 'new-feature',
      status: 'draft',
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
}

// Generate CMS templates
export function generateTemplates() {
  return [
    {
      id: 'template-1',
      name: 'Default Page',
      description: 'Standard page template with header, content, and footer',
    },
    {
      id: 'template-2',
      name: 'Landing Page',
      description: 'Template optimized for marketing landing pages',
    },
    {
      id: 'template-3',
      name: 'Blog Post',
      description: 'Template for blog articles with featured image',
    },
    {
      id: 'template-4',
      name: 'Product Page',
      description: 'Template for product details with gallery and specifications',
    },
    {
      id: 'template-5',
      name: 'Contact Form',
      description: 'Template with integrated contact form and map',
    }
  ];
}

// Generate media items
export function generateMediaItems() {
  return [
    {
      id: 'media-1',
      name: 'hero-image.jpg',
      type: 'image',
      url: 'https://picsum.photos/seed/hero/800/400',
      size: 245000
    },
    {
      id: 'media-2',
      name: 'product-catalog.pdf',
      type: 'document',
      url: '#',
      size: 1245000
    },
    {
      id: 'media-3',
      name: 'team-photo.jpg',
      type: 'image',
      url: 'https://picsum.photos/seed/team/800/600',
      size: 345000
    },
    {
      id: 'media-4',
      name: 'promo-video.mp4',
      type: 'video',
      url: '#',
      size: 12450000
    },
    {
      id: 'media-5',
      name: 'logo.svg',
      type: 'image',
      url: '#',
      size: 24500
    },
    {
      id: 'media-6',
      name: 'banner-1.jpg',
      type: 'image',
      url: 'https://picsum.photos/seed/banner1/1200/300',
      size: 145000
    },
    {
      id: 'media-7',
      name: 'banner-2.jpg',
      type: 'image',
      url: 'https://picsum.photos/seed/banner2/1200/300',
      size: 156000
    },
    {
      id: 'media-8',
      name: 'product-1.jpg',
      type: 'image',
      url: 'https://picsum.photos/seed/product1/500/500',
      size: 98000
    }
  ];
}

// Generate system configuration
export function generateSystemConfig() {
  return {
    appearance: {
      theme: "dark" as "light" | "dark" | "system",
      sidebarOrientation: "vertical" as "vertical" | "horizontal",
      density: "comfortable" as "compact" | "comfortable" | "spacious",
      borderRadius: "medium" as "none" | "small" | "medium" | "large",
      animations: true
    },
    businessInfo: {
      name: "Acme E-commerce",
      email: "info@acme-ecommerce.com",
      phone: "+1 (555) 123-4567",
      address: "123 Commerce St, Business City, BC 12345"
    },
    notifications: {
      email: true,
      browser: true,
      mobile: false
    },
    integrations: [
      {
        id: "integration-1",
        name: "Payment Gateway",
        status: "connected" as "connected" | "disconnected"
      },
      {
        id: "integration-2",
        name: "Shipping Provider",
        status: "connected" as "connected" | "disconnected"
      },
      {
        id: "integration-3",
        name: "Email Marketing",
        status: "disconnected" as "connected" | "disconnected"
      },
      {
        id: "integration-4",
        name: "Social Media",
        status: "connected" as "connected" | "disconnected"
      },
      {
        id: "integration-5",
        name: "Analytics Platform",
        status: "disconnected" as "connected" | "disconnected"
      }
    ]
  };
}


// Generate all mock data at once
export function generateAllMockData() {
  return {
    orders: generateOrders(20),
    customers: generateCustomers(20),
    customerSegments: generateCustomerSegments(),
    products: generateProducts(20),
    productCategories: generateProductCategories(),
    pages: generatePages(),
    templates: generateTemplates(),
    mediaItems: generateMediaItems(),
    systemConfig: generateSystemConfig()
  };
}