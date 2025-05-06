import mongoose from 'mongoose';
import { BaseSchema, parse } from 'valibot';

/**
 * Creates a Mongoose pre-save middleware that validates a document against a Valibot schema
 * @param schema The Valibot schema to validate against
 * @param fieldsToValidate Optional array of field names to extract from the document
 * @returns A pre-save middleware function
 */
export const createValidationMiddleware = <T extends BaseSchema<any, any, any>>(
  schema: T,
  fieldsToValidate?: string[]
) => {
  return function(this: mongoose.Document, next: mongoose.CallbackWithoutResultAndOptionalError) {
    try {
      // If specific fields are provided, extract only those fields
      if (fieldsToValidate && fieldsToValidate.length > 0) {
        const dataToValidate = fieldsToValidate.reduce((obj, field) => {
          obj[field] = this.get(field);
          return obj;
        }, {} as Record<string, any>);
        
        parse(schema, dataToValidate);
      } else {
        // Otherwise validate all fields in the document
        const documentData = this.toObject();
        parse(schema, documentData);
      }
      
      next();
    } catch (error) {
      next(error as mongoose.CallbackError);
    }
  };
};