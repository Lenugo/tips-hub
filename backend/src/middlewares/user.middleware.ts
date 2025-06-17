import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { envs } from '../config/envs'
import { User } from '../types/global'

/**
 * Middleware to authenticate JWT token from token in the request header.
 * Verifies the token and adds the user data to the request object
 * Returns 401 if no token is provided or if the token is invalid
 * Returns 400 if token signature is invalid
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }
    
    const token = req.headers.authorization.split(' ')[1]
    
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }
    
    const verified = jwt.verify(token, envs.JWT_SECRET as string)
    req.user = verified as User
    next()
  } catch (error) {
    res.status(400).json({ message: 'Invalid Token Signature' })
  }
}