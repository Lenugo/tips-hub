import app from './app'
import { connectDB } from './config/db'

const PORT = process.env.PORT || 3001
const enviroment = process.env.NODE_ENV || 'development'

/** Connect to DB */
connectDB()

app.listen(PORT, () => {
  console.log(`Running on ${enviroment === 'development' ? `http://localhost:${PORT}` : `port:${PORT}`}`)
}).on('error', (err) => {
  console.log(err)
})