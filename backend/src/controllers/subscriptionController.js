import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const checkoutSchema = z.object({
  plan: z.enum(['MONTHLY', 'YEARLY']),
});

export const getCurrentSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Find the latest active or cancelled subscription
    const subscription = await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    res.json({
      success: true,
      data: subscription || { status: 'INACTIVE' },
    });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    res.json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

export const mockCheckout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { plan } = checkoutSchema.parse(req.body);
    
    // Mocking a Stripe success response
    const mockStripeSubscriptionId = `sub_mock_${Math.random().toString(36).substring(2, 15)}`;
    const mockStripeCustomerId = `cus_mock_${Math.random().toString(36).substring(2, 15)}`;
    
    const startDate = new Date();
    const endDate = new Date();
    if (plan === 'MONTHLY') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    // Deactivate previous active subscriptions
    await prisma.subscription.updateMany({
      where: { userId, status: 'ACTIVE' },
      data: { status: 'INACTIVE' },
    });
    
    // Create new active subscription
    const newSubscription = await prisma.subscription.create({
      data: {
        userId,
        plan,
        status: 'ACTIVE',
        startDate,
        endDate,
        stripeCustomerId: mockStripeCustomerId,
        stripeSubscriptionId: mockStripeSubscriptionId,
      }
    });
    
    res.json({
      success: true,
      data: newSubscription,
      message: 'Payment successful and subscription activated.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    next(error);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const activeSub = await prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });
    
    if (!activeSub) {
      return res.status(400).json({ success: false, message: 'No active subscription found.' });
    }
    
    const cancelledSub = await prisma.subscription.update({
      where: { id: activeSub.id },
      data: { status: 'CANCELLED' },
    });
    
    res.json({
      success: true,
      data: cancelledSub,
      message: 'Subscription cancelled successfully.',
    });
  } catch (error) {
    next(error);
  }
};
