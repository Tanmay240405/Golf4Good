import crypto from 'crypto';
import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateToken } from '../utils/jwt.js';

const authService = {
  /**
   * Register a new user
   */
  async signup({ name, email, password }) {
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      const error = new Error('An account with this email already exists.');
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        donationPercentage: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = generateToken(user.id);

    return { user: { ...user, totalWinnings: 0 }, token };
  },

  /**
   * Authenticate a user
   */
  async login({ email, password, remember = false }) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    // Compare password
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    // Generate token
    const token = generateToken(user.id, remember);

    // Return user without password and with totalWinnings
    const winnings = await prisma.drawWinner.findMany({
      where: {
        userId: user.id,
        status: { in: ['APPROVED', 'PAID'] }
      },
      select: { prizeAmount: true }
    });
    const totalWinnings = winnings.reduce((sum, w) => sum + w.prizeAmount, 0);
    const { password: _, ...userWithoutPassword } = user;

    return { user: { ...userWithoutPassword, totalWinnings }, token };
  },

  /**
   * Initiate forgot password flow
   */
  async forgotPassword({ email }) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Return success even if user doesn't exist (security best practice)
      return { message: 'If an account with this email exists, you will receive a reset link.' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExp = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExp },
    });

    // TODO: Send email with reset link
    // In production, use a service like Resend, SendGrid, etc.
    console.log(`[DEV] Password reset token for ${email}: ${resetToken}`);

    return { message: 'If an account with this email exists, you will receive a reset link.' };
  },

  /**
   * Get user profile
   */
  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        donationPercentage: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    // Calculate winnings
    const winnings = await prisma.drawWinner.findMany({
      where: {
        userId,
        status: { in: ['APPROVED', 'PAID'] }
      },
      select: { prizeAmount: true }
    });
    const totalWinnings = winnings.reduce((sum, w) => sum + w.prizeAmount, 0);

    return { ...user, totalWinnings };
  },

  /**
   * Update user profile
   */
  async updateProfile(userId, { name, email }) {
    // Check if email is taken by another user
    if (email) {
      const existing = await prisma.user.findFirst({
        where: {
          email: email.toLowerCase(),
          NOT: { id: userId },
        },
      });
      if (existing) {
        const error = new Error('This email is already in use.');
        error.statusCode = 409;
        throw error;
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email: email.toLowerCase() }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        donationPercentage: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Calculate winnings
    const winnings = await prisma.drawWinner.findMany({
      where: {
        userId,
        status: { in: ['APPROVED', 'PAID'] }
      },
      select: { prizeAmount: true }
    });
    const totalWinnings = winnings.reduce((sum, w) => sum + w.prizeAmount, 0);

    return { ...user, totalWinnings };
  },
};

export default authService;
