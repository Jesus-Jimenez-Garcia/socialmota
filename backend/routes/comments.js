import { Router } from 'express';
import { getComments, createComment, deleteComment } from '../controllers/commentController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para obtener comentarios de un post
router.get('/:id', authenticateToken, getComments);


// Ruta para crear un nuevo comentario
router.post('/', authenticateToken, createComment);

// Ruta para borrar un comentario
router.delete('/:id', authenticateToken, deleteComment);

export default router;
