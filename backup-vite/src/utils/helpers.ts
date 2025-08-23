import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
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

export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours()
  
  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 22) return 'evening'
  return 'night'
}

export function getWeekDay(): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[new Date().getDay()]
}

export function isWeekend(): boolean {
  const day = new Date().getDay()
  return day === 0 || day === 6
}

export function calculateProductivityScore(
  sessionsCompleted: number,
  totalFocusTime: number,
  averageFlowScore: number
): number {
  const sessionScore = Math.min(1, sessionsCompleted / 8) * 0.4 // Max 8 sessions per day
  const timeScore = Math.min(1, totalFocusTime / (4 * 60 * 60)) * 0.3 // Max 4 hours focus
  const flowScore = averageFlowScore * 0.3
  
  return (sessionScore + timeScore + flowScore) * 100
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

export function getRandomMotivationalQuote(): string {
  const quotes = [
    "Deep work is like a superpower in our increasingly competitive twenty-first-century economy.",
    "The ability to perform deep work is becoming increasingly rare and valuable.",
    "Focus is the new IQ in the knowledge economy.",
    "Shallow work stops you from getting fired, but deep work is what gets you promoted.",
    "The key to developing a deep work habit is to move beyond good intentions.",
    "Human beings are at their best when immersed deeply in something challenging.",
    "Concentration is the secret of strength in politics, in war, in trade, in short in all management.",
    "The successful person has the habit of doing the things failures don't like to do."
  ]
  
  return quotes[Math.floor(Math.random() * quotes.length)]
}

export function isWithinWorkingHours(): boolean {
  const hour = new Date().getHours()
  return hour >= 9 && hour <= 17
}

export function calculateOptimalBreakDuration(
  sessionLength: number,
  flowScore: number
): number {
  // Base break duration (5 minutes)
  let breakDuration = 5 * 60
  
  // Adjust based on session length
  if (sessionLength > 30 * 60) {
    breakDuration = 10 * 60 // Longer sessions need longer breaks
  }
  
  // Adjust based on flow score
  if (flowScore > 0.8) {
    breakDuration *= 0.8 // Reduce break time if in deep flow
  } else if (flowScore < 0.4) {
    breakDuration *= 1.2 // Increase break time if struggling to focus
  }
  
  return Math.round(breakDuration)
}

export function analyzeProductivityPattern(sessions: any[]): {
  peakHour: number
  averageSessionLength: number
  completionRate: number
  recommendedAdjustments: string[]
} {
  if (sessions.length === 0) {
    return {
      peakHour: 10,
      averageSessionLength: 25 * 60,
      completionRate: 0,
      recommendedAdjustments: ['Start tracking your sessions to get personalized insights']
    }
  }
  
  // Find peak productivity hour
  const hourlyCompletions = new Array(24).fill(0)
  sessions.forEach(session => {
    if (session.isCompleted) {
      const hour = new Date(session.startTime).getHours()
      hourlyCompletions[hour]++
    }
  })
  
  const peakHour = hourlyCompletions.indexOf(Math.max(...hourlyCompletions))
  
  // Calculate average session length
  const completedSessions = sessions.filter(s => s.isCompleted)
  const averageSessionLength = completedSessions.length > 0 
    ? completedSessions.reduce((sum, s) => sum + s.duration, 0) / completedSessions.length
    : 25 * 60
  
  // Calculate completion rate
  const completionRate = sessions.length > 0 
    ? completedSessions.length / sessions.length
    : 0
  
  // Generate recommendations
  const recommendedAdjustments: string[] = []
  
  if (completionRate < 0.7) {
    recommendedAdjustments.push('Consider shorter session durations to improve completion rate')
  }
  
  if (averageSessionLength > 35 * 60) {
    recommendedAdjustments.push('Try breaking long sessions into smaller chunks')
  }
  
  if (averageSessionLength < 15 * 60) {
    recommendedAdjustments.push('Gradually increase session length for deeper focus')
  }
  
  return {
    peakHour,
    averageSessionLength,
    completionRate,
    recommendedAdjustments
  }
}