import { 
  RevenueData, 
  SalesData, 
  VisitorsData, 
  ConversionData,
  StatCardData
} from "@/types/dashboard"
import { formatCurrency } from "@/lib/utils"

/**
 * Generate mock revenue data
 * @param months Number of months to generate data for
 * @returns Array of revenue data points
 */
export function generateRevenueData(months: number = 12): RevenueData[] {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]
  
  // Start with a base revenue and add some growth
  let baseRevenue = 4000
  const growthRate = 0.05 // 5% average growth per month
  const volatility = 0.1 // 10% random volatility
  
  return Array.from({ length: months }, (_, i) => {
    // Add some growth with randomness
    const randomFactor = 1 + (Math.random() * volatility * 2 - volatility)
    const growthFactor = 1 + (growthRate * randomFactor)
    
    if (i > 0) {
      baseRevenue = baseRevenue * growthFactor
    }
    
    return {
      name: monthNames[i % 12],
      revenue: Math.round(baseRevenue)
    }
  })
}

/**
 * Generate mock sales data by category
 * @returns Array of sales data by category
 */
export function generateSalesData(): SalesData[] {
  return [
    { name: "Electronics", value: 35, color: "#10b981" },
    { name: "Clothing", value: 25, color: "#3b82f6" },
    { name: "Home & Garden", value: 20, color: "#6366f1" },
    { name: "Sports", value: 15, color: "#8b5cf6" },
    { name: "Other", value: 5, color: "#ec4899" },
  ]
}

/**
 * Generate mock visitors data by source
 * @returns Array of visitors data by source
 */
export function generateVisitorsData(): VisitorsData[] {
  return [
    { name: "Direct", value: 40, color: "#3b82f6" },
    { name: "Social", value: 25, color: "#8b5cf6" },
    { name: "Organic", value: 20, color: "#10b981" },
    { name: "Referral", value: 15, color: "#f59e0b" },
  ]
}

/**
 * Generate mock conversion rate data
 * @param months Number of months to generate data for
 * @returns Array of conversion rate data points
 */
export function generateConversionData(months: number = 12): ConversionData[] {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]
  
  // Start with a base conversion rate and add some growth
  let baseConversion = 1.8
  const growthRate = 0.03 // 3% average growth per month
  const volatility = 0.05 // 5% random volatility
  
  return Array.from({ length: months }, (_, i) => {
    // Add some growth with randomness
    const randomFactor = 1 + (Math.random() * volatility * 2 - volatility)
    const growthFactor = 1 + (growthRate * randomFactor)
    
    if (i > 0) {
      baseConversion = baseConversion * growthFactor
    }
    
    return {
      name: monthNames[i % 12],
      conversion: parseFloat(baseConversion.toFixed(1))
    }
  })
}

/**
 * Generate mock stat card data
 * @returns Array of stat card data
 */
export function generateStatCardData(): StatCardData[] {
  return [
    {
      title: "Total Revenue",
      value: formatCurrency(124568.32),
      change: 12.5,
      changeType: "increase",
    },
    {
      title: "Orders",
      value: "1,429",
      change: 8.2,
      changeType: "increase",
    },
    {
      title: "Customers",
      value: "9,324",
      change: 5.3,
      changeType: "increase",
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: 1.1,
      changeType: "increase",
    },
  ]
}

/**
 * Generate all analytics data
 * @returns Object containing all analytics data
 */
export function generateAllAnalyticsData() {
  return {
    revenueData: generateRevenueData(),
    salesData: generateSalesData(),
    visitorsData: generateVisitorsData(),
    conversionData: generateConversionData(),
    statCardData: generateStatCardData(),
  }
}