import express from 'express';
import {
    getProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
    getProjectStats,
} from '../controllers/projectController.js';
import { reorderTasks } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getProjects)
    .post(protect, createProject);

router.get('/stats', protect, getProjectStats);

router.patch('/:id/tasks/reorder', protect, reorderTasks); // Added route here

router.route('/:id')
    .get(protect, getProjectById)
    .patch(protect, updateProject)
    .delete(protect, deleteProject);

export default router;
