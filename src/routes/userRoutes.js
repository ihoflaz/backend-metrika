import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/authController.js';
import {
    getUserById,
    getUserStats,
    getUserTasks,
    getUserProjects,
    getUserBadges,
    getUserSkills,
    getUserActivity,
    praiseUser,
    assignTaskToUser,
} from '../controllers/teamController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Current user routes
router.route('/me').get(protect, getUserProfile).patch(protect, updateUserProfile);

// User profile routes by ID
router.get('/:id', protect, getUserById);
router.get('/:id/stats', protect, getUserStats);
router.get('/:id/tasks', protect, getUserTasks);
router.get('/:id/projects', protect, getUserProjects);
router.get('/:id/badges', protect, getUserBadges);
router.get('/:id/skills', protect, getUserSkills);
router.get('/:id/activity', protect, getUserActivity);
router.post('/:id/praise', protect, praiseUser);
router.post('/:id/assign-task', protect, assignTaskToUser);

export default router;
