import prisma from '../config/database.js';
import { z } from 'zod';

const scoreSchema = z.object({
  score: z.number().int().min(1).max(45),
  date: z.string().datetime({ message: "Invalid datetime string" }),
  course: z.string().min(1, 'Course name is required'),
  entries: z.number().int().min(0, 'Entries cannot be negative')
});

// @desc    Get user scores
// @route   GET /api/scores
// @access  Private
export const getScores = async (req, res, next) => {
  try {
    const scores = await prisma.score.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' },
      take: 5
    });
    res.json(scores);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a score
// @route   POST /api/scores
// @access  Private
export const addScore = async (req, res, next) => {
  try {
    const { score, date, course, entries } = scoreSchema.parse(req.body);
    
    // Check if score for this date exists
    const inputDate = new Date(date);
    // Setting to midnight to compare just dates if needed, 
    // but the requirement is "only one score per date", so exact date string/time might need truncating.
    // Assuming the frontend passes a YYYY-MM-DDT00:00:00.000Z
    
    const existing = await prisma.score.findFirst({
      where: {
        userId: req.user.id,
        date: inputDate
      }
    });

    if (existing) {
      return res.status(400).json({ message: 'A score for this date already exists.' });
    }

    // Check count for max 5 limit
    const count = await prisma.score.count({
      where: { userId: req.user.id }
    });

    if (count >= 5) {
      // Find oldest score
      const oldest = await prisma.score.findFirst({
        where: { userId: req.user.id },
        orderBy: { date: 'asc' }
      });
      if (oldest) {
        await prisma.score.delete({
          where: { id: oldest.id }
        });
      }
    }

    // Create new score
    const newScore = await prisma.score.create({
      data: {
        score,
        course,
        entries,
        date: inputDate,
        userId: req.user.id
      }
    });

    res.status(201).json(newScore);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    next(error);
  }
};

// @desc    Update a score
// @route   PUT /api/scores/:id
// @access  Private
export const updateScore = async (req, res, next) => {
  try {
    const { score, date, course, entries } = scoreSchema.parse(req.body);
    const inputDate = new Date(date);

    // Check ownership
    const existing = await prisma.score.findUnique({
      where: { id: req.params.id }
    });

    if (!existing || existing.userId !== req.user.id) {
      return res.status(404).json({ message: 'Score not found' });
    }

    // Check date uniqueness if date is changed
    if (existing.date.getTime() !== inputDate.getTime()) {
      const duplicateDate = await prisma.score.findFirst({
        where: {
          userId: req.user.id,
          date: inputDate
        }
      });
      if (duplicateDate) {
        return res.status(400).json({ message: 'A score for this new date already exists.' });
      }
    }

    const updatedScore = await prisma.score.update({
      where: { id: req.params.id },
      data: {
        score,
        course,
        entries,
        date: inputDate
      }
    });

    res.json(updatedScore);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    // Prisma unique constraint error code is P2002
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'A score for this date already exists.' });
    }
    next(error);
  }
};

// @desc    Delete a score
// @route   DELETE /api/scores/:id
// @access  Private
export const deleteScore = async (req, res, next) => {
  try {
    const existing = await prisma.score.findUnique({
      where: { id: req.params.id }
    });

    if (!existing || existing.userId !== req.user.id) {
      return res.status(404).json({ message: 'Score not found' });
    }

    await prisma.score.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Score removed' });
  } catch (error) {
    next(error);
  }
};
