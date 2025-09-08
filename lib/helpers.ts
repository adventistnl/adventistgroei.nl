// Helper functions for data aggregation and manipulation
// These functions prepare for future API integration

/**
 * Groups array items by a specified key
 */
export function groupBy<T>(array: T[], key: keyof T): { [key: string]: T[] } {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(item)
    return groups
  }, {} as { [key: string]: T[] })
}

/**
 * Sums array items by a specified numeric key
 */
export function sumBy<T>(array: T[], key: keyof T): number {
  return array.reduce((sum, item) => {
    const value = item[key]
    return sum + (typeof value === 'number' ? value : 0)
  }, 0)
}

/**
 * Counts items in array by a specified key
 */
export function countBy<T>(array: T[], key: keyof T): { [key: string]: number } {
  return array.reduce((counts, item) => {
    const group = String(item[key])
    counts[group] = (counts[group] || 0) + 1
    return counts
  }, {} as { [key: string]: number })
}

/**
 * Filters array by date range
 */
export function filterByDateRange<T>(
  array: T[], 
  dateKey: keyof T, 
  startDate: Date, 
  endDate: Date
): T[] {
  return array.filter(item => {
    const itemDate = new Date(String(item[dateKey]))
    return itemDate >= startDate && itemDate <= endDate
  })
}

/**
 * Creates time series data by month
 */
export function createMonthlyTimeSeries<T>(
  array: T[],
  dateKey: keyof T,
  valueKey: keyof T,
  year: number = new Date().getFullYear()
): Array<{ month: string; value: number }> {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  
  return months.map((month, index) => {
    const monthItems = array.filter(item => {
      const date = new Date(String(item[dateKey]))
      return date.getMonth() === index && date.getFullYear() === year
    })
    
    const value = monthItems.reduce((sum, item) => {
      const itemValue = item[valueKey]
      return sum + (typeof itemValue === 'number' ? itemValue : 0)
    }, 0)
    
    return { month, value }
  })
}

/**
 * Calculates percentage change between two values
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

/**
 * Formats currency values
 */
export function formatCurrency(
  value: number, 
  currency: string = 'EUR', 
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Formats number with locale-specific formatting
 */
export function formatNumber(value: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value)
}

/**
 * Calculates average of numeric values
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0
  const sum = numbers.reduce((acc, num) => acc + num, 0)
  return Math.round(sum / numbers.length)
}

/**
 * Gets unique values from array by key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[key][] {
  const seen = new Set()
  return array
    .map(item => item[key])
    .filter(value => {
      if (seen.has(value)) {
        return false
      }
      seen.add(value)
      return true
    })
}

/**
 * Sorts array by numeric key
 */
export function sortByNumeric<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'desc'): T[] {
  return [...array].sort((a, b) => {
    const aValue = typeof a[key] === 'number' ? a[key] : 0
    const bValue = typeof b[key] === 'number' ? b[key] : 0
    return direction === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue)
  })
}

/**
 * Creates pagination info
 */
export function paginate<T>(array: T[], page: number, pageSize: number) {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const items = array.slice(startIndex, endIndex)
  
  return {
    items,
    totalItems: array.length,
    totalPages: Math.ceil(array.length / pageSize),
    currentPage: page,
    hasNext: endIndex < array.length,
    hasPrevious: startIndex > 0,
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, array.length)
  }
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Deep clone object (simple implementation)
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
  if (Array.isArray(obj)) return obj.map(item => deepClone(item)) as unknown as T
  
  const cloned = {} as T
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  return cloned
}

// TODO: Replace with actual API calls when backend is ready
export const apiHelpers = {
  /**
   * Simulates API loading delay
   */
  simulateApiDelay: (ms: number = 1000) => 
    new Promise(resolve => setTimeout(resolve, ms)),
    
  /**
   * Simulates API error
   */
  simulateApiError: (message: string = 'API Error') => 
    Promise.reject(new Error(message)),
}
