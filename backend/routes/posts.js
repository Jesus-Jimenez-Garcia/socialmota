import { Router } from 'express';
import { createPost, getAllPosts, getFollowedPosts, getUserPosts, updatePost, deletePost, getPopularPosts, getFollowedPostsByLikes } from '../controllers/postController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para crear una nueva publicación
// POST /posts
// Llama al controlador createPost
// Requiere autenticación
router.post('/', authenticateToken, createPost);

// Ruta para obtener todas las publicaciones
// GET /posts
// Llama al controlador getAllPosts
// Requiere autenticación
router.get('/', authenticateToken, getAllPosts);

// Ruta para obtener las publicaciones de los usuarios seguidos
// GET /posts/followed
// Llama al controlador getFollowedPosts
// Requiere autenticación
router.get('/followed', authenticateToken, getFollowedPosts);

// Ruta para obtener las publicaciones de los usuarios seguidos ordenadas por likes
// GET /posts/followed/likes
// Llama al controlador getFollowedPostsByLikes
// Requiere autenticación
router.get('/followed/likes', authenticateToken, getFollowedPostsByLikes);

// Ruta para obtener las publicaciones más populares
// GET /posts/popular
// Llama al controlador getPopularPosts
// Requiere autenticación
router.get('/popular', authenticateToken, getPopularPosts);

// Ruta para obtener las publicaciones del usuario autenticado
// GET /posts/user
// Llama al controlador getUserPosts
// Requiere autenticación
router.get('/user', authenticateToken, getUserPosts);

// Ruta para actualizar una publicación
// PUT /posts/:id
// Llama al controlador updatePost
// Requiere autenticación
router.put('/:id', authenticateToken, updatePost);

// Ruta para borrar una publicación
// DELETE /posts/:id
// Llama al controlador deletePost
// Requiere autenticación
router.delete('/:id', authenticateToken, deletePost);

export default router;
