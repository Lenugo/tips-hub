import { Router } from 'express'
import { register, login, logout, userProfile, verifyToken } from '../controllers/auth.controller'
import { authenticateToken } from '../middlewares/user.middleware'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/check', verifyToken)
router.get('/profile', authenticateToken, userProfile)

export default router
