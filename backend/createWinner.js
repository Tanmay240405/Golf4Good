import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    // Find the user 'Tanmay'
    const user = await prisma.user.findFirst({
      where: {
        name: {
          contains: 'Tanmay'
        }
      }
    });

    if (!user) {
      console.log('User Tanmay not found');
      return;
    }

    // Make sure the user is PRO so they can see the Draws page
    try {
      const existingSub = await prisma.subscription.findFirst({ where: { userId: user.id } });
      if (existingSub) {
        await prisma.subscription.update({ where: { id: existingSub.id }, data: { status: 'ACTIVE' } });
      } else {
        await prisma.subscription.create({ data: { userId: user.id, plan: 'MONTHLY', status: 'ACTIVE' } });
      }
    } catch(e) {
      console.log('Subscription step failed, might already exist', e);
    }

    // Create a completed draw with winning numbers that match the user's scores
    const draw = await prisma.draw.create({
      data: {
        title: 'Special Mega Draw - June 2026',
        status: 'COMPLETED',
        totalPrizePool: 5000,
        winningNumbers: [30, 24, 11, 42, 18], // 3 matches: 30, 24, 11
        date: new Date(),
      }
    });

    // Create the winner entry for the user
    await prisma.drawWinner.create({
      data: {
        userId: user.id,
        drawId: draw.id,
        matchType: 3, // They matched 3 numbers
        prizeAmount: 1250, // They get a portion of the prize pool
        status: 'PENDING'
      }
    });

    console.log('Successfully created draw and winner entry for Tanmay!');
    console.log(`Draw ID: ${draw.id}`);
  } catch (error) {
    console.error('Error creating draw:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
