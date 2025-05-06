import { Request, Response } from "express"
import Advice from "../models/advice.model"

export const getAllAdvices = async (req: Request, res: Response): Promise<void> => {
  try {
    const advices = await Advice.find()
    if (!advices.length) {
      res.status(204).json({ success: true, data: []})
    }

    res.status(200).json({ success: true, data: advices })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' })
  }
}


