import { Router } from 'express';
import { followUser, unfollowUser, getFollowedUsers, getFollowers } from '../controllers/followerController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para seguir a un usuario
// POST /followers
// Llama al controlador followUser
// Requiere autenticación
router.post('/', authenticateToken, followUser);

// Ruta para dejar de seguir a un usuario
// DELETE /followers
// Llama al controlador unfollowUser
// Requiere autenticación
router.delete('/', authenticateToken, unfollowUser);

// Ruta para obtener la lista de seguidos del usuario autenticado
// GET /followers/followed
// Llama al controlador getFollowedUsers
// Requiere autenticación
router.get('/followed', authenticateToken, getFollowedUsers);

// Ruta para obtener la lista de seguidores del usuario autenticado
// GET /followers/followers
// Llama al controlador getFollowers
// Requiere autenticación
router.get('/followers', authenticateToken, getFollowers);

export default router;
