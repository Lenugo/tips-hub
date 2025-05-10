import { type UserSchemaType } from '../schemas/user.schema'
import jwt from 'jsonwebtoken'
import { envs } from '../config/envs'
import User from '../models/user.model'

/**
 * generate token for user
 * @param {UserSchemaType} user - user object
 * @returns jwt token
 */
export const generateToken = (user: UserSchemaType): string => {
  try {
    const token = jwt.sign(
      { id: user._id, email: user.email },
      envs.JWT_SECRET,
      { expiresIn: '1d', algorithm: 'HS256' }
    )

    return token
  } catch (error) {
    console.error('Error generating token:', error)
    throw new Error('Error generating token')
  }
}

/**
 * Verifies a JWT token and returns whether it's valid
 * @param {string} token - The JWT token to verify
 * @returns Promise resolving to boolean indicating if token is valid
 */
export const verifyTokenAndGetUser = async (token: string) => {
  if (!token) {
    return { authenticated: false, message: 'Unauthorized' }
  }

  try {
    return new Promise((resolve, reject) => {
      jwt.verify(token, envs.JWT_SECRET, async (err: any, decoded: any) => {
        if (err) {
          resolve({ authenticated: false, message: 'Unauthorized' })
          return
        }

        try {
          const userFound = await User.findById(decoded.id)

          if (!userFound) {
            resolve({ authenticated: false, message: 'User not found' })
            return
          }

          resolve({
            authenticated: true,
            message: 'Authorized',
            user: { 
              id: userFound._id,
              userName: userFound.username,
              email: userFound.email
            }
          })
        } catch (error) {
          reject(error)
        }
      })
    })
  } catch (error) {
    throw error
  }
}
