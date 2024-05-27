import { Router } from 'express';
import { followUser, unfollowUser } from '../controllers/followerController.js';

const router = Router();

// Ruta para seguir a un usuario
router.post('/', followUser);

// Ruta para dejar de seguir a un usuario
router.delete('/', unfollowUser);

export default router;
