import { errorResponse } from '../utils/apiResponse.js';

/**
 * Admin only middleware
 * Ensures the authenticated user has the ADMIN role
 */
export default function adminOnly(req, res, next) {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    return errorResponse(res, 'Access denied. Admin privileges required.', 403);
  }
}
