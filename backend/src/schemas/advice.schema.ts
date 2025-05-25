import {
  object,
  string,
  date,
  minLength,
  maxLength,
  optional,
  InferOutput,
  pipe,
  number,
  array,
  union,
  literal,
  transform,
  custom
} from 'valibot'

/**
 * Schema for validating new advice objects
 * Requires:
 * - title: 3-60 characters
 * - content: minimum 20 characters
 * - publishedDate: optional date
 * - categories: array of strings (at least 1)
 * - likes: optional number
 */
export const AdviceValidationObjectSchema = object({
  title: pipe(string(), minLength(3, 'Title must be at least 3 characters'), maxLength(60, 'Title cannot exceed 60 characters')),
  content: pipe(string(), minLength(20, 'Content must be at least 20 characters')),
  publishedDate: optional(date('Invalid date format')),
  categories: pipe(array(string()), minLength(1, 'Categories must be at least 1 character')),
  likes: optional(number()),
})

/**
 * Schema for validating advice updates
 * All fields are optional:
 * - title: non-empty string if provided
 * - content: non-empty string if provided
 * - categories: array of strings if provided
 */
export const AdviceUpdateValidationSchema = object({
  title: optional(pipe(string(), minLength(1, 'Title cannot be empty'))),
  content: optional(pipe(string(), minLength(1, 'Content cannot be empty'))),
  categories: optional(array(string()))
})

/**
 * Schema for validating advice query parameters
 */
export const AdviceQuerySchema = object({
  // Categories can be a string or an array of strings
  categories: optional(union([
    array(string())
  ])),
  
  // Pagination parameters (optional)
  page: optional(
    pipe(
      string(),
      transform((value: string) => {
        const parsed = parseInt(value, 10)
        return isNaN(parsed) || parsed < 1 ? 1 : parsed
      })
    )
  ),
  
  limit: optional(
    pipe(
      string(),
      transform((value: string) => {
        const parsed = parseInt(value, 10)
        return isNaN(parsed) || parsed < 1 || parsed > 100 ? 10 : parsed
      })
    )
  ),
  
  // Sorting parameters
  sortBy: optional(
    pipe(
      string(),
      custom((input): boolean => {
        const allowedFields = ['createdAt', 'title', 'likes', 'publishedDate']
        return allowedFields.includes(input as string)
      }
    ))
  ),
  
  order: optional(
    union([
      literal('asc'),
      literal('desc')
    ])
  )
})

/** Type definition */
export type AdviceQueryType = InferOutput<typeof AdviceQuerySchema>
export type AdviceType = InferOutput<typeof AdviceValidationObjectSchema>
export type AdviceUpdateType = InferOutput<typeof AdviceUpdateValidationSchema>
