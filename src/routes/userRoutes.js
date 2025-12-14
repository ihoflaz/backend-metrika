import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/me').get(protect, getUserProfile).patch(protect, updateUserProfile);
// Implement other user routes (GET /:id, etc.) here later

export default router;
