import app from './app'
import { connectDB } from './config/db'
import { envs } from './config/envs'

const start = async () => {
  await connectDB()

  app.listen(envs.PORT, () => {
    console.log(`🚀 Running on port:${envs.PORT}`)
  }).on('error', (err) => {
    console.log('Error in server', err)
  })
}

start()
