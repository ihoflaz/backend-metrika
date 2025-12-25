import express from 'express';
import { authUser, registerUser } from '../controllers/authController.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(authUser));

export default router;
