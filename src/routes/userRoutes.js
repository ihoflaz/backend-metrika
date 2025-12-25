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
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

// Current user routes
router.route('/me')
    .get(protect, asyncHandler(getUserProfile))
    .patch(protect, asyncHandler(updateUserProfile));

// User profile routes by ID
router.get('/:id', protect, asyncHandler(getUserById));
router.get('/:id/stats', protect, asyncHandler(getUserStats));
router.get('/:id/tasks', protect, asyncHandler(getUserTasks));
router.get('/:id/projects', protect, asyncHandler(getUserProjects));
router.get('/:id/badges', protect, asyncHandler(getUserBadges));
router.get('/:id/skills', protect, asyncHandler(getUserSkills));
router.get('/:id/activity', protect, asyncHandler(getUserActivity));
router.post('/:id/praise', protect, asyncHandler(praiseUser));
router.post('/:id/assign-task', protect, asyncHandler(assignTaskToUser));

export default router;
