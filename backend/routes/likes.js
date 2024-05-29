import { Router } from 'express';
import { likePost, unlikePost, checkLikeStatus } from '../controllers/likeController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para dar "me gusta" a una publicación
router.post('/', authenticateToken, likePost);

// Ruta para quitar "me gusta" a una publicación
router.delete('/', authenticateToken, unlikePost);

// Ruta para verificar el estado del "me gusta" de una publicación
router.post('/status', authenticateToken, checkLikeStatus);

export default router;
