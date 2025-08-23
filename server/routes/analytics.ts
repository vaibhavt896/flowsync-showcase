import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { AuthenticatedRequest, AnalyticsQuery } from '../types'
import { authMiddleware } from '../middleware/auth'

const analyticsQuerySchema = z.object({
  period: z.enum(['day', 'week', 'month', 'year']),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional()
})

export async function analyticsRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authMiddleware)

  // Get productivity analytics
  fastify.get<{ Querystring: AnalyticsQuery }>('/productivity', {
    schema: {
      querystring: {
        type: 'object',
        required: ['period'],
        properties: {
          period: { type: 'string', enum: ['day', 'week', 'month', 'year'] },
          start_date: { type: 'string', format: 'date-time' },
          end_date: { type: 'string', format: 'date-time' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id
      const query = analyticsQuerySchema.parse(request.query)

      const analytics = await fastify.db.getProductivityAnalytics(userId, {
        period: query.period,
        start_date: query.start_date ? new Date(query.start_date) : undefined,
        end_date: query.end_date ? new Date(query.end_date) : undefined
      })

      return reply.send({
        success: true,
        data: analytics
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
        error: 'Failed to fetch productivity analytics'
      })
    }
  })

  // Get flow analytics
  fastify.get<{ Querystring: AnalyticsQuery }>('/flow', {
    schema: {
      querystring: {
        type: 'object',
        required: ['period'],
        properties: {
          period: { type: 'string', enum: ['day', 'week', 'month', 'year'] },
          start_date: { type: 'string', format: 'date-time' },
          end_date: { type: 'string', format: 'date-time' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id
      const query = analyticsQuerySchema.parse(request.query)

      const flowAnalytics = await fastify.db.getFlowAnalytics(userId, {
        period: query.period,
        start_date: query.start_date ? new Date(query.start_date) : undefined,
        end_date: query.end_date ? new Date(query.end_date) : undefined
      })

      return reply.send({
        success: true,
        data: flowAnalytics
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
        error: 'Failed to fetch flow analytics'
      })
    }
  })

  // Get weekly insights
  fastify.get('/insights/weekly', async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id

      const insights = await fastify.db.getWeeklyInsights(userId)

      return reply.send({
        success: true,
        data: insights
      })

    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch weekly insights'
      })
    }
  })

  // Get peak performance times
  fastify.get('/peak-times', async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id

      const peakTimes = await fastify.db.getPeakPerformanceTimes(userId)

      return reply.send({
        success: true,
        data: peakTimes
      })

    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch peak performance times'
      })
    }
  })

  // Get session patterns
  fastify.get('/patterns/sessions', async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id

      const patterns = await fastify.db.getSessionPatterns(userId)

      return reply.send({
        success: true,
        data: patterns
      })

    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch session patterns'
      })
    }
  })

  // Get productivity trends
  fastify.get('/trends', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          days: { type: 'number', minimum: 7, maximum: 365, default: 30 }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id
      const days = (request.query as any).days || 30

      const trends = await fastify.db.getProductivityTrends(userId, days)

      return reply.send({
        success: true,
        data: trends
      })

    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch productivity trends'
      })
    }
  })

  // Get comparison with previous period
  fastify.get('/comparison', {
    schema: {
      querystring: {
        type: 'object',
        required: ['period'],
        properties: {
          period: { type: 'string', enum: ['week', 'month', 'quarter'] }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id
      const period = (request.query as any).period

      const comparison = await fastify.db.getProductivityComparison(userId, period)

      return reply.send({
        success: true,
        data: comparison
      })

    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch productivity comparison'
      })
    }
  })

  // Get recommendations based on analytics
  fastify.get('/recommendations', async (request, reply) => {
    try {
      const userId = (request as AuthenticatedRequest).user.id

      const recommendations = await fastify.db.generateRecommendations(userId)

      return reply.send({
        success: true,
        data: recommendations
      })

    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch recommendations'
      })
    }
  })
}