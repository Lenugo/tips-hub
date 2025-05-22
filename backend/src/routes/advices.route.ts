import { Router } from 'express'
import { getAllAdvices, createAdvice, getAdviceById, updateAdvice, deleteAdvice, getAllAdvicesByUser, incrementLikes } from '../controllers/advice.controller'
import { authenticateToken } from '../middlewares/user.middleware'

const router = Router()

router.get('/', getAllAdvices)
router.get('/user', authenticateToken, getAllAdvicesByUser)
router.get('/:id', getAdviceById)
router.post('/', authenticateToken, createAdvice)
router.post('/likes/:id', authenticateToken, incrementLikes)
router.patch('/:id', authenticateToken, updateAdvice)
router.delete('/:id', authenticateToken, deleteAdvice)

export default router
