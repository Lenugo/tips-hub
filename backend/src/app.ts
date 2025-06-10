import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'

import advicesRoutes from './routes/advices.route'
import authRoutes from './routes/auth.route'
import healthRoute from './routes/health.route'

import { corsConfig } from './config/cors'

const app = express()

/** Middlewares */
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsConfig))

/** Routes */
app.use('/api/advices', advicesRoutes)
app.use('/api/auth', authRoutes)
/** Conditionally import swaggerDocs and set up swagger UI */
let swaggerDocs
try {
  swaggerDocs = require('../swagger.json')
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
  console.log('🗒️ Swagger UI available at /api/docs')
} catch {
  console.error('Swagger file not found, swagger UI will not be available. Make sure you have generated the swagger.json file.');
}
app.use('/health', healthRoute) /** for deploy purposes */


export default app
