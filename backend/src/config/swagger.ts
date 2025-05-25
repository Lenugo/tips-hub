import swaggerAutogen from 'swagger-autogen'
import path from 'node:path'

const doc = {
  info: {
    title: 'Tips Hub API',
    version: '1.0.0',
    description: 'Tips Hub API - A comprehensive RESTful service providing seamless management of tips, recommendations and user interactions for the Tips Hub platform. Features include user authentication, tip creation/management, and advanced search capabilities.',
    contact: { name: 'Lenugo' }
  },
  host: 'localhost:4000',
  schemes: ['http'],
  securityDefinitions: {
    cookieAuth: {
      type: 'apiKey',
      in: 'cookie',
      name: 'token',
      description: 'Authentication cookie token'
    }
  },
  tags: [
    { name: 'Auth', description: 'Endpoints for user authentication and authorization.' },
    { name: 'Advices', description: 'Endpoints for managing tips and recommendations.' }
  ]
}

const projectRoot = process.cwd()
const outputFile = path.join(projectRoot, 'swagger.json')

const endpointsFiles = [
  path.join(projectRoot, 'src', 'routes', 'advices.route.ts'),
  path.join(projectRoot, 'src', 'routes', 'auth.route.ts'),
]

swaggerAutogen()(outputFile, endpointsFiles, doc)
