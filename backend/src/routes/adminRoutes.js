import express from 'express';
import { 
  getDashboardStats, 
  getUsers, 
  updateUser, 
  deleteUser, 
  getScores, 
  deleteScore, 
  getSubscriptions, 
  updateSubscription, 
  getReports 
} from '../controllers/adminController.js';

import { getCharities, createCharity, updateCharity, deleteCharity } from '../controllers/charityController.js';
import drawController from '../controllers/drawController.js';

import authenticate from '../middleware/auth.js';
import adminOnly from '../middleware/adminMiddleware.js';

const router = express.Router();

// All routes require authentication and ADMIN role
router.use(authenticate, adminOnly);

// Dashboard
router.get('/stats', getDashboardStats);

// Users
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Scores
router.get('/scores', getScores);
router.delete('/scores/:id', deleteScore);

// Subscriptions
router.get('/subscriptions', getSubscriptions);
router.put('/subscriptions/:id', updateSubscription);

// Reports
router.get('/reports', getReports);

// Charities
router.get('/charities', getCharities);
router.post('/charities', createCharity);
router.put('/charities/:id', updateCharity);
router.delete('/charities/:id', deleteCharity);

// Draws and Winners
router.get('/draws', drawController.getHistory); // History of draws
router.get('/draws/upcoming', drawController.getUpcoming);
router.post('/draws', drawController.createUpcoming);
router.post('/draws/:id/run', drawController.runDraw);
router.get('/winners/pending', drawController.getPendingVerifications);
router.put('/winners/:id/status', drawController.updateWinnerStatus);

export default router;
