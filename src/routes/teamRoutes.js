import express from 'express';
import {
    getTeamMembers,
    getDepartments,
    inviteTeamMember,
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
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Team routes
router.get('/members', protect, getTeamMembers);
router.get('/departments', protect, getDepartments);
router.post('/members', protect, admin, inviteTeamMember);

export default router;
