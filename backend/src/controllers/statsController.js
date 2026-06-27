import prisma from '../config/database.js';

export const getPublicStats = async (req, res, next) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalCharities = await prisma.charity.count();
    
    // Count all draw winners (APPROVED or PAID or PENDING)
    const winnersCount = await prisma.drawWinner.count();
    
    // Sum of donations from all charities
    const charities = await prisma.charity.findMany({
      select: { donationTotal: true }
    });
    const totalDonations = charities.reduce((sum, c) => sum + c.donationTotal, 0);

    // Make sure we have a base/realistic number if it's empty
    res.json({
      success: true,
      data: {
        activePlayers: totalUsers || 0,
        totalCharities: totalCharities || 0,
        winners: winnersCount || 0,
        totalDonations: totalDonations || 0
      }
    });
  } catch (error) {
    next(error);
  }
};
