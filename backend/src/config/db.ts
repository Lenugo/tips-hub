import mongoose from 'mongoose'
import { envs } from '../config/envs'
import { ENVIROMENT_MODE } from './constants';

const getDatabaseConfig = () => {
  if (envs.NODE_ENV === ENVIROMENT_MODE.PRODUCTION && envs.MONGODB_URI) {
    console.log('🚀 ~ Cluster MongoDB Atlas connected ');
    return { uri: envs.MONGODB_URI }
  }

  /** Fallback local development */
  return {
    uri: `mongodb://127.0.0.1:27017/${envs.MONGO_DB_NAME}`,
  }
}

/**
 * Connect to MongoDB
 * @returns {Promise<void>}
 */
export const connectDB = async (): Promise<void> => {
  const config = getDatabaseConfig()

  try {
    if (!config.uri) {
      throw new Error('Database configuration is missing. Please check your environment variables.');
    }
    
    await mongoose.connect(config.uri)
    console.log("✅ Connected to MongoDB successfully")
  } catch (error) {
    console.log("Error connecting to MongoDB", error)
    process.exit(1)
  }
}
