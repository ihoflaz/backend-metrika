import express from 'express';
import {
    getAnalyses,
    getAnalysisById,
    saveAnalysis,
    shareAnalysis,
    generateShareLink,
    markActionAsTask,
} from '../controllers/analysisController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAnalyses);
router.get('/:id', protect, getAnalysisById);
router.patch('/:id/save', protect, saveAnalysis);
router.post('/:id/share', protect, shareAnalysis);
router.post('/:id/generate-link', protect, generateShareLink);
router.patch('/:id/actions/:actionId/mark-as-task', protect, markActionAsTask);

export default router;
