import express from 'express';
import {
    getCalendarEvents,
    createCalendarEvent,
    getCalendarEventById,
    updateCalendarEvent,
    deleteCalendarEvent,
    respondToCalendarEvent,
} from '../controllers/calendarController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getCalendarEvents)
    .post(protect, createCalendarEvent);

router.route('/:id')
    .get(protect, getCalendarEventById)
    .patch(protect, updateCalendarEvent)
    .delete(protect, deleteCalendarEvent);

router.patch('/:id/respond', protect, respondToCalendarEvent);

export default router;
