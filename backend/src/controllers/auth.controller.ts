import { Request, Response } from 'express'
import User from '../models/user.model'
import { hashPasword, comparePassword } from '../services/password.service'
import { generateToken, verifyTokenAndGetUser } from '../services/auth.service'
import { RegisterObjectSchema, LoginObjectSchema } from '../schemas/auth.schema'
import { validateSchema } from '../utils/validation.utils'
import { envs } from '../config/envs'
import { ENVIROMENT_MODE } from '../config/constants'

export const register = async (req: Request, res: Response) => {
  try {
    const result = validateSchema(RegisterObjectSchema, req.body)

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation error', errors: {
          message: result.issues[0].message,
          expected: result.issues[0].expected,
          received: result.issues[0].received,
        }
      })
      return
    }
    
    const { email, password, username } = result.output;

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(409).json({ success: false, message: 'User already exists' })
      return
    }

    const hashedPassword = await hashPasword(password)
    
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
    })
    
    await newUser.save()
    
    const token = generateToken({
      _id: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email,
      password: newUser.password
    })
  
    res.cookie('token', token, {
      httpOnly: true,
      secure: envs.NODE_ENV === ENVIROMENT_MODE.PRODUCTION,
      sameSite: envs.NODE_ENV === ENVIROMENT_MODE.PRODUCTION ? 'none' : 'strict'
    })
    
    res.status(201).json({ success: true, message: 'User created successfully' })
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const result = validateSchema(LoginObjectSchema, req.body)

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation error', errors: {
          message: result.issues[0].message,
          expected: result.issues[0].expected,
          received: result.issues[0].received,
        }
      })
      return
    }

    const { email, password } = result.output

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, message: 'User not found' });
      return
    }

    const isMatch = await comparePassword(password, user.password)

    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' })
      return
    }

    const token = generateToken({
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      password: user.password
    })

    res.cookie('token', token, {
      httpOnly: true,
      secure: envs.NODE_ENV === ENVIROMENT_MODE.PRODUCTION,
      sameSite: envs.NODE_ENV === ENVIROMENT_MODE.PRODUCTION ? 'none' : 'strict'
    })

    res.status(200).json({ success: true, message: 'Login successful' })
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    if (!req.cookies.token) {
      res.status(401).json({ success: false, message: 'Unauthorized' })
      return
    }

    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'strict'
    })

    res.status(200).json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export const userProfile = async (req: Request, res: Response) => {
  try {
    const userFound = await User.findById(req.user?.id)
    
    if (!userFound) {
      res.status(404).json({ success: false, message: 'User not found' })
      return
    }

    res.status(200).json({
      success: true,
      user: {
        id: userFound._id,
        userName: userFound.username,
        email: userFound.email,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt,
      }
    })
  } catch (error) {
    console.error('User error:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.cookies
    const result = await verifyTokenAndGetUser(token)
    
    if (!result || typeof result !== 'object' || !('authenticated' in result) || !result.authenticated) {
      res.status(401).json(result)
      return
    }
    
    res.status(200).json(result)
  } catch (error) {
    console.error('Token verification error:', error)
    res.status(500).json({ authenticated: false, message: 'Internal server error' })
  }
}
