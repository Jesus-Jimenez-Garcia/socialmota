import { Router } from 'express';
import { getUserProfile, updateUser, deleteUser, getAllUsers } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para obtener todos los usuarios con paginación
router.get('/', authenticateToken, getAllUsers);

// Ruta para obtener el perfil del usuario autenticado
router.get('/profile', authenticateToken, getUserProfile);

// Ruta para actualizar un usuario
router.put('/:id', authenticateToken, updateUser);

// Ruta para borrar un usuario
router.delete('/:id', authenticateToken, deleteUser);

export default router;
