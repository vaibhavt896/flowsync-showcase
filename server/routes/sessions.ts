import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { 
  SessionCreateRequest, 
  SessionUpdateRequest, 
  SessionsQuery,
  AuthenticatedRequest 
} from '../types'
import { authMiddleware } from '../middleware/auth'

const createSessionSchema = z.object({
  type: z.enum(['focus', 'short-break', 'long-break']),
  duration: z.number().min(60).max(7200).optional(), // 1 minute to 2 hours
  task_context: z.string().optional()
})

const updateSessionSchema = z.object({
  end_time: z.string().datetime().optional(),
  is_completed: z.boolean().optional(),
  actual_duration: z.number().min(0).optional(),
  flow_state: z.object({
    is_in_flow: z.boolean(),
    flow_score: z.number().min(0).max(1),
    detection_method: z.enum(['typing', 'mouse', 'focus', 'hybrid']),
    confidence: z.number().min(0).max(1),
    start_time: z.string().datetime().optional(),
    duration: z.number().min(0).optional()
  }).optional(),
  productivity_metrics: z.object({
    keystrokes: z.number().min(0),
    mouse_movements: z.number().min(0),
    application_switches: z.number().min(0),
    focus_time: z.number().min(0),
    distraction_events: z.number().min(0),
    energy_level: z.number().min(1).max(10)
  }).optional(),
  interruptions: z.number().min(0).optional()
})

export async function sessionRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authMiddleware)

  // Create new session
  fastify.post<{ Body: SessionCreateRequest }>('/', {
    schema: {
      body: {
        type: 'object',
        required: ['type'],
        properties: {
          type: { type: 'string', enum: ['focus', 'short-break', 'long-break'] },
          duration: { type: 'number', minimum: 60, maximum: 7200 },
          task_context: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id
      const sessionData = createSessionSchema.parse(request.body)

      // Get default duration if not provided
      let duration = sessionData.duration
      if (!duration) {
        const user = await fastify.db.findUserById(userId)
        if (!user) {
          return reply.status(404).send({
            success: false,
            error: 'User not found'
          })
        }

        const preferences = user.preferences
        duration = sessionData.type === 'focus' 
          ? preferences.focus_duration
          : sessionData.type === 'short-break'
          ? preferences.short_break_duration
          : preferences.long_break_duration
      }

      const session = await fastify.db.createSession({
        user_id: userId,
        type: sessionData.type,
        duration,
        task_context: sessionData.task_context,
        interruptions: 0,
        is_completed: false,
        start_time: new Date()
      })

      return reply.status(201).send({
        success: true,
        data: session
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
        error: 'Failed to create session'
      })
    }
  })

  // Get user sessions with pagination and filtering
  fastify.get<{ Querystring: SessionsQuery }>('/', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 20 },
          type: { type: 'string', enum: ['focus', 'short-break', 'long-break'] },
          completed: { type: 'boolean' },
          start_date: { type: 'string', format: 'date' },
          end_date: { type: 'string', format: 'date' },
          sort: { type: 'string', enum: ['start_time', 'duration', 'created_at'], default: 'start_time' },
          order: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id
      const query = request.query

      const sessions = await fastify.db.getUserSessions(userId, {
        page: query.page || 1,
        limit: query.limit || 20,
        type: query.type,
        completed: query.completed,
        start_date: query.start_date ? new Date(query.start_date) : undefined,
        end_date: query.end_date ? new Date(query.end_date) : undefined,
        sort: query.sort || 'start_time',
        order: query.order || 'desc'
      })

      return reply.send({
        success: true,
        data: sessions
      })

    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch sessions'
      })
    }
  })

  // Get specific session
  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id
      const sessionId = request.params.id

      const session = await fastify.db.findSessionById(sessionId)
      
      if (!session) {
        return reply.status(404).send({
          success: false,
          error: 'Session not found'
        })
      }

      // Check if session belongs to user
      if (session.user_id !== userId) {
        return reply.status(403).send({
          success: false,
          error: 'Access denied'
        })
      }

      return reply.send({
        success: true,
        data: session
      })

    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch session'
      })
    }
  })

  // Update session
  fastify.patch<{ 
    Params: { id: string }
    Body: SessionUpdateRequest 
  }>('/:id', {
    schema: {
      body: {
        type: 'object',
        properties: {
          end_time: { type: 'string', format: 'date-time' },
          is_completed: { type: 'boolean' },
          actual_duration: { type: 'number', minimum: 0 },
          interruptions: { type: 'number', minimum: 0 }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id
      const sessionId = request.params.id
      const updateData = updateSessionSchema.parse(request.body)

      const session = await fastify.db.findSessionById(sessionId)
      
      if (!session) {
        return reply.status(404).send({
          success: false,
          error: 'Session not found'
        })
      }

      // Check if session belongs to user
      if (session.user_id !== userId) {
        return reply.status(403).send({
          success: false,
          error: 'Access denied'
        })
      }

      const updatedSession = await fastify.db.updateSession(sessionId, {
        ...updateData,
        end_time: updateData.end_time ? new Date(updateData.end_time) : undefined
      })

      return reply.send({
        success: true,
        data: updatedSession
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
        error: 'Failed to update session'
      })
    }
  })

  // Delete session
  fastify.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id
      const sessionId = request.params.id

      const session = await fastify.db.findSessionById(sessionId)
      
      if (!session) {
        return reply.status(404).send({
          success: false,
          error: 'Session not found'
        })
      }

      // Check if session belongs to user
      if (session.user_id !== userId) {
        return reply.status(403).send({
          success: false,
          error: 'Access denied'
        })
      }

      await fastify.db.deleteSession(sessionId)

      return reply.send({
        success: true,
        message: 'Session deleted successfully'
      })

    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        success: false,
        error: 'Failed to delete session'
      })
    }
  })

  // Get today's sessions summary
  fastify.get('/today/summary', async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const sessions = await fastify.db.getUserSessions(userId, {
        start_date: today,
        end_date: tomorrow,
        page: 1,
        limit: 1000
      })

      const focusSessions = sessions.data.filter(s => s.type === 'focus')
      const completedSessions = sessions.data.filter(s => s.is_completed)
      
      const totalFocusTime = focusSessions
        .filter(s => s.is_completed)
        .reduce((sum, s) => sum + (s.actual_duration || s.duration), 0)

      const summary = {
        total_sessions: sessions.data.length,
        completed_sessions: completedSessions.length,
        focus_sessions: focusSessions.length,
        total_focus_time: totalFocusTime,
        completion_rate: sessions.data.length > 0 
          ? completedSessions.length / sessions.data.length 
          : 0,
        average_session_length: focusSessions.length > 0
          ? focusSessions.reduce((sum, s) => sum + s.duration, 0) / focusSessions.length
          : 0
      }

      return reply.send({
        success: true,
        data: summary
      })

    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch today\'s summary'
      })
    }
  })
}