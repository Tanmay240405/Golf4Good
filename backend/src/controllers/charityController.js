import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schemas for validation
const createCharitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  logo: z.string().url('Invalid logo URL').optional().or(z.literal('')),
  coverImage: z.string().url('Invalid cover image URL').optional().or(z.literal('')),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  upcomingEvents: z.string().optional(),
});

const selectCharitySchema = z.object({
  charityId: z.string().min(1, 'Charity ID is required'),
  donationPercentage: z.number().min(10, 'Minimum percentage is 10').max(100, 'Maximum percentage is 100'),
});

export const getCharities = async (req, res, next) => {
  try {
    const charities = await prisma.charity.findMany({
      orderBy: { name: 'asc' },
    });
    
    res.json({
      success: true,
      data: charities,
    });
  } catch (error) {
    next(error);
  }
};

export const getCharityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const charity = await prisma.charity.findUnique({
      where: { id },
    });
    
    if (!charity) {
      return res.status(404).json({ success: false, message: 'Charity not found' });
    }
    
    res.json({
      success: true,
      data: charity,
    });
  } catch (error) {
    next(error);
  }
};

export const createCharity = async (req, res, next) => {
  try {
    const validatedData = createCharitySchema.parse(req.body);
    
    const charity = await prisma.charity.create({
      data: validatedData,
    });
    
    res.status(201).json({
      success: true,
      data: charity,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    next(error);
  }
};

export const selectCharity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const validatedData = selectCharitySchema.parse(req.body);
    
    // Check if charity exists
    const charity = await prisma.charity.findUnique({
      where: { id: validatedData.charityId }
    });
    
    if (!charity) {
      return res.status(404).json({ success: false, message: 'Charity not found' });
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        selectedCharityId: validatedData.charityId,
        donationPercentage: validatedData.donationPercentage,
      },
      select: {
        id: true,
        name: true,
        email: true,
        selectedCharityId: true,
        donationPercentage: true,
        selectedCharity: true,
      }
    });
    
    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    next(error);
  }
};

export const updateCharity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const charity = await prisma.charity.update({
      where: { id },
      data: updateData
    });
    
    res.json({ success: true, data: charity });
  } catch (error) {
    next(error);
  }
};

export const deleteCharity = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.charity.delete({ where: { id } });
    res.json({ success: true, message: 'Charity deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const unsubscribeCharity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { selectedCharityId: null, donationPercentage: 10 }
    });
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};

