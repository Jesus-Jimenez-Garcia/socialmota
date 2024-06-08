import { Router } from 'express';
import { getAllUsers, getUserProfile, updateUser, deleteUser, changePassword, getUserDetails } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para obtener todos los usuarios con paginación
// GET /users
// Llama al controlador getAllUsers
// Requiere autenticación
router.get('/', authenticateToken, getAllUsers);

// Ruta para obtener el perfil del usuario autenticado
// GET /users/profile
// Llama al controlador getUserProfile
// Requiere autenticación
router.get('/profile', authenticateToken, getUserProfile);

// Ruta para obtener los detalles de un usuario específico
// GET /users/:id
// Llama al controlador getUserDetails
// Requiere autenticación
router.get('/:id', authenticateToken, getUserDetails);

// Ruta para actualizar un usuario
// PUT /users/:id
// Llama al controlador updateUser
// Requiere autenticación
router.put('/:id', authenticateToken, updateUser);

// Ruta para borrar el perfil del usuario autenticado
// DELETE /users/profile
// Llama al controlador deleteUser
// Requiere autenticación
router.delete('/profile', authenticateToken, deleteUser);

// Ruta para cambiar la contraseña del usuario
// POST /users/change-password
// Llama al controlador changePassword
// Requiere autenticación
router.post('/change-password', authenticateToken, changePassword);

export default router;
