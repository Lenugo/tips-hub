import { Request, Response } from 'express'
import Advice from '../models/advice.model'
import {
  AdviceValidationObjectSchema,
  AdviceType,
  AdviceUpdateValidationSchema,
  AdviceUpdateType
} from '../schemas/advice.schema'
import {
  validateObjectId,
  handleValidationError,
  transformAdviceData,
  validateSchema
} from '../utils/validation.utils'
import { 
  buildQueryObject, 
  buildSortOptions, 
  initializeQueryBuilder, 
  parsePaginationParams, 
  applyPagination, 
  prepareResponse,
  extractQueryParams,
  validateQueryParams
} from '../utils/advice.utils'

export const getAllAdvices = async (req: Request, res: Response): Promise<void> => {
  try {
    
    if (!validateQueryParams(req, res)) {
      return // If validation fails, response is already sent
    }
    
    // Extract query parameters
    const { category, page, limit, sortBy, order } = extractQueryParams(req)
    
    // Build query and sort objects
    const query = buildQueryObject(category)
    const sortOptions = buildSortOptions(sortBy, order)

    // Initialize query builder
    let queryBuilder = initializeQueryBuilder(Advice, query, sortOptions)
    
    // Parse pagination parameters
    const { pageNum, limitNum } = parsePaginationParams(page, limit)
    
    // Apply pagination if needed
    const { queryBuilder: paginatedQueryBuilder, paginationData } = 
      await applyPagination(Advice, query, queryBuilder, pageNum, limitNum)
    
    // Execute the query
    const advices = await paginatedQueryBuilder

    if (!advices || advices.length === 0) {
      res.status(404).json({ 
        success: false, 
        error: 'No advices found matching the criteria' 
      })
      return
    }

    const dataToSend = advices.map(transformAdviceData)
    
    const response = prepareResponse(dataToSend, paginationData)
    
    res.status(200).json(response)
  } catch (error) {
    console.error('Get all advices error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'An error occurred while fetching advices' 
    })
  }
}

export const getAllAdvicesByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const advices = await Advice.find({ author: req.user?.id }).populate('author', 'username email')
    if (!advices) {
      res.status(404).json({ success: false, error: 'Advices not found' })
      return
    }
  
    const dataToSend = advices.map(transformAdviceData)
    res.status(200).json({ success: true, data: dataToSend })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' })
  }
}

export const createAdvice = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = validateSchema(AdviceValidationObjectSchema, req.body)

    if (!handleValidationError(result, res)) return
    
    const adviceData: AdviceType = result.output as AdviceType
    const newAdvice = new Advice({ ...adviceData, author: req.user?.id })

    await newAdvice.save()

    const dataToSend = transformAdviceData(newAdvice)
    res.status(201).json({ success: true, data: dataToSend })
  } catch (error) {
    console.error('Create advice error:', error)
    res.status(500).json({ success: false, error: 'Server Error' })
  }
}

export const getAdviceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    
    if (!validateObjectId(id, res)) return
    
    const advice = await Advice.findById(id)
    if (!advice) {
      res.status(404).json({ success: false, error: 'Advice not found' })
      return
    }

    const dataToSend = transformAdviceData(advice)
    res.status(200).json({ success: true, data: dataToSend })
  } catch (error) {
    console.error('Get advice by ID error:', error)
    res.status(500).json({ success: false, error: 'Server Error' })
  }
}

export const updateAdvice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    
    if (!validateObjectId(id, res)) return

    const existingAdvice = await Advice.findById(id)
    if (!existingAdvice) {
      res.status(404).json({ success: false, error: 'Advice not found' })
      return
    }

    const result = validateSchema(AdviceUpdateValidationSchema, req.body)

    if (!handleValidationError(result, res)) return

    const updateData: AdviceUpdateType = result.output as AdviceUpdateType
    
    const updatedAdvice = await Advice.findByIdAndUpdate(
      id, 
      { $set: updateData },  // Using $set to only update provided fields
      { 
        new: true,          // Return the updated document
        runValidators: true  // Run mongoose validators
      }
    )

    const dataToSend = updatedAdvice ? transformAdviceData(updatedAdvice) : []
    res.status(200).json({ success: true, data: dataToSend })
  } catch (error) {
    console.error('Update advice error:', error)
    res.status(500).json({ success: false, error: 'Server Error' })
  }
}

export const deleteAdvice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    
    if (!validateObjectId(id, res)) return
    
    const deletedAdvice = await Advice.findByIdAndDelete(id)
    if (!deletedAdvice) {
      res.status(404).json({ success: false, error: 'Advice not found' })
      return
    }

    res.status(200).json({ success: true, data: { message: 'Advice deleted'} })  
  } catch (error) {
    console.error('Delete advice error:', error)
    res.status(500).json({ success: false, error: 'Server Error' })
  }
}

export const incrementLikes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    // Check if user is authenticated
    if (!userId) {
      res.status(401).json({ success: false, error: 'Authentication required to like advice' })
      return
    }

    if (!validateObjectId(id, res)) return

    // First check if the advice exists
    const advice = await Advice.findById(id)
    if (!advice) {
      res.status(404).json({ success: false, error: 'Advice not found' })
      return
    }

    // Check if user has already liked this advice
    // Make sure likedBy exists in your Advice model schema
    if (advice.likedBy && advice.likedBy.some(id => id.equals(userId))) {
      res.status(400).json({ 
        success: false, 
        error: 'You have already liked this advice' 
      })
      return
    }

    // Use findOneAndUpdate with conditions to ensure atomicity
    const updatedAdvice = await Advice.findOneAndUpdate(
      { 
        _id: id,
        // This ensures the user hasn't liked it yet (race condition protection)
        likedBy: { $ne: userId } 
      },
      { 
        $inc: { likes: 1 },
        $addToSet: { likedBy: userId } // $addToSet prevents duplicates
      },
      { 
        new: true,
        runValidators: true
      }
    )

    // If no document was updated, it means the user already liked it
    // (handles race conditions)
    if (!updatedAdvice) {
      res.status(400).json({ 
        success: false, 
        error: 'You have already liked this advice' 
      })
      return
    }

    const dataToSend = transformAdviceData(updatedAdvice)
    res.status(200).json({ success: true, data: dataToSend })
  } catch (error) {
    console.error('Increment likes error:', error)
    res.status(500).json({ success: false, error: 'Server Error' })
  }
}
