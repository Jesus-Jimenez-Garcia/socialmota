import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para registrar un nuevo usuario
router.post('/register', registerUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

// Ruta para cerrar sesión
router.post('/logout', authenticateToken, logoutUser);

export default router;
