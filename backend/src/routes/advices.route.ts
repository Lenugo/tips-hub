import { Router } from 'express'
import { getAllAdvices } from '../controllers/advice.controller'
const router = Router()

router.get('/', getAllAdvices)

export default router
