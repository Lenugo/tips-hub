import { type UserSchemaType } from '../schemas/user.schema'
import jwt from 'jsonwebtoken'

export const JWT_SECRET = process.env.JWT_SECRET ?? 'unkown'

/**
 * 
 * @param {UserSchemaType} user 
 * @returns jwt token
 */
export const generateToken = (user: UserSchemaType): string => {
  try {
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    return token
  } catch (error) {
    console.error('Error generating token:', error)
    throw new Error('Error generating token')
  }
}
