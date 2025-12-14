import express from 'express';
import {
    getSprintById,
    updateSprint,
    startSprint,
    completeSprint,
} from '../controllers/sprintController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:id', protect, getSprintById);
router.patch('/:id', protect, updateSprint);
router.patch('/:id/start', protect, startSprint);
router.patch('/:id/complete', protect, completeSprint);

export default router;
