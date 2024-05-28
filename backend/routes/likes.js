import { Router } from 'express';
import { likePost, unlikePost } from '../controllers/likeController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para dar "me gusta" a una publicación
router.post('/', authenticateToken, likePost);

// Ruta para quitar "me gusta" a una publicación
router.delete('/:id', authenticateToken, unlikePost);

export default router;
