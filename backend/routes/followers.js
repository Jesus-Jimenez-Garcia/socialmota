import { Router } from 'express';
import { followUser, unfollowUser } from '../controllers/followerController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para seguir a un usuario
router.post('/', authenticateToken, followUser);

// Ruta para dejar de seguir a un usuario
router.delete('/', authenticateToken, unfollowUser);

export default router;
