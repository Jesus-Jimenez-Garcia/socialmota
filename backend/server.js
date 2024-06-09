/**
 * @author Jesús Jiménez García
 */


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js';
import commentRoutes from './routes/comments.js';
import likeRoutes from './routes/likes.js';
import followerRoutes from './routes/followers.js';
import messageRoutes from './routes/messages.js'; // Importa las rutas de mensajes
import { authenticateToken } from './middlewares/authMiddleware.js';
import errorHandler from './middlewares/errorHandler.js';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Crear una instancia de la aplicación Express
const app = express();
const port = process.env.PORT || 5000;

// Configuración de CORS para permitir solicitudes desde el frontend
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

// Usar CORS con las opciones configuradas
app.use(cors(corsOptions));

// Middleware para parsear solicitudes JSON
app.use(express.json());

// Rutas para los diferentes módulos de la aplicación
// Rutas de usuarios
app.use('/api/users', userRoutes);

// Rutas de publicaciones (protegidas por autenticación)
app.use('/api/posts', authenticateToken, postRoutes);

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de comentarios (protegidas por autenticación)
app.use('/api/comments', authenticateToken, commentRoutes);

// Rutas de likes (protegidas por autenticación)
app.use('/api/likes', authenticateToken, likeRoutes);

// Rutas de seguidores (protegidas por autenticación)
app.use('/api/followers', authenticateToken, followerRoutes);

// Rutas de mensajes (protegidas por autenticación)
app.use('/api/messages', authenticateToken, messageRoutes);

// Middleware para manejar errores
app.use(errorHandler);

// Iniciar el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}/`);
});
