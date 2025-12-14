import express from 'express';
import {
    getDashboardStats,
    getActiveProjects,
    getUpcomingTasks
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, getDashboardStats);
router.get('/active-projects', protect, getActiveProjects);
router.get('/upcoming-tasks', protect, getUpcomingTasks);
// Add others like /ai-suggestions, /risk-alerts later

export default router;
