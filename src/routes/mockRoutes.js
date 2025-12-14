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

// Add catch-all for other sub-routes to prevent 404s on frontend fetch
// Express 5 requires named parameters with explicit regex for wildcards
router.get('/help/:path(.*)', (req, res) => res.json([]));
router.get('/kpi/:path(.*)', (req, res) => res.json({}));
router.get('/calendar/:path(.*)', (req, res) => res.json([]));

export default router;
