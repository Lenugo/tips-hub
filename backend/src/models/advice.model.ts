import mongoose from "mongoose"
import { object, string, date, minLength, maxLength, optional, InferOutput, parse, pipe, number } from "valibot"

// Define the Valibot schema for validation
const AdviceValidationSchema = object({
  title: pipe(string(), minLength(3, "Title must be at least 3 characters"), maxLength(30, "Title cannot exceed 30 characters")),
  content: pipe(string(), minLength(20, "Content must be at least 20 characters")),
  author: pipe(string(), minLength(2, "Author name must be at least 2 characters")),
  publishedDate: date("Invalid date format"),
  category: pipe(string(), minLength(2, "Category must be at least 2 characters")),
  tags: optional(string()),
  likes: optional(number()),
})

// Define the TypeScript type from the Valibot schema
export type AdviceType = InferOutput<typeof AdviceValidationSchema>

// Define the Mongoose schema
const adviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  publishedDate: { type: Date, required: true },
  category: { type: String, required: true },
  tags: { type: [String], default: [] },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Add pre-save middleware to validate with Valibot
adviceSchema.pre('save', function(next) {
  try {
    // Exclude createdAt and updatedAt from validation
    const { title, content, author, publishedDate, category, tags, likes } = this.toObject();
    parse(AdviceValidationSchema, { title, content, author, publishedDate, category, tags, likes });
    next();
  } catch (error) {
    next(error as mongoose.CallbackError);
  }
});

const Advice = mongoose.model("Advice", adviceSchema)

export default Advice
