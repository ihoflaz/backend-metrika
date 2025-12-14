import express from 'express';
import {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTaskComments,
    addTaskComment,
    getTaskActivity,
    getTaskTimeLogs,
    addTaskTimeLog,
    getTaskKpiImpact,
    getTaskAiSuggestions,
    addTaskAttachment,
    createBulkTasks,
    getTaskStats
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getTasks)
    .post(protect, createTask);

router.get('/stats/by-status', protect, getTaskStats);
router.post('/bulk', protect, createBulkTasks);

router.route('/:id')
    .get(protect, getTaskById)
    .patch(protect, updateTask)
    .delete(protect, deleteTask);

router.patch('/:id/status', protect, updateTaskStatus);
router.get('/:id/comments', protect, getTaskComments);
router.post('/:id/comments', protect, addTaskComment);
router.get('/:id/activity', protect, getTaskActivity);
router.get('/:id/time-logs', protect, getTaskTimeLogs);
router.post('/:id/time-logs', protect, addTaskTimeLog);
router.get('/:id/kpi-impact', protect, getTaskKpiImpact);
router.get('/:id/ai-suggestions', protect, getTaskAiSuggestions);
router.post('/:id/attachments', protect, upload.single('file'), addTaskAttachment);

export default router;
