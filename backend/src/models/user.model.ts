import mongoose from 'mongoose'
import { type UserSchemaType } from '../schemas/user.schema'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, trim: true },
  advices: { type: mongoose.Schema.Types.ObjectId, ref: 'Advice' }
}, { timestamps: true });

// Create and export the model
const UserModel = mongoose.model('User', userSchema);

export default UserModel
