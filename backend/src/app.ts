import express from 'express'
import cookieParser from 'cookie-parser'

import advicesRoutes from './routes/advices.route'
import authRoutes from './routes/auth.route'

const app = express()
app.use(express.json())
app.use(cookieParser())

/** Routes */
app.use('/advices', advicesRoutes)
app.use('/auth', authRoutes)

export default app
