import bcrypt from 'bcrypt'

const SALT_ROUNDS: number = 10

/**
 * @param {string} password 
 * @returns Promise
 */
export const hashPasword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * @param {string} password
 * @param {string} hash
 * @returns Promise
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash)
}
