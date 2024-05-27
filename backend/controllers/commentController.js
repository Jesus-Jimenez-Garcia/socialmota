import db from '../db.js';

// Crear un nuevo comentario
export const createComment = async (req, res) => {
    const { post_id, user_id, comment } = req.body;
    try {
        const query = 'INSERT INTO Comments (post_id, user_id, comment) VALUES (?, ?, ?)';
        await db.execute(query, [post_id, user_id, comment]);
        res.status(201).json({ mensaje: 'Comentario creado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Borrar un comentario
export const deleteComment = async (req, res) => {
    const commentId = req.params.id;
    try {
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
