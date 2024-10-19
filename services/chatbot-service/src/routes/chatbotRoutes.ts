import express from 'express';
import { processPrompt } from '../controllers/chatbotController';
import protect from '../middleware/authMiddleware';

const router = express.Router();

router.post('/prompt', protect, processPrompt);

export default router;
