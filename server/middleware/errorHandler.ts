import { FastifyError, FastifyRequest, FastifyReply } from 'fastify'

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { log } = request

  // Log error details
  log.error({
    error,
    url: request.url,
    method: request.method,
    headers: request.headers,
  }, 'Request error')

  // Handle different error types
  if (error.validation) {
    return reply.status(400).send({
      success: false,
      error: 'Validation Error',
      message: 'Invalid request data',
      details: error.validation
    })
  }

  if (error.statusCode === 401) {
    return reply.status(401).send({
      success: false,
      error: 'Unauthorized',
      message: 'Authentication required'
    })
  }

  if (error.statusCode === 403) {
    return reply.status(403).send({
      success: false,
      error: 'Forbidden',
      message: 'Insufficient permissions'
    })
  }

  if (error.statusCode === 404) {
    return reply.status(404).send({
      success: false,
      error: 'Not Found',
      message: 'Resource not found'
    })
  }

  if (error.statusCode === 429) {
    return reply.status(429).send({
      success: false,
      error: 'Rate Limit Exceeded',
      message: 'Too many requests. Please try again later.'
    })
  }

  // Database errors
  if (error.message?.includes('duplicate key')) {
    return reply.status(409).send({
      success: false,
      error: 'Conflict',
      message: 'Resource already exists'
    })
  }

  if (error.message?.includes('foreign key')) {
    return reply.status(400).send({
      success: false,
      error: 'Bad Request',
      message: 'Invalid reference to related resource'
    })
  }

  // Default server error
  const statusCode = error.statusCode || 500
  const isProduction = process.env.NODE_ENV === 'production'

  return reply.status(statusCode).send({
    success: false,
    error: statusCode >= 500 ? 'Internal Server Error' : 'Request Error',
    message: isProduction && statusCode >= 500 
      ? 'An unexpected error occurred'
      : error.message,
    ...(isProduction ? {} : { stack: error.stack })
  })
}