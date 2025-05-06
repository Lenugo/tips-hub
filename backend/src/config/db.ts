import mongoose from "mongoose"

const URI = `mongodb://localhost:27017/${process.env.MONGO_DB_NAME}`

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
