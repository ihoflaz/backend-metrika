import express from 'express';
import {
    getGamificationProfile,
    getLeaderboard,
    getBadges,
    getAchievements,
    getAchievementById,
    getStreak,
    getRecentActivities,
    getSkills,
    unlockAchievement,
} from '../controllers/gamificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getGamificationProfile);
router.get('/leaderboard', protect, getLeaderboard);
router.get('/badges', protect, getBadges);
router.get('/achievements', protect, getAchievements);
router.get('/achievements/:id', protect, getAchievementById);
router.post('/achievements/:id/unlock', protect, unlockAchievement);
router.get('/streak', protect, getStreak);
router.get('/recent-activities', protect, getRecentActivities);
router.get('/skills', protect, getSkills);

export default router;
