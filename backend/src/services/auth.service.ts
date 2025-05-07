import { type UserSchemaType } from '../schemas/user.schema'
import jwt from 'jsonwebtoken'
import { envs } from '../config/envs'

/**
 * 
 * @param {UserSchemaType} user 
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
