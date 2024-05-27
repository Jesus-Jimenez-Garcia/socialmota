import { Router } from 'express';
import { likePost, unlikePost } from '../controllers/likeController.js';

const router = Router();

// Ruta para dar "me gusta" a una publicación
router.post('/', likePost);

// Ruta para quitar "me gusta" a una publicación
router.delete('/:id', unlikePost);

export default router;
