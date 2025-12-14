import express from 'express';
import {
    getDashboardStats,
    getActiveProjects,
    getUpcomingTasks,
    getAiSuggestions,
    getKpiSummary,
    getRiskAlerts
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, getDashboardStats);
router.get('/active-projects', protect, getActiveProjects);
router.get('/upcoming-tasks', protect, getUpcomingTasks);
router.get('/ai-suggestions', protect, getAiSuggestions);
router.get('/kpi-summary', protect, getKpiSummary);
router.get('/risk-alerts', protect, getRiskAlerts);

export default router;
