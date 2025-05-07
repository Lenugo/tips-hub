import mongoose from 'mongoose'
import { envs } from '../config/envs'

const URI = `mongodb://localhost:27017/${envs.MONGO_DB_NAME}`

/**
 * Connect to MongoDB
 * @returns {Promise<void>}
 */
export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(URI)
    console.log("Connected to MongoDB")
  } catch (error) {
    console.log("Error connecting to MongoDB", error)
    process.exit(1)
  }
}
