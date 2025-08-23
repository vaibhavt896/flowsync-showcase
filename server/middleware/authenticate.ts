import { FastifyInstance } from 'fastify'
import { authMiddleware } from './auth'

export default async function authenticatePlugin(fastify: FastifyInstance) {
  fastify.decorate('authenticate', authMiddleware)
}