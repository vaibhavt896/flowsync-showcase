import { Pool, PoolClient } from 'pg'
import { 
  User, 
  TimerSession, 
  ActivityMetric, 
  UserPreferences, 
  ProductivityDNA,
  SessionsQuery,
  AnalyticsQuery,
  WeeklyInsight,
  DailyStats
} from '../types'
import { generateId } from '../utils/helpers'

export class DatabaseManager {
  private pool: Pool

  constructor() {
    this.pool = new Pool({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB || 'flowsync',
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || '',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }

  async initialize(): Promise<void> {
    try {
      // Test connection
      const client = await this.pool.connect()
      await client.query('SELECT NOW()')
      client.release()

      // Run migrations
      await this.runMigrations()
      
      console.log('📊 Database connected and initialized')
    } catch (error) {
      console.error('❌ Database initialization failed:', error)
      throw error
    }
  }

  private async runMigrations(): Promise<void> {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')

      // Create users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          password_hash TEXT,
          preferences JSONB NOT NULL DEFAULT '{}',
          productivity_dna JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `)

      // Create sessions table
      await client.query(`
        CREATE TABLE IF NOT EXISTS sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          type VARCHAR(20) NOT NULL CHECK (type IN ('focus', 'short-break', 'long-break')),
          duration INTEGER NOT NULL,
          actual_duration INTEGER,
          start_time TIMESTAMP WITH TIME ZONE NOT NULL,
          end_time TIMESTAMP WITH TIME ZONE,
          is_completed BOOLEAN NOT NULL DEFAULT FALSE,
          flow_state JSONB,
          productivity_metrics JSONB,
          interruptions INTEGER NOT NULL DEFAULT 0,
          task_context TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `)

      // Create activity_metrics table
      await client.query(`
        CREATE TABLE IF NOT EXISTS activity_metrics (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
          timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
          keystrokes INTEGER NOT NULL DEFAULT 0,
          mouse_movements INTEGER NOT NULL DEFAULT 0,
          window_switches INTEGER NOT NULL DEFAULT 0,
          idle_time REAL NOT NULL DEFAULT 0,
          active_application VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `)

      // Create indexes
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
        CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time);
        CREATE INDEX IF NOT EXISTS idx_sessions_type ON sessions(type);
        CREATE INDEX IF NOT EXISTS idx_activity_metrics_user_id ON activity_metrics(user_id);
        CREATE INDEX IF NOT EXISTS idx_activity_metrics_session_id ON activity_metrics(session_id);
        CREATE INDEX IF NOT EXISTS idx_activity_metrics_timestamp ON activity_metrics(timestamp);
      `)

      // Create updated_at trigger function
      await client.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';
      `)

      // Create triggers
      await client.query(`
        DROP TRIGGER IF EXISTS update_users_updated_at ON users;
        CREATE TRIGGER update_users_updated_at 
          BEFORE UPDATE ON users 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
        CREATE TRIGGER update_sessions_updated_at 
          BEFORE UPDATE ON sessions 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `)

      await client.query('COMMIT')
      console.log('✅ Database migrations completed')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  // User methods
  async createUser(userData: Partial<User>): Promise<User> {
    const query = `
      INSERT INTO users (email, name, password_hash, preferences)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
    const values = [
      userData.email,
      userData.name,
      userData.password_hash || null,
      JSON.stringify(userData.preferences || {})
    ]

    const result = await this.pool.query(query, values)
    return this.parseUser(result.rows[0])
  }

  async findUserById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1'
    const result = await this.pool.query(query, [id])
    return result.rows[0] ? this.parseUser(result.rows[0]) : null
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1'
    const result = await this.pool.query(query, [email])
    return result.rows[0] ? this.parseUser(result.rows[0]) : null
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const setClause = []
    const values = []
    let paramIndex = 1

    if (updates.name !== undefined) {
      setClause.push(`name = $${paramIndex++}`)
      values.push(updates.name)
    }
    if (updates.email !== undefined) {
      setClause.push(`email = $${paramIndex++}`)
      values.push(updates.email)
    }

    values.push(id)
    const query = `
      UPDATE users 
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `

    const result = await this.pool.query(query, values)
    return this.parseUser(result.rows[0])
  }

  async updateUserPreferences(id: string, preferences: Partial<UserPreferences>): Promise<User> {
    const query = `
      UPDATE users 
      SET preferences = preferences || $1
      WHERE id = $2
      RETURNING *
    `
    const result = await this.pool.query(query, [JSON.stringify(preferences), id])
    return this.parseUser(result.rows[0])
  }

  async updateUserProductivityDNA(id: string, dna: Partial<ProductivityDNA>): Promise<User> {
    const query = `
      UPDATE users 
      SET productivity_dna = COALESCE(productivity_dna, '{}'::jsonb) || $1
      WHERE id = $2
      RETURNING *
    `
    const result = await this.pool.query(query, [JSON.stringify(dna), id])
    return this.parseUser(result.rows[0])
  }

  async updateUserLastActive(id: string): Promise<void> {
    const query = 'UPDATE users SET last_active = NOW() WHERE id = $1'
    await this.pool.query(query, [id])
  }

  async deleteUser(id: string): Promise<void> {
    const query = 'DELETE FROM users WHERE id = $1'
    await this.pool.query(query, [id])
  }

  // Session methods
  async createSession(sessionData: Partial<TimerSession>): Promise<TimerSession> {
    const query = `
      INSERT INTO sessions (user_id, type, duration, start_time, task_context, interruptions, is_completed)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `
    const values = [
      sessionData.user_id,
      sessionData.type,
      sessionData.duration,
      sessionData.start_time,
      sessionData.task_context || null,
      sessionData.interruptions || 0,
      sessionData.is_completed || false
    ]

    const result = await this.pool.query(query, values)
    return this.parseSession(result.rows[0])
  }

  async findSessionById(id: string): Promise<TimerSession | null> {
    const query = 'SELECT * FROM sessions WHERE id = $1'
    const result = await this.pool.query(query, [id])
    return result.rows[0] ? this.parseSession(result.rows[0]) : null
  }

  async updateSession(id: string, updates: Partial<TimerSession>): Promise<TimerSession> {
    const setClause = []
    const values = []
    let paramIndex = 1

    if (updates.actual_duration !== undefined) {
      setClause.push(`actual_duration = $${paramIndex++}`)
      values.push(updates.actual_duration)
    }
    if (updates.end_time !== undefined) {
      setClause.push(`end_time = $${paramIndex++}`)
      values.push(updates.end_time)
    }
    if (updates.is_completed !== undefined) {
      setClause.push(`is_completed = $${paramIndex++}`)
      values.push(updates.is_completed)
    }
    if (updates.flow_state !== undefined) {
      setClause.push(`flow_state = $${paramIndex++}`)
      values.push(JSON.stringify(updates.flow_state))
    }
    if (updates.productivity_metrics !== undefined) {
      setClause.push(`productivity_metrics = $${paramIndex++}`)
      values.push(JSON.stringify(updates.productivity_metrics))
    }
    if (updates.interruptions !== undefined) {
      setClause.push(`interruptions = $${paramIndex++}`)
      values.push(updates.interruptions)
    }

    values.push(id)
    const query = `
      UPDATE sessions 
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `

    const result = await this.pool.query(query, values)
    return this.parseSession(result.rows[0])
  }

  async deleteSession(id: string): Promise<void> {
    const query = 'DELETE FROM sessions WHERE id = $1'
    await this.pool.query(query, [id])
  }

  async getUserSessions(userId: string, options: SessionsQuery): Promise<{ data: TimerSession[], total: number }> {
    let whereClause = 'WHERE user_id = $1'
    const values = [userId]
    let paramIndex = 2

    if (options.type) {
      whereClause += ` AND type = $${paramIndex++}`
      values.push(options.type)
    }
    if (options.completed !== undefined) {
      whereClause += ` AND is_completed = $${paramIndex++}`
      values.push(options.completed)
    }
    if (options.start_date) {
      whereClause += ` AND start_time >= $${paramIndex++}`
      values.push(options.start_date)
    }
    if (options.end_date) {
      whereClause += ` AND start_time < $${paramIndex++}`
      values.push(options.end_date)
    }

    // Count total
    const countQuery = `SELECT COUNT(*) FROM sessions ${whereClause}`
    const countResult = await this.pool.query(countQuery, values)
    const total = parseInt(countResult.rows[0].count)

    // Get paginated data
    const offset = ((options.page || 1) - 1) * (options.limit || 20)
    const dataQuery = `
      SELECT * FROM sessions ${whereClause}
      ORDER BY ${options.sort || 'start_time'} ${options.order || 'DESC'}
      LIMIT $${paramIndex++} OFFSET $${paramIndex}
    `
    values.push(options.limit || 20, offset)

    const dataResult = await this.pool.query(dataQuery, values)
    const sessions = dataResult.rows.map(row => this.parseSession(row))

    return { data: sessions, total }
  }

  // Activity metrics methods
  async createActivityMetric(metricData: Partial<ActivityMetric>): Promise<ActivityMetric> {
    const query = `
      INSERT INTO activity_metrics (user_id, session_id, timestamp, keystrokes, mouse_movements, window_switches, idle_time, active_application)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `
    const values = [
      metricData.user_id,
      metricData.session_id || null,
      metricData.timestamp,
      metricData.keystrokes || 0,
      metricData.mouse_movements || 0,
      metricData.window_switches || 0,
      metricData.idle_time || 0,
      metricData.active_application || null
    ]

    const result = await this.pool.query(query, values)
    return this.parseActivityMetric(result.rows[0])
  }

  // Analytics methods (placeholder implementations)
  async getProductivityAnalytics(userId: string, options: AnalyticsQuery): Promise<any> {
    // Implementation would depend on specific analytics requirements
    return { message: 'Analytics implementation in progress' }
  }

  async getFlowAnalytics(userId: string, options: AnalyticsQuery): Promise<any> {
    return { message: 'Flow analytics implementation in progress' }
  }

  async getWeeklyInsights(userId: string): Promise<WeeklyInsight[]> {
    return []
  }

  async getPeakPerformanceTimes(userId: string): Promise<any> {
    return { message: 'Peak performance analysis in progress' }
  }

  async getSessionPatterns(userId: string): Promise<any> {
    return { message: 'Session pattern analysis in progress' }
  }

  async getProductivityTrends(userId: string, days: number): Promise<any> {
    return { message: 'Productivity trends analysis in progress' }
  }

  async getProductivityComparison(userId: string, period: string): Promise<any> {
    return { message: 'Productivity comparison in progress' }
  }

  async generateRecommendations(userId: string): Promise<any> {
    return { recommendations: ['Complete more sessions to get personalized insights'] }
  }

  async getUserStatistics(userId: string): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(*) FILTER (WHERE is_completed = true) as completed_sessions,
        COUNT(*) FILTER (WHERE type = 'focus') as focus_sessions,
        SUM(COALESCE(actual_duration, duration)) FILTER (WHERE type = 'focus' AND is_completed = true) as total_focus_time,
        AVG(duration) FILTER (WHERE type = 'focus') as avg_session_length
      FROM sessions 
      WHERE user_id = $1
    `
    const result = await this.pool.query(query, [userId])
    return result.rows[0] || {}
  }

  async exportUserData(userId: string): Promise<any> {
    const user = await this.findUserById(userId)
    const sessions = await this.getUserSessions(userId, { page: 1, limit: 10000 })
    
    return {
      user: user ? { ...user, password_hash: undefined } : null,
      sessions: sessions.data,
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

  // Helper methods
  private parseUser(row: any): User {
    return {
      ...row,
      preferences: typeof row.preferences === 'string' ? JSON.parse(row.preferences) : row.preferences,
      productivity_dna: row.productivity_dna ? 
        (typeof row.productivity_dna === 'string' ? JSON.parse(row.productivity_dna) : row.productivity_dna) 
        : null,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      last_active: new Date(row.last_active)
    }
  }

  private parseSession(row: any): TimerSession {
    return {
      ...row,
      start_time: new Date(row.start_time),
      end_time: row.end_time ? new Date(row.end_time) : undefined,
      flow_state: row.flow_state ? 
        (typeof row.flow_state === 'string' ? JSON.parse(row.flow_state) : row.flow_state)
        : undefined,
      productivity_metrics: row.productivity_metrics ?
        (typeof row.productivity_metrics === 'string' ? JSON.parse(row.productivity_metrics) : row.productivity_metrics)
        : undefined,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    }
  }

  private parseActivityMetric(row: any): ActivityMetric {
    return {
      ...row,
      timestamp: new Date(row.timestamp),
      created_at: new Date(row.created_at)
    }
  }

  async close(): Promise<void> {
    await this.pool.end()
  }
}