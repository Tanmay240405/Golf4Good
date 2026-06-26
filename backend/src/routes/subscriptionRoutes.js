import express from 'express';
import { 
  getCurrentSubscription, 
  getSubscriptionHistory, 
  mockCheckout, 
  cancelSubscription 
} from '../controllers/subscriptionController.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/current', getCurrentSubscription);
router.get('/history', getSubscriptionHistory);
router.post('/checkout', mockCheckout);
router.post('/cancel', cancelSubscription);

export default router;
