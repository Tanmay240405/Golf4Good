import prisma from '../config/database.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// ==============================
// Dashboard Stats
// ==============================
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await prisma.user.count();
    const activeSubscribers = await prisma.subscription.count({
      where: { status: 'ACTIVE' }
    });
    
    // Monthly revenue: mock calculation or sum from active subscriptions if they had a price.
    // For now, let's just return a placeholder or calculate based on a fixed $10/month plan
    const monthlyRevenue = activeSubscribers * 10; 
    
    // Total Prize Pool (from all draws)
    const draws = await prisma.draw.findMany();
    const prizePool = draws.reduce((sum, draw) => sum + draw.totalPrizePool, 0);

    // Total Donations (from all charities)
    const charities = await prisma.charity.findMany();
    const totalDonations = charities.reduce((sum, charity) => sum + charity.donationTotal, 0);

    // Pending Winners
    const pendingWinners = await prisma.drawWinner.count({
      where: { status: 'PENDING' }
    });

    // 1. The draw that has been completed
    const latestCompletedDraw = await prisma.draw.findFirst({
      where: { status: 'COMPLETED' },
      orderBy: { date: 'desc' },
      include: {
        winners: {
          include: {
            user: {
              select: { name: true }
            }
          }
        }
      }
    });

    // 2. Name of winners if any
    const winners = latestCompletedDraw
      ? latestCompletedDraw.winners.map(w => w.user.name)
      : [];

    // 3. No. of users that have subscribed in the last month (last 30 days)
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    const newSubscribersLastMonth = await prisma.subscription.count({
      where: {
        status: 'ACTIVE',
        createdAt: {
          gte: oneMonthAgo
        }
      }
    });

    return successResponse(res, {
      stats: {
        totalUsers,
        activeSubscribers,
        monthlyRevenue,
        prizePool,
        totalDonations,
        pendingWinners,
        latestCompletedDraw: latestCompletedDraw ? {
          title: latestCompletedDraw.title,
          date: latestCompletedDraw.date,
          winningNumbers: latestCompletedDraw.winningNumbers
        } : null,
        winners,
        newSubscribersLastMonth
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Users Management
// ==============================
export const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        donationPercentage: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    return successResponse(res, { users });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role, donationPercentage } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { name, email, role, donationPercentage },
      select: { id: true, name: true, email: true, role: true }
    });

    return successResponse(res, { user }, 'User updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    return successResponse(res, null, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

// ==============================
// Scores Management
// ==============================
export const getScores = async (req, res, next) => {
  try {
    const scores = await prisma.score.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return successResponse(res, { scores });
  } catch (error) {
    next(error);
  }
};

export const deleteScore = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.score.delete({ where: { id } });
    return successResponse(res, null, 'Score deleted successfully');
  } catch (error) {
    next(error);
  }
};

// ==============================
// Subscriptions Management
// ==============================
export const getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return successResponse(res, { subscriptions });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const subscription = await prisma.subscription.update({
      where: { id },
      data: { status }
    });

    return successResponse(res, { subscription }, 'Subscription updated successfully');
  } catch (error) {
    next(error);
  }
};

// ==============================
// Reports Management
// ==============================
export const getReports = async (req, res, next) => {
  try {
    // Generate basic chart data: Users grouped by month
    const users = await prisma.user.findMany({
      select: { createdAt: true }
    });

    const usersByMonth = users.reduce((acc, user) => {
      const month = user.createdAt.toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.keys(usersByMonth).map(month => ({
      name: month,
      users: usersByMonth[month]
    }));

    return successResponse(res, { chartData });
  } catch (error) {
    next(error);
  }
};
