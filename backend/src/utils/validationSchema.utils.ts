import { BaseSchema, SafeParseResult, safeParse } from 'valibot';

/**
 * Generic validation function that works with any Valibot schema
 * @param schema The Valibot schema to validate against
 * @param data The data to validate
 * @returns A SafeParseResult containing either the validated data or validation errors
 */
export function validateSchema<T extends BaseSchema<any, any, any>>(schema: T, data: unknown): SafeParseResult<T> {
  return safeParse(schema, data);
}