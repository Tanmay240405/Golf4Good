import { errorResponse } from '../utils/apiResponse.js';

/**
 * Zod validation middleware factory
 * Validates req.body against the provided Zod schema
 */
export default function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return errorResponse(res, 'Validation failed', 400, errors);
    }

    req.validatedBody = result.data;
    next();
  };
}
