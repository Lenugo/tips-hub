import { object, string, date, minLength, maxLength, optional, InferOutput, pipe, number, array } from 'valibot'

export const AdviceValidationObjectSchema = object({
  title: pipe(string(), minLength(3, 'Title must be at least 3 characters'), maxLength(60, 'Title cannot exceed 60 characters')),
  content: pipe(string(), minLength(20, 'Content must be at least 20 characters')),
  publishedDate: optional(date('Invalid date format')),
  category: pipe(array(string()), minLength(1, 'Category must be at least 1 character')),
  likes: optional(number()),
})

export const AdviceUpdateValidationSchema = object({
  title: optional(pipe(string(), minLength(1, 'Title cannot be empty'))),
  content: optional(pipe(string(), minLength(1, 'Content cannot be empty'))),
  category: optional(array(string()))
})

export type AdviceType = InferOutput<typeof AdviceValidationObjectSchema>
export type AdviceUpdateType = InferOutput<typeof AdviceUpdateValidationSchema>
