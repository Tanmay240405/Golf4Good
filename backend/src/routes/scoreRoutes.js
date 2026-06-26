import express from 'express';
import { getScores, addScore, updateScore, deleteScore } from '../controllers/scoreController.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate); // All score routes are protected

router.route('/')
  .get(getScores)
  .post(addScore);

router.route('/:id')
  .put(updateScore)
  .delete(deleteScore);

export default router;
