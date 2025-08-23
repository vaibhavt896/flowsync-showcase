// Mock database manager for demo purposes (no PostgreSQL required)
import { 
  User, 
  TimerSession, 
  ActivityMetric, 
  UserPreferences, 
  ProductivityDNA,
  SessionsQuery,
  AnalyticsQuery
} from '../types'
import { generateId } from '../utils/helpers'
import bcrypt from 'bcrypt'

// In-memory storage
const users = new Map<string, User>()
const sessions = new Map<string, TimerSession>()
const activityMetrics = new Map<string, ActivityMetric>()

export class MockDatabaseManager {
  async initialize(): Promise<void> {
    console.log('📊 Mock database initialized (in-memory storage)')
    
    // Create demo user
    const defaultPreferences: UserPreferences = {
      focus_duration: 25 * 60,
      short_break_duration: 5 * 60,
      long_break_duration: 15 * 60,
      long_break_interval: 4,
      theme: 'system',
      notifications: true,
      sound_enabled: true,
      auto_start_breaks: false,
      auto_start_sessions: false,
      block_websites: false,
      blocked_sites: [
        'facebook.com',
        'twitter.com',
        'instagram.com',
        'youtube.com',
        'reddit.com',
      ]
    }

    const demoUser: User = {
      id: 'demo-user-id',
      email: 'demo@flowsync.app',
      name: 'Demo User',
      password_hash: await bcrypt.hash('demo123456', 12),
      preferences: defaultPreferences,
      productivity_dna: {
        peak_hours: Array.from({ length: 24 }, (_, hour) => ({
          hour,
          score: hour >= 9 && hour <= 17 ? 0.8 : 0.3
        })),
        average_flow_duration: 23 * 60,
        preferred_session_length: 25 * 60,
        energy_patterns: Array.from({ length: 24 }, (_, hour) => ({
          time_of_day: hour,
          energy: hour >= 8 && hour <= 18 ? 7 : 4
        })),
        weekly_patterns: Array.from({ length: 7 }, (_, day) => ({
          day_of_week: day,
          productivity: day >= 1 && day <= 5 ? 7.5 : 5
        })),
        contextual_preferences: {
          'deep-work': 35 * 60,
          'meetings': 15 * 60,
          'creative': 30 * 60,
        }
      },
      created_at: new Date(),
      updated_at: new Date(),
      last_active: new Date()
    }

    users.set(demoUser.id, demoUser)
    users.set(demoUser.email, demoUser) // Also store by email for lookup
  }

  // User methods
  async createUser(userData: Partial<User>): Promise<User> {
    const user: User = {
      id: generateId(),
      email: userData.email!,
      name: userData.name!,
      password_hash: userData.password_hash,
      preferences: userData.preferences!,
      productivity_dna: userData.productivity_dna || null,
      created_at: new Date(),
      updated_at: new Date(),
      last_active: new Date()
    }

    users.set(user.id, user)
    users.set(user.email, user)
    return user
  }

  async findUserById(id: string): Promise<User | null> {
    return users.get(id) || null
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return users.get(email) || null
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = users.get(id)
    if (!user) throw new Error('User not found')

    const updatedUser = { ...user, ...updates, updated_at: new Date() }
    users.set(id, updatedUser)
    users.set(updatedUser.email, updatedUser)
    return updatedUser
  }

  async updateUserPreferences(id: string, preferences: Partial<UserPreferences>): Promise<User> {
    const user = users.get(id)
    if (!user) throw new Error('User not found')

    const updatedUser = {
      ...user,
      preferences: { ...user.preferences, ...preferences },
      updated_at: new Date()
    }
    users.set(id, updatedUser)
    users.set(updatedUser.email, updatedUser)
    return updatedUser
  }

  async updateUserProductivityDNA(id: string, dna: Partial<ProductivityDNA>): Promise<User> {
    const user = users.get(id)
    if (!user) throw new Error('User not found')

    const updatedUser = {
      ...user,
      productivity_dna: user.productivity_dna ? { ...user.productivity_dna, ...dna } : dna as ProductivityDNA,
      updated_at: new Date()
    }
    users.set(id, updatedUser)
    users.set(updatedUser.email, updatedUser)
    return updatedUser
  }

  async updateUserLastActive(id: string): Promise<void> {
    const user = users.get(id)
    if (user) {
      user.last_active = new Date()
      users.set(id, user)
      users.set(user.email, user)
    }
  }

  async deleteUser(id: string): Promise<void> {
    const user = users.get(id)
    if (user) {
      users.delete(id)
      users.delete(user.email)
    }
  }

  // Session methods
  async createSession(sessionData: Partial<TimerSession>): Promise<TimerSession> {
    const session: TimerSession = {
      id: generateId(),
      user_id: sessionData.user_id!,
      type: sessionData.type!,
      duration: sessionData.duration!,
      actual_duration: sessionData.actual_duration,
      start_time: sessionData.start_time!,
      end_time: sessionData.end_time,
      is_completed: sessionData.is_completed || false,
      flow_state: sessionData.flow_state,
      productivity_metrics: sessionData.productivity_metrics,
      interruptions: sessionData.interruptions || 0,
      task_context: sessionData.task_context,
      created_at: new Date(),
      updated_at: new Date()
    }

    sessions.set(session.id, session)
    return session
  }

  async findSessionById(id: string): Promise<TimerSession | null> {
    return sessions.get(id) || null
  }

