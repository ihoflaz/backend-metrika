import express from 'express';
import {
    getDocuments,
    uploadDocument,
    analyzeDocument
} from '../controllers/documentController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', protect, getDocuments);
router.post('/upload', protect, upload.single('file'), uploadDocument);
router.post('/:id/analyze', protect, analyzeDocument);

export default router;
