import authService from '../services/authService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const authController = {
  /**
   * POST /api/auth/signup
   */
  async signup(req, res, next) {
    try {
      const { name, email, password } = req.validatedBody;
      const result = await authService.signup({ name, email, password });
      return successResponse(res, result, 'Account created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password, remember } = req.validatedBody;
      const result = await authService.login({ email, password, remember });
      return successResponse(res, result, 'Logged in successfully');
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.validatedBody;
      const result = await authService.forgotPassword({ email });
      return successResponse(res, null, result.message);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/auth/me
   */
  async getMe(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      return successResponse(res, { user });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/auth/me
   */
  async updateMe(req, res, next) {
    try {
      const user = await authService.updateProfile(req.user.id, req.validatedBody);
      return successResponse(res, { user }, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
