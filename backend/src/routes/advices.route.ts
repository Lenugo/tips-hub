import { Router } from 'express'
import { getAllAdvices, createAdvice, getAdviceById, updateAdvice, deleteAdvice } from '../controllers/advice.controller'
import { authenticateToken } from '../middlewares/user.middleware'

const router = Router()

router.get('/', authenticateToken, getAllAdvices)
router.post('/', authenticateToken, createAdvice)
router.get('/:id', authenticateToken, getAdviceById)
router.patch('/:id', authenticateToken, updateAdvice)
router.delete('/:id', authenticateToken, deleteAdvice)

export default router
