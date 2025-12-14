import express from 'express';
import {
    getKpiDashboard,
    getRevenueData,
    getProjectPerformance,
    getCompletionStats,
    getActiveIssues,
} from '../controllers/kpiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, getKpiDashboard);
router.get('/revenue', protect, getRevenueData);
router.get('/project-performance', protect, getProjectPerformance);
router.get('/completion-stats', protect, getCompletionStats);
router.get('/issues', protect, getActiveIssues);

export default router;
