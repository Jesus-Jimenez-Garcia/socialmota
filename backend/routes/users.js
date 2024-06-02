import { Router } from 'express';
import { getAllUsers, getUserProfile, updateUser, deleteUser, changePassword, getUserDetails } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para obtener todos los usuarios con paginación
router.get('/', authenticateToken, getAllUsers);

// Ruta para obtener el perfil del usuario autenticado
router.get('/profile', authenticateToken, getUserProfile);

// Ruta para obtener los detalles de un usuario específico
router.get('/:id', authenticateToken, getUserDetails);

// Ruta para actualizar un usuario
router.put('/:id', authenticateToken, updateUser);

// Ruta para borrar el perfil del usuario autenticado
router.delete('/profile', authenticateToken, deleteUser);

// Ruta para cambiar la contraseña del usuario
router.post('/change-password', authenticateToken, changePassword);

export default router;
