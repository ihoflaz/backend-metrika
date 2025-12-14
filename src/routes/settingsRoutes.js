import express from 'express';
import {
    getNotificationSettings,
    updateNotificationSettings,
} from '../controllers/settingsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/notifications')
    .get(protect, getNotificationSettings)
    .patch(protect, updateNotificationSettings);

export default router;
