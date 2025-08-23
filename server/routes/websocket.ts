import { FastifyInstance } from 'fastify'
import { SocketStream } from '@fastify/websocket'
import { WebSocketMessage } from '../types'

interface ClientConnection {
  socket: SocketStream
  userId: string
  sessionId?: string
}

// Store active connections
const activeConnections = new Map<string, ClientConnection>()

export async function websocketHandler(fastify: FastifyInstance) {
  
  // WebSocket connection endpoint
  fastify.get('/', { websocket: true }, (connection, request) => {
    const { socket } = connection

    let clientConnection: ClientConnection | null = null

    // Handle connection
    socket.on('message', async (messageBuffer) => {
      try {
        const message: WebSocketMessage = JSON.parse(messageBuffer.toString())

        switch (message.type) {
          case 'auth':
            await handleAuth(socket, message.data, fastify)
            break

          case 'session_start':
            if (clientConnection) {
              await handleSessionStart(clientConnection, message.data, fastify)
            }
            break

          case 'session_update':
            if (clientConnection) {
              await handleSessionUpdate(clientConnection, message.data, fastify)
            }
            break

          case 'session_complete':
            if (clientConnection) {
              await handleSessionComplete(clientConnection, message.data, fastify)
            }
            break

          case 'flow_state_change':
            if (clientConnection) {
              await handleFlowStateChange(clientConnection, message.data, fastify)
            }
            break

          case 'activity_update':
            if (clientConnection) {
              await handleActivityUpdate(clientConnection, message.data, fastify)
            }
            break

          case 'heartbeat':
            socket.send(JSON.stringify({
              type: 'heartbeat_ack',
              timestamp: new Date()
            }))
            break

          default:
            fastify.log.warn(`Unknown message type: ${message.type}`)
        }

      } catch (error) {
        fastify.log.error('WebSocket message error:', error)
        socket.send(JSON.stringify({
          type: 'error',
          data: { message: 'Invalid message format' },
          timestamp: new Date()
        }))
      }
    })

    // Handle connection close
    socket.on('close', () => {
      if (clientConnection) {
        activeConnections.delete(clientConnection.userId)
        fastify.log.info(`WebSocket disconnected: ${clientConnection.userId}`)
      }
    })

    // Handle errors
    socket.on('error', (error) => {
      fastify.log.error('WebSocket error:', error)
      if (clientConnection) {
        activeConnections.delete(clientConnection.userId)
      }
    })

    // Store reference for auth handler
    const tempConnection = { socket, userId: '', sessionId: undefined }
    clientConnection = tempConnection

    // Send welcome message
    socket.send(JSON.stringify({
      type: 'connected',
      data: { message: 'WebSocket connected. Please authenticate.' },
      timestamp: new Date()
    }))
  })

  // Broadcast message to specific user
  fastify.decorate('broadcastToUser', (userId: string, message: WebSocketMessage) => {
    const connection = activeConnections.get(userId)
    if (connection) {
      connection.socket.send(JSON.stringify(message))
    }
  })

  // Broadcast message to all connected users
  fastify.decorate('broadcastToAll', (message: WebSocketMessage) => {
    activeConnections.forEach((connection) => {
      connection.socket.send(JSON.stringify(message))
    })
  })
}

async function handleAuth(
  socket: SocketStream, 
  data: { token: string }, 
  fastify: FastifyInstance
) {
  try {
    // Verify JWT token
    const decoded = fastify.jwt.verify(data.token) as any
    
    const clientConnection: ClientConnection = {
      socket,
      userId: decoded.id,
      sessionId: undefined
    }

    // Store connection
    activeConnections.set(decoded.id, clientConnection)

    // Send auth success
    socket.send(JSON.stringify({
      type: 'auth_success',
      data: { userId: decoded.id },
      timestamp: new Date()
    }))

    fastify.log.info(`WebSocket authenticated: ${decoded.email}`)

  } catch (error) {
    socket.send(JSON.stringify({
      type: 'auth_error',
      data: { message: 'Authentication failed' },
      timestamp: new Date()
    }))
  }
}

