import { Router } from 'express';
import { followUser, unfollowUser, getFollowedUsers, getFollowers } from '../controllers/followerController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para seguir a un usuario
router.post('/', authenticateToken, followUser);

// Ruta para dejar de seguir a un usuario
router.delete('/', authenticateToken, unfollowUser);

// Ruta para obtener la lista de seguidos del usuario autenticado
router.get('/followed', authenticateToken, getFollowedUsers);

// Ruta para obtener la lista de seguidores del usuario autenticado
router.get('/followers', authenticateToken, getFollowers);

export default router;
