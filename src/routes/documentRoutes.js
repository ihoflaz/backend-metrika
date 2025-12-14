import express from 'express';
import {
    getDocuments,
    getDocumentById,
    uploadDocument,
    updateDocument,
    deleteDocument,
    analyzeDocument,
    getDocumentAnalysis
} from '../controllers/documentController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', protect, getDocuments);
router.post('/upload', protect, upload.single('file'), uploadDocument);

router.route('/:id')
    .get(protect, getDocumentById)
    .patch(protect, updateDocument)
    .delete(protect, deleteDocument);

router.post('/:id/analyze', protect, analyzeDocument);
router.get('/:id/analysis', protect, getDocumentAnalysis);

export default router;
