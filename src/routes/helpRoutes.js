import express from 'express';
import {
    searchHelp,
    getHelpArticles,
    getFAQ,
    createSupportTicket,
} from '../controllers/settingsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/search', protect, searchHelp);
router.get('/articles', protect, getHelpArticles);
router.get('/faq', protect, getFAQ);
router.post('/support-ticket', protect, createSupportTicket);

export default router;
