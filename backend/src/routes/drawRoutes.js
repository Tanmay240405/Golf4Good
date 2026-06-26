import express from 'express';
import multer from 'multer';
import path from 'path';
import authenticate from '../middleware/auth.js';
import adminOnly from '../middleware/adminMiddleware.js';
import drawController from '../controllers/drawController.js';

const router = express.Router();

// Setup Multer for proof uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Admin Routes
router.post('/', authenticate, adminOnly, drawController.createUpcoming);
router.post('/:id/run', authenticate, adminOnly, drawController.runDraw);
router.get('/winners/pending', authenticate, adminOnly, drawController.getPendingVerifications);
router.put('/winners/:id/status', authenticate, adminOnly, drawController.updateWinnerStatus);

// User Routes
router.get('/upcoming', authenticate, drawController.getUpcoming);
router.get('/history', authenticate, drawController.getHistory);
router.get('/my-winnings', authenticate, drawController.getMyWinnings);
router.post('/winners/:id/proof', authenticate, upload.single('proofImage'), drawController.uploadProof);

export default router;
