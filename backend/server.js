import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js';
import commentRoutes from './routes/comments.js';
import likeRoutes from './routes/likes.js';
import followerRoutes from './routes/followers.js';
import messageRoutes from './routes/messages.js'; // Asegúrate de que esté importado correctamente
import { authenticateToken } from './middlewares/authMiddleware.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/posts', authenticateToken, postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/comments', authenticateToken, commentRoutes);
app.use('/api/likes', authenticateToken, likeRoutes);
app.use('/api/followers', authenticateToken, followerRoutes);
app.use('/api/messages', authenticateToken, messageRoutes); // Asegúrate de que esté usado correctamente

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}/`);
});
