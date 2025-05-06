import express from 'express'
import { config } from 'dotenv'
import cookieParser from 'cookie-parser'

import advicesRoutes from './routes/advices.route'
import authRoutes from './routes/auth.route'

config()
const app = express()
app.use(express.json())
app.use(cookieParser())

/** Routes */
app.use('/advices', advicesRoutes)
app.use('/auth', authRoutes)

export default app
