import crypto from 'crypto'

export function generateId(): string {
  return crypto.randomUUID()
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

export function calculateAge(birthDate: Date): number {
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1
  }
  
  return age
}

export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}

export function getStartOfDay(date: Date = new Date()): Date {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  return start
}

export function getEndOfDay(date: Date = new Date()): Date {
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)
  return end
}

export function getStartOfWeek(date: Date = new Date()): Date {
  const start = new Date(date)
  const day = start.getDay()
  const diff = start.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Monday as first day
  start.setDate(diff)
  start.setHours(0, 0, 0, 0)
  return start
}

export function getEndOfWeek(date: Date = new Date()): Date {
  const end = new Date(getStartOfWeek(date))
  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return end
}

export function getStartOfMonth(date: Date = new Date()): Date {
  const start = new Date(date)
  start.setDate(1)
  start.setHours(0, 0, 0, 0)
  return start
}

export function getEndOfMonth(date: Date = new Date()): Date {
  const end = new Date(date)
  end.setMonth(end.getMonth() + 1)
  end.setDate(0)
  end.setHours(23, 59, 59, 999)
  return end
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function subtractDays(date: Date, days: number): Date {
  return addDays(date, -days)
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export function isYesterday(date: Date): boolean {
  const yesterday = subtractDays(new Date(), 1)
  return date.toDateString() === yesterday.toDateString()
}

export function isSameWeek(date1: Date, date2: Date): boolean {
  const startOfWeek1 = getStartOfWeek(date1)
  const startOfWeek2 = getStartOfWeek(date2)
  return startOfWeek1.getTime() === startOfWeek2.getTime()
}

export function isSameMonth(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() && 
         date1.getMonth() === date2.getMonth()
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) {
    return 'just now'
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString()
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function roundToNearest(value: number, nearest: number): number {
  return Math.round(value / nearest) * nearest
}

export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0
  return ((newValue - oldValue) / oldValue) * 100
}

export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length
}

export function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0
  
  const sorted = [...numbers].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }
  
  return sorted[middle]
}

export function calculateStandardDeviation(numbers: number[]): number {
  if (numbers.length === 0) return 0
  
  const mean = calculateAverage(numbers)
  const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2))
  const avgSquaredDiff = calculateAverage(squaredDiffs)
  
  return Math.sqrt(avgSquaredDiff)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  return new Promise((resolve, reject) => {
    let attempts = 0
    
    const attempt = async () => {
      try {
        attempts++
        const result = await fn()
        resolve(result)
      } catch (error) {
        if (attempts >= maxAttempts) {
          reject(error)
        } else {
          setTimeout(attempt, delay * attempts)
        }
      }
    }
    
    attempt()
  })
}

export function createCircularBuffer<T>(size: number) {
  const buffer: T[] = []
  let index = 0
  
  return {
    push(item: T) {
      buffer[index] = item
      index = (index + 1) % size
    },
    
    get(): T[] {
      const result = []
      for (let i = 0; i < buffer.length; i++) {
        const bufferIndex = (index + i) % buffer.length
        if (buffer[bufferIndex] !== undefined) {
          result.push(buffer[bufferIndex])
        }
      }
      return result
    },
    
    size(): number {
      return buffer.filter(item => item !== undefined).length
    },
    
    clear() {
      buffer.length = 0
      index = 0
    }
  }
}

export function parseUserAgent(userAgent: string) {
  const browsers = [
    { name: 'Chrome', pattern: /Chrome\/([\d.]+)/ },
    { name: 'Firefox', pattern: /Firefox\/([\d.]+)/ },
    { name: 'Safari', pattern: /Safari\/([\d.]+)/ },
    { name: 'Edge', pattern: /Edge\/([\d.]+)/ },
  ]
  
  for (const browser of browsers) {
    const match = userAgent.match(browser.pattern)
    if (match) {
      return {
        name: browser.name,
        version: match[1]
      }
    }
  }
  
  return {
    name: 'Unknown',
    version: 'Unknown'
  }
}