import mongoose from 'mongoose'
import { UserValidationObjectSchema } from '../schemas/user.schema'
import { createValidationMiddleware } from '../middlewares/validation.middleware'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, trim: true },
  advices: { type: mongoose.Schema.Types.ObjectId, ref: 'Advice' }
}, { timestamps: true });

userSchema.pre('save', createValidationMiddleware(
  UserValidationObjectSchema,
  ['username', 'email', 'password']
));

const UserModel = mongoose.model('User', userSchema);

export default UserModel
