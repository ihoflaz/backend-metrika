import express from 'express';
import {
    getKpiDashboard,
    getRevenueData,
    getProjectPerformance,
    getCompletionStats,
    getActiveIssues,
    getTeamPerformance,
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    getKpiById,
    recordKpiValue,
    getKpiHistory,
} from '../controllers/kpiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Dashboard endpoints
router.get('/dashboard', protect, getKpiDashboard);
router.get('/revenue', protect, getRevenueData);
router.get('/project-performance', protect, getProjectPerformance);
router.get('/completion-stats', protect, getCompletionStats);
router.get('/issues', protect, getActiveIssues);
router.get('/team-performance', protect, getTeamPerformance);

// Goals CRUD
router.route('/goals')
    .get(protect, getGoals)
    .post(protect, createGoal);

router.route('/goals/:id')
    .patch(protect, updateGoal)
    .delete(protect, deleteGoal);

// Individual KPI management (aliases for goals)
router.get('/:id', protect, getKpiById);
router.patch('/:id', protect, updateGoal);
router.delete('/:id', protect, deleteGoal);
router.post('/:id/record', protect, recordKpiValue);
router.get('/:id/history', protect, getKpiHistory);

export default router;
