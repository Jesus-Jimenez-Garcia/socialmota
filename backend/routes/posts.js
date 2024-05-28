import { Router } from 'express';
import { createPost, getAllPosts, getFollowedPosts, getUserPosts, updatePost, deletePost } from '../controllers/postController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para crear una nueva publicación
router.post('/', authenticateToken, createPost);

// Ruta para obtener todas las publicaciones
router.get('/', getAllPosts);

// Ruta para obtener las publicaciones de los usuarios seguidos
router.get('/followed', authenticateToken, getFollowedPosts);

// Ruta para obtener las publicaciones del usuario autenticado
router.get('/my-posts', authenticateToken, getUserPosts);

// Ruta para actualizar una publicación
router.put('/:id', authenticateToken, updatePost);

// Ruta para borrar una publicación
router.delete('/:id', authenticateToken, deletePost);

export default router;

