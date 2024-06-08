import { Router } from 'express';
import { likePost, unlikePost, checkLikeStatus } from '../controllers/likeController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para dar "me gusta" a una publicación
// POST /likes
// Llama al controlador likePost
// Requiere autenticación
router.post('/', authenticateToken, likePost);

// Ruta para quitar "me gusta" a una publicación
// DELETE /likes
// Llama al controlador unlikePost
// Requiere autenticación
router.delete('/', authenticateToken, unlikePost);

// Ruta para verificar el estado del "me gusta" de una publicación
// POST /likes/status
// Llama al controlador checkLikeStatus
// Requiere autenticación
router.post('/status', authenticateToken, checkLikeStatus);

export default router;
