import prisma from '../config/database.js';
import { z } from 'zod';

const createTestimonialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  content: z.string().min(10, 'Feedback must be at least 10 characters'),
  rating: z.number().min(1).max(5).default(5),
  avatar: z.string().min(1, 'Avatar is required'),
});

export const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (req, res, next) => {
  try {
    const validatedData = createTestimonialSchema.parse(req.body);
    const testimonial = await prisma.testimonial.create({
      data: validatedData,
    });
    res.status(201).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    next(error);
  }
};
