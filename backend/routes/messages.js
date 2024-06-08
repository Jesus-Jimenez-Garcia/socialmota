import { Router } from 'express';
import { sendMessage, getMessages, getConversations } from '../controllers/messageController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para enviar un mensaje
// POST /messages
// Llama al controlador sendMessage
// Requiere autenticación
router.post('/', authenticateToken, sendMessage);

// Ruta para obtener los mensajes entre el usuario autenticado y un contacto específico
// GET /messages/:contactId
// Llama al controlador getMessages
// Requiere autenticación
router.get('/:contactId', authenticateToken, getMessages);

// Ruta para obtener todas las conversaciones del usuario autenticado
// GET /messages
// Llama al controlador getConversations
// Requiere autenticación
router.get('/', authenticateToken, getConversations); // Nueva ruta para obtener conversaciones

export default router;
