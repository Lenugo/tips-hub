import { object, string, minLength, maxLength, optional, InferOutput, pipe } from 'valibot'

const UserValidationObjectSchema = object({
  _id: optional(string()),
  username: pipe(
    string(),
    minLength(3, 'Username must be at least 3 characters'),
    maxLength(30, 'Username cannot exceed 30 characters')),
  email: pipe(
    string(),
    minLength(5, 'Email must be at least 5 characters'),
    maxLength(50, 'Email cannot exceed 50 characters')),
  password: pipe(
    string(),
    minLength(8, 'Password must be at least 8 characters'),
    maxLength(100, 'Password cannot exceed 100 characters')),
});

export type UserSchemaType = InferOutput<typeof UserValidationObjectSchema>;
