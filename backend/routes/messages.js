import { Router } from 'express';
import { sendMessage, getMessages, getConversations } from '../controllers/messageController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/', authenticateToken, sendMessage);
router.get('/:contactId', authenticateToken, getMessages);
router.get('/', authenticateToken, getConversations); // Nueva ruta para obtener conversaciones

export default router;