  async updateSession(id: string, updates: Partial<TimerSession>): Promise<TimerSession> {
    const session = sessions.get(id)
    if (!session) throw new Error('Session not found')

    const updatedSession = { ...session, ...updates, updated_at: new Date() }
    sessions.set(id, updatedSession)
    return updatedSession
  }

  async deleteSession(id: string): Promise<void> {
    sessions.delete(id)
  }

  async getUserSessions(userId: string, options: SessionsQuery): Promise<{ data: TimerSession[], total: number }> {
    const userSessions = Array.from(sessions.values())
      .filter(session => session.user_id === userId)
      .filter(session => {
        if (options.type && session.type !== options.type) return false
        if (options.completed !== undefined && session.is_completed !== options.completed) return false
        if (options.start_date && session.start_time < options.start_date) return false
        if (options.end_date && session.start_time >= options.end_date) return false
        return true
      })

    // Sort
    const sortField = options.sort || 'start_time'
    const sortOrder = options.order || 'desc'
    userSessions.sort((a, b) => {
      const aVal = (a as any)[sortField]
      const bVal = (b as any)[sortField]
      if (sortOrder === 'desc') {
        return aVal > bVal ? -1 : 1
      } else {
        return aVal < bVal ? -1 : 1
      }
    })

    // Paginate
    const page = options.page || 1
    const limit = options.limit || 20
    const offset = (page - 1) * limit
    const paginatedSessions = userSessions.slice(offset, offset + limit)

    return {
      data: paginatedSessions,
      total: userSessions.length
    }
  }

  // Activity metrics methods
  async createActivityMetric(metricData: Partial<ActivityMetric>): Promise<ActivityMetric> {
    const metric: ActivityMetric = {
      id: generateId(),
      user_id: metricData.user_id!,
      session_id: metricData.session_id,
      timestamp: metricData.timestamp!,
      keystrokes: metricData.keystrokes || 0,
      mouse_movements: metricData.mouse_movements || 0,
      window_switches: metricData.window_switches || 0,
      idle_time: metricData.idle_time || 0,
      active_application: metricData.active_application || 'Unknown',
      created_at: new Date()
    }

    activityMetrics.set(metric.id, metric)
    return metric
  }

  // Analytics methods (simplified)
  async getProductivityAnalytics(userId: string, options: AnalyticsQuery): Promise<any> {
    return { message: 'Analytics coming soon!', period: options.period }
  }

  async getFlowAnalytics(userId: string, options: AnalyticsQuery): Promise<any> {
    return { message: 'Flow analytics coming soon!', period: options.period }
  }

  async getWeeklyInsights(userId: string): Promise<any[]> {
    return []
  }

  async getPeakPerformanceTimes(userId: string): Promise<any> {
    return { message: 'Peak performance analysis coming soon!' }
  }

  async getSessionPatterns(userId: string): Promise<any> {
    return { message: 'Session pattern analysis coming soon!' }
  }

  async getProductivityTrends(userId: string, days: number): Promise<any> {
    return { message: 'Productivity trends coming soon!' }
  }

  async getProductivityComparison(userId: string, period: string): Promise<any> {
    return { message: 'Productivity comparison coming soon!' }
  }

  async generateRecommendations(userId: string): Promise<any> {
    return { 
      recommendations: [
        'Complete more focus sessions to unlock personalized insights',
        'Try 30-minute sessions for deep work tasks',
        'Take breaks to maintain peak performance'
      ] 
    }
  }

  async getUserStatistics(userId: string): Promise<any> {
    const userSessions = Array.from(sessions.values()).filter(s => s.user_id === userId)
    const focusSessions = userSessions.filter(s => s.type === 'focus')
    const completedSessions = userSessions.filter(s => s.is_completed)
    
    return {
      total_sessions: userSessions.length,
      completed_sessions: completedSessions.length,
      focus_sessions: focusSessions.length,
      total_focus_time: focusSessions
        .filter(s => s.is_completed)
        .reduce((sum, s) => sum + (s.actual_duration || s.duration), 0),
      avg_session_length: focusSessions.length > 0 
        ? focusSessions.reduce((sum, s) => sum + s.duration, 0) / focusSessions.length 
        : 0
    }
  }

  async exportUserData(userId: string): Promise<any> {
    const user = await this.findUserById(userId)
    const userSessions = await this.getUserSessions(userId, { page: 1, limit: 1000 })
    
    return {
      user: user ? { ...user, password_hash: undefined } : null,
      sessions: userSessions.data,
      export_date: new Date().toISOString()
    }
  }

  async generateInitialProductivityDNA(userId: string): Promise<ProductivityDNA> {
    const defaultDNA: ProductivityDNA = {
      peak_hours: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        score: hour >= 9 && hour <= 17 ? 0.8 : 0.3
      })),
      average_flow_duration: 23 * 60,
      preferred_session_length: 25 * 60,
      energy_patterns: Array.from({ length: 24 }, (_, hour) => ({
        time_of_day: hour,
        energy: hour >= 8 && hour <= 18 ? 7 : 4
      })),
      weekly_patterns: Array.from({ length: 7 }, (_, day) => ({
        day_of_week: day,
        productivity: day >= 1 && day <= 5 ? 7.5 : 5
      })),
      contextual_preferences: {}
    }

    await this.updateUserProductivityDNA(userId, defaultDNA)
    return defaultDNA
  }

  async close(): Promise<void> {
    // No cleanup needed for in-memory storage
    console.log('Mock database closed')
  }
}