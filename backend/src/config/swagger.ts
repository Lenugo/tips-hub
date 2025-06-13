import swaggerAutogen from 'swagger-autogen'
import path from 'node:path'
import { envs } from './envs'
import { ENVIROMENT_MODE } from './constants'

const doc = {
  info: {
    title: 'Tips Hub API',
    version: '1.0.0',
    description: 'Tips Hub API - A comprehensive RESTful service providing seamless management of tips, recommendations and user interactions for the Tips Hub platform. Features include user authentication, tip creation/management, and advanced search capabilities.',
    contact: { name: 'Lenugo' }
  },
  host: envs.NODE_ENV === ENVIROMENT_MODE.PRODUCTION ? 'https://tips-hub-backend-latest.onrender.com' : 'localhost:4000',
  schemes: envs.NODE_ENV === ENVIROMENT_MODE.PRODUCTION ? ['https'] : ['http'],
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
