import { errorResponse } from '../utils/apiResponse.js';

/**
 * Global error handler middleware
 */
export default function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${err.message}`);

  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Prisma known errors
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    return errorResponse(res, `A record with this ${field} already exists.`, 409);
  }

  if (err.code === 'P2025') {
    return errorResponse(res, 'Record not found.', 404);
  }

  // Default
  return errorResponse(
    res,
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
    err.statusCode || 500
  );
}
