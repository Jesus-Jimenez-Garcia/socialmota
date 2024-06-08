import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';

const router = Router();

// Ruta para registrar un nuevo usuario
// POST /auth/register
// Llama al controlador registerUser
router.post('/register', registerUser);

// Ruta para iniciar sesión
// POST /auth/login
// Llama al controlador loginUser
router.post('/login', loginUser);

// Ruta para cerrar sesión
// POST /auth/logout
// Llama al controlador logoutUser
router.post('/logout', logoutUser);

export default router;
