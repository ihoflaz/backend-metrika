import express from 'express';
import {
    getGamificationProfile,
    getLeaderboard,
    getBadges
} from '../controllers/gamificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getGamificationProfile);
router.get('/leaderboard', protect, getLeaderboard);
router.get('/badges', protect, getBadges);

export default router;
