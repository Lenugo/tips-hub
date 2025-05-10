import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import advicesRoutes from './routes/advices.route'
import authRoutes from './routes/auth.route'
import { corsConfig } from './config/cors'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsConfig))

/** Routes */
app.use('/advices', advicesRoutes)
app.use('/auth', authRoutes)

export default app
