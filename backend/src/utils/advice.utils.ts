import { Request, Response } from 'express'
import mongoose from 'mongoose'

/**
 * Validates query parameters for advice requests
 * @param req The Express request object
 * @param res The Express response object
 * @returns Boolean indicating if validation passed
 */
export const validateQueryParams = (req: Request, res: Response): boolean => {
  const { page, limit, categories, sortBy, order } = req.query
  const errors: string[] = []

  // Validate page parameter if provided
  if (page !== undefined) {
    const pageNum = Number(page)
    if (isNaN(pageNum) || pageNum <= 0 || !Number.isInteger(pageNum)) {
      errors.push('page must be a positive integer')
    }
  }

  // Validate limit parameter if provided
  if (limit !== undefined) {
    const limitNum = Number(limit)
    if (isNaN(limitNum) || limitNum <= 0 || !Number.isInteger(limitNum)) {
      errors.push('limit must be a positive integer')
    }
  }

  // Validate sortBy parameter if provided
  if (sortBy !== undefined && sortBy !== 'createdAt' && sortBy !== 'likes' && sortBy !== 'title') {
    errors.push('sortBy must be one of: createdAt, likes, title')
  }

  // Validate order parameter if provided
  if (order !== undefined && order !== 'asc' && order !== 'desc') {
    errors.push('order must be either asc or desc')
  }

  /**
   * @dev Validate categories parameter if provided
   * @dev This assumes you have a list of valid categories
   * @dev You might want to fetch this from your database or config
   */
  const validCategories = ['career', 'relationships', 'health', 'finance', 'personal-growth', 'productivity', 'education']
  if (categories !== undefined) {
    if (Array.isArray(categories)) {
      for (const cat of categories) {
        if (!validCategories.includes(cat as string)) {
          errors.push(`Invalid categories: ${cat}. Valid categories are: ${validCategories.join(', ')}`)
        }
      }
    } else if (!validCategories.includes(categories as string)) {
      errors.push(`Invalid categories: ${categories}. Valid categories are: ${validCategories.join(', ')}`)
    }
  }

  /**
   * Check for unknown query parameters
   */
  const allowedParams = ['page', 'limit', 'categories', 'sortBy', 'order']
  Object.keys(req.query).forEach(param => {
    if (!allowedParams.includes(param)) {
      errors.push(`Unknown query parameter: ${param}. Allowed parameters are: ${allowedParams.join(', ')}`)
    }
  })

  // If there are validation errors, send a 400 response
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: 'Invalid query parameters',
      details: errors
    })
    return false
  }

  return true
}

/**
 * Builds a query object based on category parameter
 * @param categories The categories to filter by
 * @returns A query object for MongoDB
 */
export const buildQueryObject = (categories: any): any => {
  const query: any = {}
  if (categories) {
    query.categories = Array.isArray(categories) ? { $in: categories } : categories
  }
  return query
}

/**
 * Builds a sort options object for MongoDB queries
 * @param sortBy The field to sort by
 * @param order The sort order ('asc' or 'desc')
 * @returns A sort options object for MongoDB
 */
export const buildSortOptions = (sortBy: any = 'createdAt', order: any = 'desc'): any => {
  const sortOptions: any = {}
  sortOptions[sortBy as string] = order === 'desc' ? -1 : 1
  return sortOptions
}

/**
 * Initializes a MongoDB query builder with common options
 * @param model The Mongoose model to query
 * @param query The query object
 * @param sortOptions The sort options
 * @returns A query builder
 */
export const initializeQueryBuilder = (
  model: mongoose.Model<any>,
  query: any,
  sortOptions: any
): mongoose.Query<any, any> => {
  return model.find(query)
    .populate('author', 'username email')
    .sort(sortOptions)
    .lean()
}

/**
 * Parses pagination parameters from request query
 * @param page The page parameter from request query
 * @param limit The limit parameter from request query
 * @returns An object with parsed page and limit numbers
 */
export const parsePaginationParams = (page: any, limit: any): { pageNum: number | null, limitNum: number | null } => {
  const pageNum = page ? parseInt(page as string, 10) : null
  const limitNum = limit ? parseInt(limit as string, 10) : null
  return { pageNum, limitNum }
}

/**
 * Applies pagination to a query and prepares pagination data
 * @param model The Mongoose model
 * @param query The query object
 * @param queryBuilder The query builder
 * @param pageNum The page number
 * @param limitNum The limit number
 * @returns An object with updated query builder and pagination data
 */
export const applyPagination = async (
  model: mongoose.Model<any>,
  query: any,
  queryBuilder: mongoose.Query<any, any>,
  pageNum: number | null,
  limitNum: number | null
): Promise<{ queryBuilder: mongoose.Query<any, any>, paginationData: any | null }> => {
  let paginationData = null
  
  if (pageNum !== null && !isNaN(pageNum) && limitNum !== null && !isNaN(limitNum)) {
    // Get total count for pagination
    const total = await model.countDocuments(query)
    
    // Calculate skip value for pagination
    const validPageNum = pageNum > 0 ? pageNum : 1
    const validLimitNum = limitNum > 0 ? limitNum : 10
    const skip = (validPageNum - 1) * validLimitNum
    
    // Apply pagination to query
    queryBuilder = queryBuilder.skip(skip).limit(validLimitNum)
    
    // Prepare pagination data for response
    paginationData = {
      total,
      page: validPageNum,
      limit: validLimitNum,
      pages: Math.ceil(total / validLimitNum)
    }
  }
  
  return { queryBuilder, paginationData }
}

/**
 * Prepares the response object with data and optional pagination
 * @param dataToSend The data to send in the response
 * @param paginationData Optional pagination data
 * @returns A response object
 */
export const prepareResponse = (dataToSend: any[], paginationData: any | null): any => {
  const response: any = { 
    success: true, 
    data: dataToSend
  }
  
  if (paginationData) {
    response.pagination = paginationData
  }
  
  return response
}

/**
 * Extracts query parameters from request
 * @param req The Express request object
 * @returns An object with extracted query parameters
 */
export const extractQueryParams = (req: Request): { 
  categories: any, 
  page: any, 
  limit: any, 
  sortBy: any, 
  order: any 
} => {
  const { categories, page, limit, sortBy = 'createdAt', order = 'desc' } = req.query
  return { categories, page, limit, sortBy, order }
}