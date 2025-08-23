#!/usr/bin/env tsx

import { DatabaseManager } from '../database/manager'
import { config } from 'dotenv'
import bcrypt from 'bcrypt'

// Load environment variables
config()

async function seedDatabase() {
  console.log('🌱 Starting FlowSync database seeding...')
  
  const dbManager = new DatabaseManager()
  
  try {
    await dbManager.initialize()
    
    // Create demo users
    const demoUsers = [
      {
        email: 'demo@flowsync.app',
        name: 'Demo User',
        password: 'demo123456',
        preferences: {
          focus_duration: 25 * 60,
          short_break_duration: 5 * 60,
          long_break_duration: 15 * 60,
          long_break_interval: 4,
          theme: 'system' as const,
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
            'reddit.com'
          ]
        }
      },
      {
        email: 'alice@example.com',
        name: 'Alice Johnson',
        password: 'password123',
        preferences: {
          focus_duration: 30 * 60,
          short_break_duration: 5 * 60,
          long_break_duration: 20 * 60,
          long_break_interval: 4,
          theme: 'light' as const,
          notifications: true,
          sound_enabled: false,
          auto_start_breaks: true,
          auto_start_sessions: false,
          block_websites: true,
          blocked_sites: ['facebook.com', 'instagram.com', 'tiktok.com']
        }
      }
    ]

    for (const userData of demoUsers) {
      // Check if user already exists
      const existingUser = await dbManager.findUserByEmail(userData.email)
      if (existingUser) {
        console.log(`👤 User ${userData.email} already exists, skipping...`)
        continue
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 12)

      // Create user
      const user = await dbManager.createUser({
        email: userData.email,
        name: userData.name,
        password_hash: passwordHash,
        preferences: userData.preferences
      })

      console.log(`✅ Created user: ${user.email}`)

      // Create some demo sessions for each user
      const sessionTypes: ('focus' | 'short-break' | 'long-break')[] = ['focus', 'short-break', 'focus', 'focus', 'long-break']
      const now = new Date()

      for (let i = 0; i < sessionTypes.length; i++) {
        const sessionType = sessionTypes[i]
        const startTime = new Date(now.getTime() - (i + 1) * 60 * 60 * 1000) // Hours ago
        const duration = sessionType === 'focus' ? 25 * 60 : sessionType === 'short-break' ? 5 * 60 : 15 * 60
        const endTime = new Date(startTime.getTime() + duration * 1000)

        const session = await dbManager.createSession({
          user_id: user.id,
          type: sessionType,
          duration: duration,
          actual_duration: duration - Math.floor(Math.random() * 300), // Slight variation
          start_time: startTime,
          end_time: endTime,
          is_completed: Math.random() > 0.1, // 90% completion rate
          interruptions: Math.floor(Math.random() * 3),
          task_context: sessionType === 'focus' ? `Focus task ${i + 1}` : undefined,
          productivity_metrics: sessionType === 'focus' ? {
            keystrokes: Math.floor(Math.random() * 500) + 200,
            mouse_movements: Math.floor(Math.random() * 300) + 100,
            application_switches: Math.floor(Math.random() * 10),
            focus_time: duration - Math.floor(Math.random() * 300),
            distraction_events: Math.floor(Math.random() * 5),
            energy_level: Math.floor(Math.random() * 5) + 5
          } : undefined,
          flow_state: sessionType === 'focus' ? {
            is_in_flow: Math.random() > 0.3,
            flow_score: Math.random() * 0.6 + 0.4,
            detection_method: 'hybrid' as const,
            confidence: Math.random() * 0.4 + 0.6,
            start_time: new Date(startTime.getTime() + Math.random() * 300 * 1000),
            duration: Math.floor(Math.random() * duration * 0.8)
          } : undefined
        })

        // Create some activity metrics for focus sessions
        if (sessionType === 'focus') {
          const metricCount = Math.floor(duration / 30) // One metric every 30 seconds
          
          for (let j = 0; j < metricCount; j++) {
            const metricTime = new Date(startTime.getTime() + j * 30 * 1000)
            
            await dbManager.createActivityMetric({
              user_id: user.id,
              session_id: session.id,
              timestamp: metricTime,
              keystrokes: Math.floor(Math.random() * 20) + 5,
              mouse_movements: Math.floor(Math.random() * 15) + 3,
              window_switches: Math.floor(Math.random() * 2),
              idle_time: Math.random() * 5,
              active_application: 'FlowSync'
            })
          }
        }
      }

      console.log(`📊 Created ${sessionTypes.length} demo sessions for ${user.email}`)

      // Generate initial productivity DNA
      await dbManager.generateInitialProductivityDNA(user.id)
      console.log(`🧬 Generated productivity DNA for ${user.email}`)
    }

    console.log('✅ Database seeding completed successfully!')
    console.log('\n🔑 Demo Login Credentials:')
    console.log('Email: demo@flowsync.app')
    console.log('Password: demo123456')
    console.log('\nEmail: alice@example.com')
    console.log('Password: password123')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  } finally {
    await dbManager.close()
  }
}

if (require.main === module) {
  seedDatabase()
}