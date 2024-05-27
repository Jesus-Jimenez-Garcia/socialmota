import { Router } from 'express';
import { createPost, getAllPosts, getFollowedPosts, deletePost } from '../controllers/postController.js';

const router = Router();

// Ruta para crear una nueva publicación
router.post('/', createPost);

// Ruta para obtener todas las publicaciones
router.get('/', getAllPosts);

// Ruta para obtener las publicaciones de los usuarios seguidos
router.get('/followed', getFollowedPosts);

// Ruta para borrar una publicación
router.delete('/:id', deletePost);

export default router;
