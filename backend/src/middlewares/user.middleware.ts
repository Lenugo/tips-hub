import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../services/auth.service'
import { User } from '../types/global'

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {  
  const { token } = req.cookies

  if (!token) {
    res.status(401).json({ message: 'Access Denied' })
    return
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET)
    req.user = verified as User
    next()
  } catch (error) {
    res.status(400).json({ message: 'Invalid Token' })
  }
}