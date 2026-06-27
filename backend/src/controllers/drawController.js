import prisma from '../config/database.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const drawController = {
  /**
   * POST /api/draws
   * Creates an upcoming draw.
   */
  async createUpcoming(req, res, next) {
    try {
      const { title, prizePool, date } = req.body;
      const draw = await prisma.draw.create({
        data: {
          title: title || 'Monthly Draw',
          totalPrizePool: Number(prizePool) || 1000.0,
          date: date ? new Date(date) : new Date(),
          status: 'UPCOMING',
          winningNumbers: [],
        },
      });
      return successResponse(res, { draw }, 'Upcoming draw created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/draws/:id/run
   * Generates winning numbers, finds winners, and updates draw status.
   */
  async runDraw(req, res, next) {
    try {
      const { id } = req.params;
      const draw = await prisma.draw.findUnique({ where: { id } });

      if (!draw) {
        return errorResponse(res, 'Draw not found', 404);
      }
      if (draw.status === 'COMPLETED') {
        return errorResponse(res, 'Draw is already completed', 400);
      }

      // 1. Generate 5 unique random winning numbers between 1 and 45 (Stableford Range)
      const winningNumbersSet = new Set();
      while (winningNumbersSet.size < 5) {
        winningNumbersSet.add(Math.floor(Math.random() * 45) + 1);
      }
      const winningNumbers = Array.from(winningNumbersSet);

      // 2. Fetch all users
      const users = await prisma.user.findMany({ select: { id: true } });
      const winnersData = [];

      // 3. For each user, find their latest 5 scores
      for (const user of users) {
        const latestScores = await prisma.score.findMany({
          where: { userId: user.id },
          orderBy: { date: 'desc' },
          take: 5,
        });

        if (latestScores.length > 0) {
          let matches = 0;
          for (const scoreRecord of latestScores) {
            if (winningNumbers.includes(scoreRecord.score)) matches++;
          }
          if (matches >= 3) {
            winnersData.push({ userId: user.id, matchType: matches });
          }
        }
      }

      // 4. Calculate prize distribution
      const prizePool = draw.totalPrizePool;
      const match5Pool = prizePool * 0.40;
      const match4Pool = prizePool * 0.35;
      const match3Pool = prizePool * 0.25;

      const match5Winners = winnersData.filter(w => w.matchType === 5);
      const match4Winners = winnersData.filter(w => w.matchType === 4);
      const match3Winners = winnersData.filter(w => w.matchType === 3);

      const match5Prize = match5Winners.length > 0 ? match5Pool / match5Winners.length : 0;
      const match4Prize = match4Winners.length > 0 ? match4Pool / match4Winners.length : 0;
      const match3Prize = match3Winners.length > 0 ? match3Pool / match3Winners.length : 0;

      for (const winner of winnersData) {
        if (winner.matchType === 5) winner.prizeAmount = match5Prize;
        else if (winner.matchType === 4) winner.prizeAmount = match4Prize;
        else if (winner.matchType === 3) winner.prizeAmount = match3Prize;
      }

      // 5. Save Updates
      const updatedDraw = await prisma.$transaction(async (tx) => {
        const d = await tx.draw.update({
          where: { id: draw.id },
          data: {
            winningNumbers,
            status: 'COMPLETED',
          },
        });

        if (winnersData.length > 0) {
          await tx.drawWinner.createMany({
            data: winnersData.map(w => ({
              drawId: draw.id,
              userId: w.userId,
              matchType: w.matchType,
              prizeAmount: w.prizeAmount,
            })),
          });
        }

        return tx.draw.findUnique({
          where: { id: draw.id },
          include: { winners: true },
        });
      });

      return successResponse(res, { draw: updatedDraw }, 'Draw executed successfully');
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/draws/upcoming
   */
  async getUpcoming(req, res, next) {
    try {
      const draws = await prisma.draw.findMany({
        where: { status: 'UPCOMING' },
        orderBy: { date: 'asc' },
      });
      return successResponse(res, { draws });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/draws/history
   */
  async getHistory(req, res, next) {
    try {
      const draws = await prisma.draw.findMany({
        where: { status: 'COMPLETED' },
        orderBy: { createdAt: 'desc' },
        include: {
          winners: {
            include: { user: { select: { name: true, email: true } } },
          },
        },
      });
      return successResponse(res, { draws });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/draws/my-winnings
   */
  async getMyWinnings(req, res, next) {
    try {
      const winnings = await prisma.drawWinner.findMany({
        where: { userId: req.user.id },
        include: { draw: true },
        orderBy: { createdAt: 'desc' },
      });
      return successResponse(res, { winnings });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/draws/winners/:id/proof
   */
  async uploadProof(req, res, next) {
    try {
      const { id } = req.params;
      
      if (!req.file) {
        return errorResponse(res, 'Proof image is required', 400);
      }

      const winner = await prisma.drawWinner.findUnique({ where: { id } });
      if (!winner || winner.userId !== req.user.id) {
        return errorResponse(res, 'Winning record not found', 404);
      }

      const updatedWinner = await prisma.drawWinner.update({
        where: { id },
        data: {
          proofImage: `/uploads/${req.file.filename}`,
        },
      });

      return successResponse(res, { winner: updatedWinner }, 'Proof uploaded successfully');
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/draws/winners/pending
   */
  async getPendingVerifications(req, res, next) {
    try {
      const pendingWinners = await prisma.drawWinner.findMany({
        where: { 
          proofImage: { not: null },
          status: { notIn: ['PAID', 'REJECTED'] }
        },
        include: {
          user: { select: { name: true, email: true } },
          draw: { select: { date: true, winningNumbers: true } },
        },
        orderBy: { updatedAt: 'asc' },
      });
      return successResponse(res, { pendingWinners });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/draws/winners/:id/status
   */
  async updateWinnerStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body; // APPROVED, REJECTED, PAID

      if (!['APPROVED', 'REJECTED', 'PAID'].includes(status)) {
        return errorResponse(res, 'Invalid status', 400);
      }

      const winner = await prisma.drawWinner.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!winner) {
        return errorResponse(res, 'Winner not found', 404);
      }

      const updatedWinner = await prisma.drawWinner.update({
        where: { id },
        data: { status },
        include: { user: { select: { name: true, email: true } } },
      });

      // If status changed to PAID and the user has a charity, allocate funds
      if (status === 'PAID' && winner.status !== 'PAID' && winner.user.selectedCharityId) {
        const donationAmount = winner.prizeAmount * (winner.user.donationPercentage / 100);
        await prisma.charity.update({
          where: { id: winner.user.selectedCharityId },
          data: { donationTotal: { increment: donationAmount } }
        });
      }

      return successResponse(res, { winner: updatedWinner }, 'Status updated successfully');
    } catch (error) {
      next(error);
    }
  },
};

export default drawController;
