import express from 'express';
import {
    getProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
    getProjectStats,
    getProjectTimeline,
    getProjectBurndown,
    getProjectTasks,
    getProjectMembers,
    addProjectMember,
    updateProjectMember,
    removeProjectMember,
    getProjectDocuments,
    getProjectKpis,
    addProjectKpi,
    getProjectSprints,
    createProjectSprint,
    getCurrentSprint
} from '../controllers/projectController.js';
import { reorderTasks } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getProjects)
    .post(protect, createProject);

router.get('/stats', protect, getProjectStats);

router.route('/:id')
    .get(protect, getProjectById)
    .patch(protect, updateProject)
    .delete(protect, deleteProject);

// Project sub-resources
router.get('/:id/timeline', protect, getProjectTimeline);
router.get('/:id/burndown', protect, getProjectBurndown);
router.get('/:id/tasks', protect, getProjectTasks);
router.patch('/:id/tasks/reorder', protect, reorderTasks);

router.route('/:id/members')
    .get(protect, getProjectMembers)
    .post(protect, addProjectMember);
router.route('/:id/members/:userId')
    .patch(protect, updateProjectMember)
    .delete(protect, removeProjectMember);

router.get('/:id/documents', protect, getProjectDocuments);

router.route('/:id/kpis')
    .get(protect, getProjectKpis)
    .post(protect, addProjectKpi);

router.route('/:id/sprints')
    .get(protect, getProjectSprints)
    .post(protect, createProjectSprint);

router.get('/:id/current-sprint', protect, getCurrentSprint);

export default router;
