import { Router } from 'express';
import { createComment, deleteComment } from '../controllers/commentController.js';

const router = Router();

// Ruta para crear un nuevo comentario
router.post('/', createComment);

// Ruta para borrar un comentario
router.delete('/:id', deleteComment);

export default router;
