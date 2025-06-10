import { config } from 'dotenv'

config()

/**
 * Environment variables configuration object
 * @property {string} PORT - Server port number
 * @property {string} JWT_SECRET - Secret key for JWT token generation
 * @property {string} NODE_ENV - Node environment (development/production)
 * @property {string} MONGODB_URI - MongoDB connection URI
 * @property {string} MONGO_DB_NAME - MongoDB database name
 */
export const envs = {
  PORT: process.env.PORT ?? '3001',
  JWT_SECRET: process.env.JWT_SECRET ?? 'unkown',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  MONGODB_URI: process.env.MONGO_URI ?? process.env.MONGODB_URI ?? '',
  MONGO_DB_NAME: process.env.MONGO_DB_NAME ?? 'tips-hub-db',
}
