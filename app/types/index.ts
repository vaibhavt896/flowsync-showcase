export interface TimerSession {
  id: string
  type: 'focus' | 'short-break' | 'long-break'
  duration: number
  actualDuration?: number
  startTime: Date
  endTime?: Date
  isCompleted: boolean
  flowState?: FlowState
  productivity?: ProductivityMetrics
  interruptions: number
  taskContext?: string
  timestamp?: Date
  rating?: number // 1-5 user satisfaction rating
}

export interface FlowState {
  isInFlow: boolean
  flowScore: number // 0-1
  detectionMethod: 'typing' | 'mouse' | 'focus' | 'hybrid'
  confidence: number
  startTime?: Date
  duration?: number
}

export interface ProductivityMetrics {
  keystrokes: number
  mouseMovements: number
  applicationSwitches: number
  focusTime: number
  distractionEvents: number
  energyLevel: number // 1-10
}

export interface UserProfile {
  id: string
  email: string
  name: string
  preferences: UserPreferences
  productivityDNA: ProductivityDNA
  createdAt: Date
  lastActive: Date
}

export interface UserPreferences {
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  longBreakInterval: number
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  soundEnabled: boolean
  autoStartBreaks: boolean
  autoStartSessions: boolean
  blockWebsites: boolean
  blockedSites: string[]
}

export interface ProductivityDNA {
  peakHours: Array<{ hour: number; score: number }>
  averageFlowDuration: number
  preferredSessionLength: number
  energyPatterns: Array<{ timeOfDay: number; energy: number }>
  weeklyPatterns: Array<{ dayOfWeek: number; productivity: number }>
  contextualPreferences: Record<string, number>
}

export interface ActivityMetrics {
  timestamp: Date
  keystrokes: number
  mouseMovements: number
  windowSwitches: number
  idleTime: number
  activeApplication: string
}

export interface TimerState {
  currentSession: TimerSession | null
  isRunning: boolean
  isPaused: boolean
  timeRemaining: number
  sessionsCompleted: number
  currentCycle: number
  adaptiveInterval: number
}

export interface NotificationState {
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
  id: string
  duration?: number
}

export interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  pressure: number
  timestamp: Date
}

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  type: 'meeting' | 'focus' | 'break' | 'other'
}

export interface WeeklyInsight {
  week: string
  totalFocusTime: number
  averageFlowScore: number
  sessionsCompleted: number
  productivityTrend: 'up' | 'down' | 'stable'
  recommendations: string[]
  peakProductivityDay: string
  bestPerformingHours: number[]
}