async function handleSessionStart(
  connection: ClientConnection,
  data: any,
  fastify: FastifyInstance
) {
  try {
    // Create session in database
    const session = await fastify.db.createSession({
      user_id: connection.userId,
      type: data.type,
      duration: data.duration,
      task_context: data.task_context,
      interruptions: 0,
      is_completed: false,
      start_time: new Date()
    })

    // Update connection with session ID
    connection.sessionId = session.id

    // Send confirmation
    connection.socket.send(JSON.stringify({
      type: 'session_started',
      data: session,
      timestamp: new Date()
    }))

    fastify.log.info(`Session started: ${session.id} for user ${connection.userId}`)

  } catch (error) {
    fastify.log.error('Session start error:', error)
    connection.socket.send(JSON.stringify({
      type: 'session_error',
      data: { message: 'Failed to start session' },
      timestamp: new Date()
    }))
  }
}

async function handleSessionUpdate(
  connection: ClientConnection,
  data: any,
  fastify: FastifyInstance
) {
  try {
    if (!connection.sessionId) {
      throw new Error('No active session')
    }

    // Update session in database
    const updatedSession = await fastify.db.updateSession(connection.sessionId, data)

    // Send confirmation
    connection.socket.send(JSON.stringify({
      type: 'session_updated',
      data: updatedSession,
      timestamp: new Date()
    }))

  } catch (error) {
    fastify.log.error('Session update error:', error)
    connection.socket.send(JSON.stringify({
      type: 'session_error',
      data: { message: 'Failed to update session' },
      timestamp: new Date()
    }))
  }
}

async function handleSessionComplete(
  connection: ClientConnection,
  data: any,
  fastify: FastifyInstance
) {
  try {
    if (!connection.sessionId) {
      throw new Error('No active session')
    }

    // Complete session in database
    const completedSession = await fastify.db.updateSession(connection.sessionId, {
      ...data,
      is_completed: true,
      end_time: new Date()
    })

    // Clear session from connection
    connection.sessionId = undefined

    // Send confirmation
    connection.socket.send(JSON.stringify({
      type: 'session_completed',
      data: completedSession,
      timestamp: new Date()
    }))

    fastify.log.info(`Session completed: ${completedSession.id}`)

  } catch (error) {
    fastify.log.error('Session complete error:', error)
    connection.socket.send(JSON.stringify({
      type: 'session_error',
      data: { message: 'Failed to complete session' },
      timestamp: new Date()
    }))
  }
}

async function handleFlowStateChange(
  connection: ClientConnection,
  data: any,
  fastify: FastifyInstance
) {
  try {
    // Store flow state data (could be in separate table or as part of session)
    if (connection.sessionId) {
      await fastify.db.updateSession(connection.sessionId, {
        flow_state: data
      })
    }

    // Acknowledge flow state change
    connection.socket.send(JSON.stringify({
      type: 'flow_state_acknowledged',
      data: { flow_state: data },
      timestamp: new Date()
    }))

    // Could trigger AI analysis here

  } catch (error) {
    fastify.log.error('Flow state change error:', error)
  }
}

async function handleActivityUpdate(
  connection: ClientConnection,
  data: any,
  fastify: FastifyInstance
) {
  try {
    // Store activity metrics
    await fastify.db.createActivityMetric({
      user_id: connection.userId,
      session_id: connection.sessionId,
      timestamp: new Date(data.timestamp),
      keystrokes: data.keystrokes,
      mouse_movements: data.mouse_movements,
      window_switches: data.window_switches,
      idle_time: data.idle_time,
      active_application: data.active_application
    })

    // Optional: Send acknowledgment
    // connection.socket.send(JSON.stringify({
    //   type: 'activity_acknowledged',
    //   timestamp: new Date()
    // }))

  } catch (error) {
    fastify.log.error('Activity update error:', error)
  }
}

// Utility functions for external use
export function broadcastToUser(userId: string, message: WebSocketMessage) {
  const connection = activeConnections.get(userId)
  if (connection) {
    connection.socket.send(JSON.stringify(message))
  }
}

export function broadcastToAll(message: WebSocketMessage) {
  activeConnections.forEach((connection) => {
    connection.socket.send(JSON.stringify(message))
  })
}

export function getActiveConnections() {
  return Array.from(activeConnections.keys())
}