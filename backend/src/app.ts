import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'

import advicesRoutes from './routes/advices.route'
import authRoutes from './routes/auth.route'

import { corsConfig } from './config/cors'
import swaggerDocs from '../swagger.json'

const app = express()

/** Middlewares */
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsConfig))

/** Routes */
app.use('/advices', advicesRoutes)
app.use('/auth', authRoutes)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

export default app
