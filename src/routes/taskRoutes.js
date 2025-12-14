import express from 'express';
import {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    getTaskStats
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getTasks)
    .post(protect, createTask);

router.get('/stats/by-status', protect, getTaskStats);

router.route('/:id')
    .get(protect, getTaskById)
    .patch(protect, updateTask);

export default router;
