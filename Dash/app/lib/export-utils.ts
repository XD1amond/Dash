"use client"

/**
 * Utility functions for exporting data in various formats
 */

// Function to export chart as PNG
export const exportChartAsPng = (chartId: string, filename: string = 'chart.png') => {
  const chartElement = document.getElementById(chartId);
  if (!chartElement) {
    console.error(`Chart element with ID ${chartId} not found`);
    return;
  }

  // Use html2canvas to convert the chart to an image
  import('html2canvas').then((html2canvas) => {
    html2canvas.default(chartElement).then((canvas: HTMLCanvasElement) => {
      // Create a download link
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }).catch(err => {
    console.error('Failed to load html2canvas', err);
  });
};

// Function to get HTML embed code for a chart
export const getChartEmbedCode = (chartId: string): string => {
  const chartElement = document.getElementById(chartId);
  if (!chartElement) {
    console.error(`Chart element with ID ${chartId} not found`);
    return '';
  }

  // Clone the chart element to avoid modifying the original
  const clonedChart = chartElement.cloneNode(true) as HTMLElement;
  
  // Get the computed styles
  const styles = window.getComputedStyle(chartElement);
  
  // Apply essential styles to the cloned element
  clonedChart.style.width = styles.width;
  clonedChart.style.height = styles.height;
  
  // Return the HTML as a string
  return clonedChart.outerHTML;
};

// Function to export data as CSV
export const exportToCsv = <T extends Record<string, any>>(
  data: T[],
  filename: string = 'export.csv',
  headers?: { [key in keyof T]?: string }
) => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  try {
    // Get all unique keys from the data
    const allKeys = new Set<string>();
    data.forEach(item => {
      Object.keys(item).forEach(key => {
        allKeys.add(key);
      });
    });

    // Filter out keys that start with _ or are functions
    const keys = Array.from(allKeys).filter(key => 
      !key.startsWith('_') && 
      typeof data[0][key] !== 'function' &&
      typeof data[0][key] !== 'object'
    );

    // Create header row
    const headerRow = keys.map(key => {
      // Use custom header if provided, otherwise use the key
      return headers && headers[key as keyof T] ? headers[key as keyof T] : key;
    });

    // Create CSV content
    let csvContent = headerRow.join(',') + '\n';

    // Add data rows
    data.forEach(item => {
      const row = keys.map(key => {
        const value = item[key];
        // Handle different data types
        if (value === null || value === undefined) {
          return '';
        } else if (typeof value === 'string') {
          // Escape quotes and wrap in quotes
          return `"${value.replace(/"/g, '""')}"`;
        } else {
          return String(value);
        }
      });
      csvContent += row.join(',') + '\n';
    });

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to export CSV', error);
  }
};

// Function to copy text to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};