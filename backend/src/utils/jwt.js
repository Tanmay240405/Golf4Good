import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/**
 * Generate a JWT token for a user
 */
export function generateToken(userId, remember = false) {
  return jwt.sign(
    { userId },
    env.JWT_SECRET,
    { expiresIn: remember ? env.JWT_REMEMBER_EXPIRES_IN : env.JWT_EXPIRES_IN }
  );
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}
