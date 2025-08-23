import { FastifyRequest, FastifyReply } from 'fastify'

export interface User {
  id: string
  email: string
  name: string
  password_hash?: string
  preferences: UserPreferences
  productivity_dna?: ProductivityDNA
  created_at: Date
  updated_at: Date
  last_active: Date
}

export interface UserPreferences {
  focus_duration: number
  short_break_duration: number
  long_break_duration: number
  long_break_interval: number
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  sound_enabled: boolean
  auto_start_breaks: boolean
  auto_start_sessions: boolean
  block_websites: boolean
  blocked_sites: string[]
}

export interface ProductivityDNA {
  peak_hours: Array<{ hour: number; score: number }>
  average_flow_duration: number
  preferred_session_length: number
  energy_patterns: Array<{ time_of_day: number; energy: number }>
  weekly_patterns: Array<{ day_of_week: number; productivity: number }>
  contextual_preferences: Record<string, number>
}

export interface TimerSession {
  id: string
  user_id: string
  type: 'focus' | 'short-break' | 'long-break'
  duration: number
  actual_duration?: number
  start_time: Date
  end_time?: Date
  is_completed: boolean
  flow_state?: FlowState
  productivity_metrics?: ProductivityMetrics
  interruptions: number
  task_context?: string
  created_at: Date
  updated_at: Date
}

export interface FlowState {
  is_in_flow: boolean
  flow_score: number
  detection_method: 'typing' | 'mouse' | 'focus' | 'hybrid'
  confidence: number
  start_time?: Date
  duration?: number
}

export interface ProductivityMetrics {
  keystrokes: number
  mouse_movements: number
  application_switches: number
  focus_time: number
  distraction_events: number
  energy_level: number
}

export interface ActivityMetric {
  id: string
  user_id: string
  session_id?: string
  timestamp: Date
  keystrokes: number
  mouse_movements: number
  window_switches: number
  idle_time: number
  active_application: string
  created_at: Date
}

export interface AuthenticatedRequest extends FastifyRequest {
  user: {
    id: string
    email: string
    name: string
  }
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface SessionCreateRequest {
  type: 'focus' | 'short-break' | 'long-break'
  duration?: number
  task_context?: string
}

export interface SessionUpdateRequest {
  end_time?: Date
  is_completed?: boolean
  actual_duration?: number
  flow_state?: FlowState
  productivity_metrics?: ProductivityMetrics
  interruptions?: number
}

export interface WebSocketMessage {
  type: 'session_start' | 'session_update' | 'session_complete' | 'flow_state_change' | 'activity_update'
  data: any
  timestamp: Date
}

export interface DatabaseConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationQuery {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface SessionsQuery extends PaginationQuery {
  type?: 'focus' | 'short-break' | 'long-break'
  completed?: boolean
  start_date?: string
  end_date?: string
}

export interface AnalyticsQuery {
  period: 'day' | 'week' | 'month' | 'year'
  start_date?: string
  end_date?: string
}

export interface WeeklyInsight {
  week: string
  total_focus_time: number
  average_flow_score: number
  sessions_completed: number
  productivity_trend: 'up' | 'down' | 'stable'
  recommendations: string[]
  peak_productivity_day: string
  best_performing_hours: number[]
}

export interface DailyStats {
  date: string
  sessions_completed: number
  total_focus_time: number
  average_session_length: number
  completion_rate: number
  flow_time: number
  productivity_score: number
}

declare module 'fastify' {
  interface FastifyInstance {
    db: import('../database/mockManager').MockDatabaseManager
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
  
  interface FastifyRequest {
    user?: {
      id: string
      email: string
      name: string
    }
  }
}