import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { envs } from '../config/envs'
import { User } from '../types/global'

/**
 * Middleware to authenticate JWT token from cookies
 * Verifies the token and adds the user data to the request object
 * Returns 401 if no token is present
 * Returns 400 if token is invalid
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {  
  try {
    const { token } = req.cookies
  
    if (!token) {
      res.status(401).json({ message: 'Access Denied' })
      return
    }

    const verified = jwt.verify(token, envs.JWT_SECRET as string)
    req.user = verified as User
    next()
  } catch (error) {
    res.status(400).json({ message: 'Invalid Token Signature' })
  }
}