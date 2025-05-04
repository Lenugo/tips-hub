import express from 'express'
import dotenv from 'dotenv'

import advicesRoutes from './routes/advices.route'

dotenv.config()
const app = express()
app.use(express.json())

/** Routes */
app.use('/advices', advicesRoutes)

export default app
