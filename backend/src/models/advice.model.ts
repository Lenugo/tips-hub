import mongoose from 'mongoose'
import { AdviceValidationObjectSchema } from '../schemas/advice.schema'
import { createValidationMiddleware } from '../middlewares/validation.middleware'

const adviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  publishedDate: { type: Date, default: Date.now },
  category: { type: [String], default: [], required: true },
  likes: { type: Number, default: 0 },
}, { timestamps: true })

/** Add validation middleware */
adviceSchema.pre('save', createValidationMiddleware(
  AdviceValidationObjectSchema,
  ['title', 'content', 'author', 'category', 'likes']
));

const AdviceModel = mongoose.model('Advice', adviceSchema)

export default AdviceModel
