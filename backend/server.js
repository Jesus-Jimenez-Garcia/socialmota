import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js';
import commentRoutes from './routes/comments.js';
import likeRoutes from './routes/likes.js';
import followerRoutes from './routes/followers.js';
import { authenticateToken } from './middlewares/authMiddleware.js';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Usar las rutas definidas en los archivos de rutas
app.use('/api/users', userRoutes);
app.use('/api/posts', authenticateToken, postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/comments', authenticateToken, commentRoutes);
app.use('/api/likes', authenticateToken, likeRoutes);
app.use('/api/followers', authenticateToken, followerRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}/`);
});
