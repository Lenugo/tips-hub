import { Request, Response, Router } from "express"
import mongoose from "mongoose"

const router = Router()

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const timestamp = new Date().toISOString()
  const connected = mongoose.connection.readyState === 1

  if (!connected) {
    res.status(503).json({
      status: 'UNAVAILABLE',
      database: 'disconnected',
      timestamp
    })
    return
  }

  try {
    await mongoose.connection.db?.admin().ping()
    res.status(200).json({ status: 'OK', timestamp })
  } catch {
    res.status(503).json({
      status: 'UNAVAILABLE',
      database: 'unhealthy',
      timestamp
    })
  }
})

export default router
