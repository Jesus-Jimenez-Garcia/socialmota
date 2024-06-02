import { Router } from 'express';
import { sendMessage, getMessages } from '../controllers/messageController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/', authenticateToken, sendMessage);
router.get('/:contactId', authenticateToken, getMessages);

export default router;
