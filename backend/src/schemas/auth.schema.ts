import { Request } from 'express';
import { email, minLength, object, string, pipe, safeParse, SafeParseResult } from 'valibot';

const RegisterObjectSchema = object({
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

const LoginObjectSchema = object({
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

export const registerSchema = (req: Request): SafeParseResult<typeof RegisterObjectSchema> => {
  return safeParse(RegisterObjectSchema, req.body)
}

export const loginSchema = (req: Request): SafeParseResult<typeof LoginObjectSchema> => {
  return safeParse(LoginObjectSchema, req.body)
}

