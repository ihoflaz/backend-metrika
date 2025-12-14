import express from 'express';
import {
    searchGlobal,
    getHelpArticles,
    getDepartments,
    getTeamMembers,
    getKpiDashboard,
    getCalendarEvents,
    getUnreadMessagesCount
} from '../controllers/mockController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/search', protect, searchGlobal);
router.get('/help/articles', protect, getHelpArticles);
router.get('/team/departments', protect, getDepartments);
router.get('/team/members', protect, getTeamMembers);
router.get('/kpi/dashboard', protect, getKpiDashboard);
router.get('/calendar/events', protect, getCalendarEvents);
router.get('/messages/unread-count', protect, getUnreadMessagesCount);

// Wildcard catch-all routes removed due to Express 5 path-to-regexp compatibility issues
// Specific routes above should handle the main use cases

export default router;
