import { email, minLength, object, string, pipe } from 'valibot';

export const RegisterObjectSchema = object({
  email: pipe(
    string(),
    minLength(1, 'Email is required'),
    email('Invalid email format')
  ),
  password: pipe(
    string(),
    minLength(6, 'Password must be at least 6 characters')
  ),
  username: pipe(
    string(),
    minLength(1, 'Username is required')
  )
})

export const LoginObjectSchema = object({
  email: pipe(
    string(),
    minLength(1, 'Email is required'),
    email('Invalid email format')
  ),
  password: pipe(
    string(),
    minLength(6, 'Password must be at least 6 characters')
  )
})
