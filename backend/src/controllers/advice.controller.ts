import { Request, Response } from 'express'
import Advice from '../models/advice.model'
import { AdviceValidationObjectSchema, AdviceType, AdviceUpdateValidationSchema, AdviceUpdateType } from '../schemas/advice.schema'
import { validateSchema } from '../utils/validationSchema.utils'
import mongoose from 'mongoose'

export const getAllAdvices = async (req: Request, res: Response): Promise<void> => {
  try {
    const advices = await Advice.find()
    if (!advices) {
      res.status(404).json({ success: false, error: 'Advices not found' })
      return
    }

    res.status(200).json({ success: true, data: advices })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' })
  }
}

export const createAdvice = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = validateSchema(AdviceValidationObjectSchema, req.body)

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
      return
    }
    
    const adviceData: AdviceType = result.output
    
    const newAdvice = new Advice(adviceData)

    await newAdvice.save()
    
    res.status(201).json({ success: true, data: newAdvice })
  } catch (error) {
    console.error('Create advice error:', error)
    res.status(500).json({ success: false, error: 'Server Error' })
  }
}

export const getAdviceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid ID format. Must be a valid MongoDB ObjectId' 
      })
      return
    }
    
    const advice = await Advice.findById(id)
    if (!advice) {
      res.status(404).json({ success: false, error: 'Advice not found' })
      return
    }

    res.status(200).json({ success: true, data: advice })
  } catch (error) {
    console.error('Get advice by ID error:', error)
    res.status(500).json({ success: false, error: 'Server Error' })
  }
}

export const updateAdvice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid ID format. Must be a valid MongoDB ObjectId' 
      })
      return
    }

    const existingAdvice = await Advice.findById(id)
    if (!existingAdvice) {
      res.status(404).json({ success: false, error: 'Advice not found' })
      return
    }

    const result = validateSchema(AdviceUpdateValidationSchema, req.body)

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
      return
    }
    
    const updateData: AdviceUpdateType = result.output
    
    const updatedAdvice = await Advice.findByIdAndUpdate(
      id, 
      { $set: updateData },  // Using $set to only update provided fields
      { 
        new: true,          // Return the updated document
        runValidators: true  // Run mongoose validators
      }
    )

    res.status(200).json({ success: true, data: updatedAdvice })
  } catch (error) {
    console.error('Update advice error:', error)
    res.status(500).json({ success: false, error: 'Server Error' })
  }
}

export const deleteAdvice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid ID format. Must be a valid MongoDB ObjectId' 
      })
      return
    }
    
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
