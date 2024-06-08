import { Router } from 'express';
import { getComments, createComment, deleteComment } from '../controllers/commentController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para obtener comentarios de un post
// GET /comments/:id
// Llama al controlador getComments
// Requiere autenticación
router.get('/:id', authenticateToken, getComments);

// Ruta para crear un nuevo comentario
// POST /comments
// Llama al controlador createComment
// Requiere autenticación
router.post('/', authenticateToken, createComment);

// Ruta para borrar un comentario
// DELETE /comments/:id
// Llama al controlador deleteComment
// Requiere autenticación
router.delete('/:id', authenticateToken, deleteComment);

export default router;
