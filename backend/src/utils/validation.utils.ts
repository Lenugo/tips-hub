import mongoose from 'mongoose'
import { Response } from 'express'
import { BaseSchema, SafeParseResult, safeParse, ObjectSchema } from 'valibot';

import { IAdvice } from '../types/advice.type'

/**
 * Transforms an Advice document by renaming _id to id and selecting specific fields
 * @param advice The advice document to transform
 * @returns A transformed advice object with renamed fields
 */
export const transformAdviceData = (advice: IAdvice) => {
  const { _id, title, content, author, publishedDate, categories, likes, likedBy, createdAt } = advice
  return {
    id: _id,
    title,
    content,
    author,
    publishedDate,
    categories,
    likes,
    likedBy,
    createdAt
  }
}

/**
 * Generic validation function that works with any Valibot schema
 * @param schema The Valibot schema to validate against
 * @param data The data to validate
 * @returns A SafeParseResult containing either the validated data or validation errors
 */
export function validateSchema<T extends BaseSchema<any, any, any>>(schema: T, data: unknown): SafeParseResult<T> {
  return safeParse(schema, data);
}

/**
 * Validates if a string is a valid MongoDB ObjectId
 * Returns an error response if invalid
 * 
 * @param id The ID to validate
 * @param res The Express response object
 * @returns boolean indicating if execution should continue
 */
export const validateObjectId = (id: string, res: Response): boolean => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ 
      success: false, 
      error: 'Invalid ID format. Must be a valid MongoDB ObjectId' 
    })
    return false
  }
  return true
}

/**
 * Handles validation errors from Valibot schema validation
 * Sends appropriate error response
 * 
 * @param result The validation result from validateSchema
 * @param res The Express response object
 * @returns boolean indicating if validation passed (true) or failed (false)
 */
export const handleValidationError = <T extends ObjectSchema<any, any>>(
  result: SafeParseResult<T>,
  res: Response
): boolean => {
  if (!result.success) {
    res.status(400).json({
      success: false,
      error: 'Validation error',
      details: {
        message: result.issues[0].message,
        expected: result.issues[0].expected,
        received: result.issues[0].received,
      }
    })
    return false
  }
  return true
}
