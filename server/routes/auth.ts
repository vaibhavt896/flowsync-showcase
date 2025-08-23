import { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { LoginRequest, RegisterRequest, User } from '../types'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1)
})

export async function authRoutes(fastify: FastifyInstance) {
  // Register endpoint
  fastify.post<{ Body: RegisterRequest }>('/register', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password', 'name'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          name: { type: 'string', minLength: 1 }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { email, password, name } = registerSchema.parse(request.body)

      // Check if user already exists
      const existingUser = await fastify.db.findUserByEmail(email)
      if (existingUser) {
        return reply.status(409).send({
          success: false,
          error: 'User already exists'
        })
      }

      // Hash password
      const saltRounds = 12
      const passwordHash = await bcrypt.hash(password, saltRounds)

      // Create user with default preferences
      const defaultPreferences = {
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
          'reddit.com',
          'tiktok.com'
        ]
      }

      const user = await fastify.db.createUser({
        email,
        name,
        password_hash: passwordHash,
        preferences: defaultPreferences
      })

      // Generate JWT token
      const token = fastify.jwt.sign({
        id: user.id,
        email: user.email,
        name: user.name
      })

      // Remove sensitive data
      const { password_hash, ...userResponse } = user

      return reply.send({
        success: true,
        data: {
          user: userResponse,
          token
        }
      })

    } catch (error) {
      fastify.log.error(error)
      
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: 'Validation failed',
          details: error.errors
        })
      }

      return reply.status(500).send({
        success: false,
        error: 'Registration failed'
      })
    }
  })

  // Login endpoint
  fastify.post<{ Body: LoginRequest }>('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { email, password } = loginSchema.parse(request.body)

      // Find user by email
      const user = await fastify.db.findUserByEmail(email)
      if (!user || !user.password_hash) {
        return reply.status(401).send({
          success: false,
          error: 'Invalid credentials'
        })
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash)
      if (!isPasswordValid) {
        return reply.status(401).send({
          success: false,
          error: 'Invalid credentials'
        })
      }

      // Update last active
      await fastify.db.updateUserLastActive(user.id)

      // Generate JWT token
      const token = fastify.jwt.sign({
        id: user.id,
        email: user.email,
        name: user.name
      })

      // Remove sensitive data
      const { password_hash, ...userResponse } = user

      return reply.send({
        success: true,
        data: {
          user: userResponse,
          token
        }
      })

    } catch (error) {
      fastify.log.error(error)
      
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: 'Validation failed',
          details: error.errors
        })
      }

      return reply.status(500).send({
        success: false,
        error: 'Login failed'
      })
    }
  })

  // Refresh token endpoint
  fastify.post('/refresh', async (request, reply) => {
    try {
      const user = request.user!

      // Generate new token
      const token = fastify.jwt.sign({
        id: user.id,
        email: user.email,
        name: user.name
      })

      return reply.send({
        success: true,
        data: { token }
      })

    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        success: false,
        error: 'Token refresh failed'
      })
    }
  })

  // Logout endpoint (mainly for clearing client-side data)
  fastify.post('/logout', async (request, reply) => {
    return reply.send({
      success: true,
      message: 'Logged out successfully'
    })
  })

  // Demo login endpoint (for development)
  if (process.env.NODE_ENV === 'development') {
    fastify.post('/demo', async (request, reply) => {
      try {
        // Create or get demo user
        let demoUser = await fastify.db.findUserByEmail('demo@flowsync.app')
        
        if (!demoUser) {
          const defaultPreferences = {
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
            blocked_sites: []
          }

          demoUser = await fastify.db.createUser({
            email: 'demo@flowsync.app',
            name: 'Demo User',
            password_hash: '', // No password for demo
            preferences: defaultPreferences
          })
        }

        // Generate JWT token
        const token = fastify.jwt.sign({
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name
        })

        // Remove sensitive data
        const { password_hash, ...userResponse } = demoUser

        return reply.send({
          success: true,
          data: {
            user: userResponse,
            token
          }
        })

      } catch (error) {
        fastify.log.error(error)
        return reply.status(500).send({
          success: false,
          error: 'Demo login failed'
        })
      }
    })
  }
}