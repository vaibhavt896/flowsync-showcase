import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import websocket from '@fastify/websocket'
import { config } from 'dotenv'
import { authRoutes } from './routes/auth'
import { sessionRoutes } from './routes/sessions'
import { userRoutes } from './routes/users'
import { analyticsRoutes } from './routes/analytics'
import { websocketHandler } from './routes/websocket'
import { MockDatabaseManager as DatabaseManager } from './database/mockManager'
import { errorHandler } from './middleware/errorHandler'
import { authMiddleware } from './middleware/auth'
import authenticatePlugin from './middleware/authenticate'

// Load environment variables
config()

const server = fastify({ 
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'info'
  }
})

const PORT = parseInt(process.env.PORT || '3001')
const HOST = process.env.HOST || '0.0.0.0'

async function buildServer() {
  try {
    // Register CORS
    await server.register(cors, {
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://flowsync.app', 'https://www.flowsync.app']
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
    })

    // Register JWT
    await server.register(jwt, {
      secret: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
      sign: {
        expiresIn: '7d'
      }
    })

    // Register WebSocket
    await server.register(websocket)

    // Register authentication plugin
    await server.register(authenticatePlugin)

    // Initialize database
    const dbManager = new DatabaseManager()
    await dbManager.initialize()
    
    // Add database to server context
    server.decorate('db', dbManager)

    // Global error handler
    server.setErrorHandler(errorHandler)

    // Health check
    server.get('/health', async () => {
      return { 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    })

    // API routes
    server.register(authRoutes, { prefix: '/api/auth' })
    server.register(userRoutes, { prefix: '/api/users' })
    server.register(sessionRoutes, { prefix: '/api/sessions' })
    server.register(analyticsRoutes, { prefix: '/api/analytics' })

    // WebSocket routes
    server.register(websocketHandler, { prefix: '/api/ws' })

    // Protected routes middleware
    server.register(async function (fastify) {
      fastify.addHook('preHandler', authMiddleware)
      
      // Add protected routes here
      fastify.get('/api/protected/test', async (request) => {
        return { message: 'This is a protected route', user: request.user }
      })
    })

    return server
  } catch (error) {
    server.log.error(error)
    process.exit(1)
  }
}

async function start() {
  try {
    const server = await buildServer()
    
    await server.listen({ port: PORT, host: HOST })
    
    console.log(`🚀 FlowSync API server running at http://${HOST}:${PORT}`)
    console.log(`🌊 Health check: http://${HOST}:${PORT}/health`)
    console.log(`📡 WebSocket: ws://${HOST}:${PORT}/api/ws`)
    
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down FlowSync server...')
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down FlowSync server...')
  process.exit(0)
})

// Start server if this file is run directly
start()

export { buildServer }