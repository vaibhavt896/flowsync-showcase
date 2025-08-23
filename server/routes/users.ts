import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { AuthenticatedRequest, UserPreferences, ProductivityDNA } from '../types'
import { authMiddleware } from '../middleware/auth'

const updatePreferencesSchema = z.object({
  focus_duration: z.number().min(300).max(5400).optional(), // 5 min to 90 min
  short_break_duration: z.number().min(60).max(1800).optional(), // 1 min to 30 min
  long_break_duration: z.number().min(300).max(3600).optional(), // 5 min to 60 min
  long_break_interval: z.number().min(1).max(10).optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  notifications: z.boolean().optional(),
  sound_enabled: z.boolean().optional(),
  auto_start_breaks: z.boolean().optional(),
  auto_start_sessions: z.boolean().optional(),
  block_websites: z.boolean().optional(),
  blocked_sites: z.array(z.string()).optional()
})

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional()
})

export async function userRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authMiddleware)

  // Get current user profile
  fastify.get('/profile', async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id

      const user = await fastify.db.findUserById(userId)
      if (!user) {
        return reply.status(404).send({
          success: false,
          error: 'User not found'
        })
      }

      // Remove sensitive data
      const { password_hash, ...userProfile } = user

      return reply.send({
        success: true,
        data: userProfile
      })

    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch user profile'
      })
    }
  })

  // Update user profile
  fastify.patch<{ Body: Partial<{ name: string; email: string }> }>('/profile', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          email: { type: 'string', format: 'email' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id
      const updateData = updateProfileSchema.parse(request.body)

      // Check if email is already taken
      if (updateData.email) {
        const existingUser = await fastify.db.findUserByEmail(updateData.email)
        if (existingUser && existingUser.id !== userId) {
          return reply.status(409).send({
            success: false,
            error: 'Email already in use'
          })
        }
      }

      const updatedUser = await fastify.db.updateUser(userId, updateData)
      
      // Remove sensitive data
      const { password_hash, ...userProfile } = updatedUser

      return reply.send({
        success: true,
        data: userProfile
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
        error: 'Failed to update profile'
      })
    }
  })

  // Get user preferences
  fastify.get('/preferences', async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id

      const user = await fastify.db.findUserById(userId)
      if (!user) {
        return reply.status(404).send({
          success: false,
          error: 'User not found'
        })
      }

      return reply.send({
        success: true,
        data: user.preferences
      })

    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch preferences'
      })
    }
  })

  // Update user preferences
  fastify.patch<{ Body: Partial<UserPreferences> }>('/preferences', {
    schema: {
      body: {
        type: 'object',
        properties: {
          focus_duration: { type: 'number', minimum: 300, maximum: 5400 },
          short_break_duration: { type: 'number', minimum: 60, maximum: 1800 },
          long_break_duration: { type: 'number', minimum: 300, maximum: 3600 },
          long_break_interval: { type: 'number', minimum: 1, maximum: 10 },
          theme: { type: 'string', enum: ['light', 'dark', 'system'] },
          notifications: { type: 'boolean' },
          sound_enabled: { type: 'boolean' },
          auto_start_breaks: { type: 'boolean' },
          auto_start_sessions: { type: 'boolean' },
          block_websites: { type: 'boolean' },
          blocked_sites: { type: 'array', items: { type: 'string' } }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id
      const preferencesUpdate = updatePreferencesSchema.parse(request.body)

      const updatedUser = await fastify.db.updateUserPreferences(userId, preferencesUpdate)

      return reply.send({
        success: true,
        data: updatedUser.preferences
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
        error: 'Failed to update preferences'
      })
    }
  })

  // Get productivity DNA
  fastify.get('/productivity-dna', async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id

      const user = await fastify.db.findUserById(userId)
      if (!user) {
        return reply.status(404).send({
          success: false,
          error: 'User not found'
        })
      }

      // If no productivity DNA exists, generate initial one
      if (!user.productivity_dna) {
        const initialDNA = await fastify.db.generateInitialProductivityDNA(userId)
        return reply.send({
          success: true,
          data: initialDNA
        })
      }

      return reply.send({
        success: true,
        data: user.productivity_dna
      })

    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch productivity DNA'
      })
    }
  })

  // Update productivity DNA
  fastify.patch<{ Body: Partial<ProductivityDNA> }>('/productivity-dna', async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id
      const dnaUpdate = request.body

      const updatedUser = await fastify.db.updateUserProductivityDNA(userId, dnaUpdate)

      return reply.send({
        success: true,
        data: updatedUser.productivity_dna
      })

    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        success: false,
        error: 'Failed to update productivity DNA'
      })
    }
  })

  // Get user statistics
  fastify.get('/stats', async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id

      const stats = await fastify.db.getUserStatistics(userId)

      return reply.send({
        success: true,
        data: stats
      })

    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch user statistics'
      })
    }
  })

  // Delete user account
  fastify.delete('/account', async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id

      await fastify.db.deleteUser(userId)

      return reply.send({
        success: true,
        message: 'Account deleted successfully'
      })

    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        success: false,
        error: 'Failed to delete account'
      })
    }
  })

  // Export user data
  fastify.get('/export', async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id

      const userData = await fastify.db.exportUserData(userId)

      reply.header('Content-Type', 'application/json')
      reply.header('Content-Disposition', 'attachment; filename="flowsync-data.json"')

      return reply.send({
        success: true,
        data: userData,
        exported_at: new Date().toISOString()
      })

    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        success: false,
        error: 'Failed to export user data'
      })
    }
  })
}