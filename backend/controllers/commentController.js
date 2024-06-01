import db from '../config/db.js';

// Obtener comentarios de un post
export const getComments = async (req, res) => {
  const postId = req.params.id;
  try {
      const query = 'SELECT Comments.*, Users.username FROM Comments JOIN Users ON Comments.user_id = Users.id WHERE post_id = ?';
      const [results] = await db.execute(query, [postId]);
      res.status(200).json(results);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};


// Crear un nuevo comentario
export const createComment = async (req, res) => {
    const userId = req.user.userId;
    const { post_id, comment } = req.body;
    try {
        const query = 'INSERT INTO Comments (post_id, user_id, comment) VALUES (?, ?, ?)';
        await db.execute(query, [post_id, userId, comment]);
        res.status(201).json({ mensaje: 'Comentario creado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Borrar un comentario
export const deleteComment = async (req, res) => {
    const commentId = req.params.id;
    const userId = req.user.userId;

    try {
        // Verificar que el comentario pertenece al usuario autenticado
        const [comment] = await db.execute('SELECT * FROM Comments WHERE id = ? AND user_id = ?', [commentId, userId]);
        if (comment.length === 0) {
            return res.status(403).json({ mensaje: 'Acceso denegado' });
        }

        const query = 'DELETE FROM Comments WHERE id = ?';
        const [results] = await db.execute(query, [commentId]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Comentario no encontrado' });
        }
        res.status(200).json({ mensaje: 'Comentario borrado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
