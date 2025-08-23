import { FastifyRequest, FastifyReply } from 'fastify'
import { AuthenticatedRequest } from '../types'

export async function authMiddleware(
  request: FastifyRequest, 
  reply: FastifyReply
) {
  try {
    // Check for authorization header
    const authHeader = request.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({
        success: false,
        error: 'Missing or invalid authorization header'
      })
    }

    // Extract token
    const token = authHeader.substring(7)
    
    // Verify JWT token
    const decoded = request.server.jwt.verify(token) as any
    
    // Attach user to request
    ;(request as AuthenticatedRequest).user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name
    }
    
  } catch (error) {
    return reply.status(401).send({
      success: false,
      error: 'Invalid or expired token'
    })
  }
}

export async function optionalAuthMiddleware(
  request: FastifyRequest, 
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const decoded = request.server.jwt.verify(token) as any
      
      ;(request as AuthenticatedRequest).user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name
      }
    }
  } catch (error) {
    // Optional auth - don't throw error, just continue without user
  }
}